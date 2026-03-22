const Package = require('../models/Package');

const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json({ success: true, data: packages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createPackage = async (req, res) => {
  try {
    const package_ = await Package.create(req.body);
    res.status(201).json({ success: true, data: package_ });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deletePackage = async (req, res) => {
  try {
    const package_ = await Package.findByIdAndDelete(req.params.id);
    if (!package_) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.status(200).json({ success: true, message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const searchPackages = async (req, res) => {
  try {
    const { query } = req.query;
    const packages = await Package.find({
      title: { $regex: query, $options: 'i' }
    });
    res.status(200).json({ success: true, data: packages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllPackages, createPackage, deletePackage, searchPackages };