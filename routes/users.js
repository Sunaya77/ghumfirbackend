const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, getUserProfile } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getAllUsers);
router.delete('/:id', protect, adminOnly, deleteUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;