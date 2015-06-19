var path = require('path');

exports.partials = {};

exports.index = function(req, res) {
  res.render('layout');
};

exports.partials.users = function(req, res) {
  res.render('partials/users/' + req.params.partial_name);
};
