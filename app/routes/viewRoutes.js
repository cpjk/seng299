var path = require('path');
var express = require('express');
var router = express.Router();

router.get("/home/:partial_name", function(req, res, next) {
  res.render('partials/home/' + req.params.partial_name);
});

router.get("/users/:partial_name", function(req, res, next) {
  res.render('partials/users/' + req.params.partial_name);
});

router.get("/session/:partial_name", function(req, res, next) {
  res.render('partials/session/' + req.params.partial_name);
});

module.exports = router;
