const express = require('express');
const Donation = require('../models/Donation');
const { protect, authorize } = require('../middleware/protect');
const asyncHandler = require('../middleware/async');

const router = express.Router();

// POST /api/v1/donations - Create a new donation (public)
router.post('/', asyncHandler(async (req, res, next) => {
  const { donorName, email, tabletName, expiryDate, unopened } = req.body;
  
  // Validate required fields
  if (!donorName || !email || !tabletName || !expiryDate) {
    return res.status(400).json({ 
      success: false,
      error: 'Please provide all required fields' 
    });
  }

  const donation = await Donation.create({ 
    donorName, 
    email, 
    tabletName, 
    expiryDate, 
    unopened: unopened || false 
  });
  
  res.status(201).json({
    success: true,
    data: donation
  });
}));

// GET /api/v1/donations - Get all donations (public)
router.get('/', asyncHandler(async (req, res, next) => {
  const donations = await Donation.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: donations
  });
}));

// PATCH /api/v1/donations/:id/verify - Verify a donation (Admin only)
router.patch('/:id/verify', protect, authorize('admin'), asyncHandler(async (req, res, next) => {
  const donation = await Donation.findByIdAndUpdate(
    req.params.id,
    { verified: true },
    { new: true, runValidators: true }
  );
  
  if (!donation) {
    return res.status(404).json({ 
      success: false,
      error: 'Donation not found' 
    });
  }
  
  res.status(200).json({
    success: true,
    data: donation
  });
}));

// DELETE /api/v1/donations/:id - Delete a donation (Admin only)
router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res, next) => {
  const donation = await Donation.findByIdAndDelete(req.params.id);
  
  if (!donation) {
    return res.status(404).json({ 
      success: false,
      error: 'Donation not found' 
    });
  }
  
  res.status(200).json({
    success: true,
    data: {}
  });
}));

module.exports = router;
