var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/passportConfig');

// GET auth/signup - send the form for signup
router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

// GET auth/login - send the form to log in
router.get('/login', function(req, res) {
  res.render('auth/login');
});

// POST /auth/signup - processes signup form
router.post('/signup', function(req, res) {
  // looks up user in db
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).spread(function(user, created) {
    if (created) {
      // no record was found, so we created one
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and logged in!'
      })(req, res);
    } else {
      // we found a record, so they can't use that email
      req.flash('error', 'That email already exists!');
      res.redirect('/auth/signup');
    }
  }).catch(function(error) {
    // catch any additional errors
    req.flash('error', error.message);
    res.redirect('/auth/signup');
  });
});


// POST auth/login - processes login form
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  successFlash: 'You have logged in.',
  failureFlash: 'Invalid username and/or password.'
}));

// GET auth/logout - logs user out
router.get('/logout', function(req, res) {
  //passport logout removes req.user and clears session
  req.logout();
  req.flash('success', 'you have logged out. byeeeeee!');
  res.redirect('/');

});

module.exports = router;
