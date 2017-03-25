var express =  require('express');
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');

var router = express.Router();

var mongodb = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended : false}));


/* GET users listing. */
router.get('/', function(req, res, next) {

  res.render('user_home' , {
        pageTitle : 'Home',
        pageID : 'user_home'

    });
});

module.exports = router;

