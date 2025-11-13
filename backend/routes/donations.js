const express = require('express');
const Donation = require('../models/Donation');

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

// PATCH /api/donations/:id/verify - Verify a donation
router.patch('/:id/verify', async (req, res) => {
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

module.exports = router;
