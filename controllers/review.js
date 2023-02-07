const Campground = require('../models/campground');
const Review = require('../models/review');


// Create new Review for the selected campground

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);            // push the review in campground.reviews as objectId
    await review.save();
    await campground.save();
    req.flash('success', 'Posted a new review!');
    res.redirect(`/campgrounds/${campground._id}`);
};

// Delete a Review

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);           // findOneAndDelete will triger middleware findOneAndDelete
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });      // $pull is a mongo operator
    res.redirect(`/campgrounds/${id}`);
};