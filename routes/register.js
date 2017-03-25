var express = require('express');
var router = express.Router();

var User = require('../models/user')

/* GET register page. */
router.get('/', function(req, res, next) {
    res.render('register', { errors: null });
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

    if(errors){
        res.render('register',{
            errors: errors
        });
    }
    else{
        var newUser = new User({
            name: name,
            email:email,
            username: username,
            password: password
        });
        User.createUser(newUser, function (err, user) {
            if(err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are successfully registered, you can now login.');
        res.redirect('/login');
    }
});


module.exports = router;
