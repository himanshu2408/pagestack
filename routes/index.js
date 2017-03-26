var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {
  if(req.user){
      res.redirect('/home');
  }
  else{
      res.render('index', { title: 'Index Page' });
  }
});

module.exports = router;
