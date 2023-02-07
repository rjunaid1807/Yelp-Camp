const express = require('express');
const passport = require('passport');
const users = require('../controllers/users');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

// Restructuring by router.route - we can chain the routes with same path. we don't have to specify path for every route.

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);


module.exports = router;
