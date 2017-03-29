var express = require('express');
var router = express.Router();

var User = require('../models/user')

/* GET register page. */
router.get('/', function(req, res, next) {
    if(req.user){
        res.redirect('/home');
    }
    else {
        res.render('register', {errors: null});
    }
});


router.post('/', function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    console.log(name);

    //validation
    req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

    var errors = req.validationErrors();
    console.log("error " , errors);

    User.getUserByEmail(email , function (err1, user1) {
        if (err1) throw err1;
        if (user1) {
            jsonStr = '[ { "param" : "email" , "msg" : "Email already Exists" , "value" : "' + email + '" } ]';
            var obj = JSON.parse(jsonStr);
            console.log(obj);
            console.log("err");
            res.render('register',{
                errors: obj
            });
        }
        else{
            if(errors){
                console.log("err0");
                res.render('register',{
                    errors: errors
                });
            }
            else {

                console.log("INside-register");
                var newUser = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: password
                });
                User.createUser(newUser, function (err, user) {
                    if (err) throw err;
                    console.log(user);
                });

                req.flash('success_msg', 'You are successfully registered, you can now login.');
                res.redirect('/login');
            }
        }



    });



});


module.exports = router;
