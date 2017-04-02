var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated , function(req, res, next) {
    res.render('home',{
        pageTitle: 'Home Page',
        pageID: 'home'
    });
});

router.get('/:articleId', ensureAuthenticated , function(req, res, next) {
    res.render('article',{
        pageTitle: 'Article Page',
        pageID: 'article',
        articleId: req.params.articleId
    });
});

function ensureAuthenticated(req, res, next) {

    if(req.isAuthenticated()){
        return next();
    }
    else {
        req.flash('error_msg', 'You are not logged in');
        res.redirect('/login');
    }
}

module.exports = router;
