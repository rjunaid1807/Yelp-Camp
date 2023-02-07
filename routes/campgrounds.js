const express = require('express');
const Campground = require('../models/campground');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// Display all THE campgrounds

router.get('/', catchAsync(campgrounds.index));


// Creating a new campground - GET to show the form and POST to submit the form

router.get('/new', isLoggedIn, campgrounds.renderNewForm);
router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));


// Showing details of a particular campground

router.get('/:id', catchAsync(campgrounds.showCampground));


// Edit the details of a campground

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));


// Delete a campground - Button in show.ejs

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;