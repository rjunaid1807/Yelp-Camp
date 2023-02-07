const { campgroundSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');      // Require model Campground which we exported
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {            // it's a passport method auto added to req object
        req.session.returnTo = req.originalUrl     // To redirect the user where they wanted to go before login prompted
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

// Validation on the server side using Joi middleware

module.exports.validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);  // Passing the data(that we get from the user) into the schema
    if (error) {
        const msg = error.details.map(el => el.message).join(',')   // el stands for element
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);  // We get an object from reviewchema.validate and we take error off that object
    if (error) {
        const msg = error.details.map(el => el.message).join(',')   // el stands for element
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {               // AUTHORISATION- Other user can't access it
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {               // AUTHORISATION- Other user can't access it
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}