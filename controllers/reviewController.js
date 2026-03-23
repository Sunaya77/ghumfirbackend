const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Package = require('../models/Package');

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const packageId = req.params.id;

    const booking = await Booking.findOne({
      user: req.user.id,
      package: packageId,
      status: 'approved'
    });

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: 'You can only review packages you have booked and approved'
      });
    }

    const existingReview = await Review.findOne({
      user: req.user.id,
      package: packageId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this package'
      });
    }

    const review = await Review.create({
      user: req.user.id,
      package: packageId,
      rating,
      comment
    });

    const reviews = await Review.find({ package: packageId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Package.findByIdAndUpdate(packageId, { rating: avgRating.toFixed(1) });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getPackageReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ package: req.params.id })
      .populate('user', 'name');
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { addReview, getPackageReviews, deleteReview };