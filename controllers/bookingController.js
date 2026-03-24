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

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('package', 'title');

    await sendEmail(
      populatedBooking.user.email,
      'Booking Received! - Ghumfir Travel',
      {
        status: 'pending',
        userName: populatedBooking.user.name,
        bookingId: populatedBooking._id,
        packageTitle: populatedBooking.package.title,
        totalPrice: populatedBooking.totalPrice,
        seats: populatedBooking.seats
      }
    );

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
        'Booking Confirmed! - Ghumfir Travel',
        {
          status: 'approved',
          userName: booking.user.name,
          bookingId: booking._id,
          packageTitle: booking.package.title,
          totalPrice: booking.totalPrice,
          seats: booking.seats
        }
      );
    }

    if (status === 'cancelled') {
      await sendEmail(
        booking.user.email,
        'Booking Cancelled - Ghumfir Travel',
        {
          status: 'cancelled',
          userName: booking.user.name,
          bookingId: booking._id,
          packageTitle: booking.package.title,
          totalPrice: booking.totalPrice,
          seats: booking.seats
        }
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