const express = require('express');
const Donation = require('../models/Donation');
const router = express.Router();

// POST /api/v1/donations - Create a new donation (public)
router.post('/', async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Donation creation error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Error creating donation' 
    });
  }
});

// GET /api/v1/donations - Get all donations (public)
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: donations
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Error fetching donations' 
    });
  }
});

// PATCH /api/v1/donations/:id/verify - Verify a donation (public for now, should be protected)
router.patch('/:id/verify', async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error verifying donation:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Error verifying donation' 
    });
  }
});

// DELETE /api/v1/donations/:id - Delete a donation (public for now, should be protected)
router.delete('/:id', async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Error deleting donation' 
    });
  }
});

module.exports = router;
