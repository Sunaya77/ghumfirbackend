const Booking = require('../models/Booking');
const Package = require('../models/Package');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const createBooking = async (req, res) => {
  try {
    const package_ = await Package.findById(req.params.id);
    if (!package_) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    if (package_.availableSeats < 1) {
      return res.status(400).json({ success: false, message: 'No seats available' });
    }
    const booking = await Booking.create({
      user: req.user.id,
      package: package_._id,
      totalPrice: package_.price,
      seats: 1
    });
    package_.availableSeats -= 1;
    await package_.save();
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('package', 'title location price image');
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('package', 'title location price');
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email')
     .populate('package', 'title');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (status === 'approved') {
      await sendEmail(
        booking.user.email,
        'Booking Confirmed!',
        `Hi ${booking.user.name}, your booking for ${booking.package.title} has been approved! Total price: Rs. ${booking.totalPrice}`
      );
    }
    if (status === 'cancelled') {
      await sendEmail(
        booking.user.email,
        'Booking Cancelled',
        `Hi ${booking.user.name}, your booking for ${booking.package.title} has been cancelled.`
      );
    }
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const approvedBookings = await Booking.countDocuments({ status: 'approved' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const totalPackages = await Package.countDocuments();
    const totalUsers = await User.countDocuments();
    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        approvedBookings,
        cancelledBookings,
        totalPackages,
        totalUsers
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus, getDashboardStats };