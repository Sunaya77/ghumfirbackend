const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, updateBookingStatus, getDashboardStats } = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/:id', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/', protect, adminOnly, getAllBookings);
router.patch('/:id', protect, adminOnly, updateBookingStatus);

module.exports = router;