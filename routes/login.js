var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login');
});


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }
            User.comparePassword(password, user.password, function (err, isMatch) {
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }
                else{
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        });
    }
));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


router.post('/', passport.authenticate('local', {successRedirect: '/home', failureRedirect: '/login', failureFlash: true}) ,
    function(req, res, next) {
    res.redirect('/home')
});

module.exports = router;
