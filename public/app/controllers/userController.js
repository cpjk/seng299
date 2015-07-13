var userControllers = angular.module('userControllers',[]);

userControllers.controller('userIndexController', function($http, User) {
  var vm = this;

  User.all()
  .success(function(data, status, headers, config){
    vm.users = data.users;
  });
});

userControllers.controller('userShowController', function($http, $routeParams, $location, User, Booking) {
  var vm = this;
  var username = $routeParams.username;
  vm.userEditUrl = "/users/" + username + "/edit"

  User.get(username)
  .success(function(data, status, headers, config){
    vm.user = data.user;
  })
  .error(function(data, status, headers, config){
    $location.path("/");
  });

  vm.formatDate = function(date){
   return moment(date).format("dddd, MMMM Do YYYY");
  };

  vm.deleteBooking = function(booking){
    Booking.delete(booking)
    .success(function(data, status, headers, config){
      User.get(username)
      .success(function(data, status, headers, config){
        vm.user = data.user;
      });
    })
    .error(function(data, status, headers, config){
    });
  }
});

userControllers.controller('userNewController', function($http, $location, User) {
  var vm = this;

  vm.success = "";

  vm.user = {
    username: "",
    password: "",
    password2: "",
    firstname: "",
    lastname: "",
    email: "",
    key: "",
    confirmed: "false",
    permissions: "user"
  };

  vm.submit = function(){
    if(vm.user.password != vm.user.password2){
      vm.success = "Your passwords do not match!";
    }
    User.create(vm.user)
    .success(function(data, status, headers, config){
      vm.user.key = data.key;
      User.sendConfirmationEmail(vm.user.email, vm.user);
      vm.success = "success!";
      $location.path("/confirm");
    })
    .error(function(data, status, headers, config){
      vm.success = data.message;
    });
  };
});

userControllers.controller('userEditController', function($http, User, $routeParams, $location) {
  var vm = this;
  vm.success = "";

  var originalUsername = $routeParams.username;

  User.get(originalUsername)
  .success(function(data, status, headers, config){
    vm.originalUser = data.user;
  })
  .error(function(data, status, headers, config){
    $location.path("/"); // redirect if the user cannot be found
  });

  vm.updatedUser = {
    username: "",
    firstname: "",
    lastname: "",
    email: ""
  };

  vm.submit = function(){
    User.update(vm.originalUser.username, vm.updatedUser)
    .success(function(data, status, headers, config){
      vm.success = "User updated successfully."
      $location.path("/users/" + data.updatedUser.username);
    })
    .error(function(data, status, headers, config){
      vm.success = "Unable to update user."
    });
  };
});

userControllers.controller('userDeleteController', function($http, User, CurrentUser, $location) {
  var vm = this;
  vm.success = "";

  vm.delete = function(user){
    User.delete(user.username)

    .success(function(data, status, headers, config){
      if(status == 200){
        // The user has been logged out. Update the current user
        CurrentUser.update();
      }
      vm.success = "User deleted successfully."
      $location.path("/users");
    })

    .error(function(data, status, headers, config){
      if(status == 404){
        vm.success = "User could not be found."
      }
      else{
        vm.success = "There was an error with code " + status;
      }
    });
  };
});

function checkPass() {
  //Store the password field objects into variables ...
  var pass1 = document.getElementById('pass1');
  var pass2 = document.getElementById('pass2');
  //Store the Confimation Message Object ...
  var message = document.getElementById('confirmMessage');
  //Compare the values in the password field
  //and the confirmation field
  if(pass1.value == pass2.value){
    //The passwords match.
    //Set the color to the good color and inform
    //the user that they have entered the correct password
    pass2.classList.remove("badbgcolor");
    pass2.classList.add("goodbgcolor");
    message.classList.remove("badcolor");
    message.classList.add("goodcolor");
    message.innerHTML = "Passwords Match!"
  }else{
    //The passwords do not match.
    //Set the color to the bad color and
    //notify the user.
    pass2.classList.remove("goodbgcolor");
    pass2.classList.add("badbgcolor");
    message.classList.remove("goodcolor");
    message.classList.add("badcolor");
    message.innerHTML = "Passwords Do Not Match!"
  }
}
