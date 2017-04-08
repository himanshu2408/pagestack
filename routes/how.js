var express = require('express');
var router = express.Router();

/* GET How to page. */
router.get('/' , function(req, res, next) {
    res.render('how',{
        pageTitle: 'How to Page',
        pageID: 'how'
    });
});

module.exports = router;
