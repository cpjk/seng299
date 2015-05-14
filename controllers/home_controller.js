var index = function(req, res, next) {
  res.render('index', { title: 'Express' });
}

var homeController = {
  index: index
};

module.exports = homeController;
