var homeController = {
  index: function(req, res, next) {
    res.render('index', { title: 'Express', fuck: 'FUCK' });
  }
}

module.exports = homeController;
