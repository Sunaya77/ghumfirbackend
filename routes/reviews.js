const express = require('express');
const router = express.Router();
const { addReview, getPackageReviews, deleteReview } = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/:id', protect, addReview);
router.get('/:id', getPackageReviews);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;