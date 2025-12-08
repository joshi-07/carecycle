const express = require('express');
const Donation = require('../models/Donation');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/donations - Create a new donation
router.post('/', async (req, res) => {
  try {
    const { donorName, email, tabletName, expiryDate, unopened } = req.body;
    const donation = new Donation({ donorName, email, tabletName, expiryDate, unopened });
    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/donations - Get all donations
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/donations/:id/verify - Verify a donation (Admin only)
router.patch('/:id/verify', auth, isAdmin, async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/donations/:id - Delete a donation (Admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json({ message: 'Donation deleted successfully' });
  } catch (error) {
    console.error('Delete donation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
