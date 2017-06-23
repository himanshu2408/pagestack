var express =  require('express');
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');

var router = express.Router();

var mongodb = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost:27017/test';
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended : false}));


function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    else {
        req.flash('error_msg', 'You are not logged in');
        res.redirect('/login');
    }
}


function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    else {
            resultArray = { "status" : "false" };
            return res.json(resultArray);
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

router.get('/get_article_by_id/:id' , ensureAuthenticated , function (req , res) {

    var id = req.params.id;
    console.log(id);
    try {
        var obj_id = require('mongodb').ObjectID(id);
        var resultArray = [];
        mongodb.connect(url , function (err ,db) {
            if(err == null){
                db.collection('user_data').findOne({"_id" : obj_id } , function (err1, doc) {

                    if(err1==null){
                        if(doc){
                            delete doc["email"];
                            doc["status"] = "success";
                            res.json(doc);
                        }
                        else{
                            var r_str = { status: "not found" };
                            res.json(r_str);
                        }
                    }
                    else{
                        var r_str = { status: "error" };
                        res.json(r_str);
                    }

                });
            }

        });

    }
    catch (err){
        var r_str = { status: "error" };
        res.json(r_str);

    }
});




router.get('/isauthenticated' , checkAuthenticated , function (req,res) {
    resultArray = { "status" : "true" ,
        "email" : req.user.email
    };

    return res.json(resultArray);
});


router.delete('/:id', ensureAuthenticated, function (req, res) {
    mongodb.connect(url , function (err ,db) {
        if(err == null){

            db.collection('user_data', function(err, collection) {
                collection.deleteOne({_id: new ObjectId(req.params.id)});
                console.log("card successfully deleted");
            });
        }

    });
});

router.post('/insert' , ensureAuthenticated , function (req, res) {


    console.log("body " , req.body);
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();

    var month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] ;
    var date_created =  month_names[mm] +  " " + String(dd) + ", " + String(yyyy) ;
    console.log("Date created : " , date_created);

    var link = req.body.url_name;
    var title = req.body.title;
    var summary = "";
    var item = {} ;
    var rand = Math.floor((Math.random() * 7) + 1);
    var img_loc = "/img/" + rand + ".jpg";

    request(link, function(error, response, html) {
            if (!error) {
                var $ = cheerio.load(html , {decodeEntities: true});
                summary = $('body').html();
                //summary = summary.substring(0,2000);
                //console.log(title);

                var item = {
                    url : link,
                    created : date_created,
                    title : title,
                    summary : summary,
                    email : req.user.email,
                    img_loc : img_loc

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
