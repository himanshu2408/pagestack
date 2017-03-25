/**
 * Created by Nishant Mor on 3/25/2017.
 */
var express =  require('express');
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');

var router = express.Router();

var mongodb = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = mongodb.ObjectID;

var url = 'mongodb://localhost:27017/test';
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended : false}));


function ensureAuthenticated(req, res, next) {
    //console.log(req);
    //console.log(req.user.username);
    console.log(req.user);


   // console.log(user.username);
    if(req.isAuthenticated()){
        return next();
    }
    else {
        req.flash('error_msg', 'You are not logged in');
        res.redirect('/login');
    }
}
/*
router.get('/get_all' , ensureAuthenticated , function (req , res) {

    var resultArray = [];
    mongodb.connect(url , function (err ,db) {
        if(err == null){
            var cursor = db.collection('user_data').find();
            cursor.forEach(function (doc, err) {
                if(err == null){
                    resultArray.unshift(doc);
                }

            }, function () { // callback function once we get all the data
                db.close();
                res.json(resultArray);
            });
        }

    });

});
*/


router.get('/get_all_user' , ensureAuthenticated , function (req , res) {

    var resultArray = [];
    mongodb.connect(url , function (err ,db) {
        if(err == null){
            //  var o_id = new mongodb.ObjectID(req.user._id);
            var cursor = db.collection('user_data').find({"email" : req.user.email });
            cursor.forEach(function (doc, err) {
                if(err == null){
                    resultArray.unshift(doc);
                }

            }, function () { // callback function once we get all the data
                db.close();
                res.json(resultArray);
            });
        }

    });

});



router.post('/insert' ,function (req, res) {


    console.log("body " , req.body);
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();

    var month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] ;
    var date_created =  month_names[mm] +  " " + String(dd) + ", " + String(yyyy) ;
    console.log("Date created : " , date_created);

    var link = req.body.url_name;
    var title = "";
    var summary = "";
    var item = {} ;

    request(link, function(error, response, html) {
            if (!error) {
                var $ = cheerio.load(html , {decodeEntities: true});
                title = $('title').text();
                summary = $('p').text();
                summary = summary.substring(0,500);
                console.log(title);



                var item = {
                    url : link,
                    created : date_created,
                    title : title,
                    summary : summary,
                    email : req.user.email

                };


                mongodb.connect(url,function (err , db) {
                    if(err){
                        return console.dir(err);
                    }else {
                        db.collection('user_data').insertOne(item, function (err, result) {
                            assert.equal(null, err);
                            console.log("ID for the item" + item['_id']);
                            console.log("URL" + String(item['url']));
                            console.log("Item Inserted")
                            db.close();
                            res.json(item);
                        });
                    }
                });

            }
            else{
                console.log(error);

            }
        }
    );

});




module.exports = router;