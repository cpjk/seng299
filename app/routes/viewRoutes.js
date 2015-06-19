var path = require('path');
var express = require('express');
var router = express.Router();

// exports.partials = {};

// router.get("/", function(req, res, next) {
//   res.render('layout');
// });

router.get("/users/:partial_name", function(req, res, next) {
  res.render('partials/users/' + req.params.partial_name);
});

module.exports = router;
