const express = require('express');
const router = express.Router();
const { getAllPackages, createPackage, deletePackage, searchPackages } = require('../controllers/packageController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllPackages);
router.get('/search', searchPackages);
router.post('/', protect, adminOnly, createPackage);
router.delete('/:id', protect, adminOnly, deletePackage);

module.exports = router;