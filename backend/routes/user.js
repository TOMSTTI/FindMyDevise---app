import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import User from '../models/User.js';
import LocationHistory from '../models/LocationHistory.js';

const router = express.Router();

/**
 * @route GET /api/users/me
 * @desc Get current user profile
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route PUT /api/users/tracking
 * @desc Toggle tracking enabled status
 */
router.put('/tracking', verifyToken, async (req, res) => {
  try {
    const { trackingEnabled } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { trackingEnabled },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating tracking status' });
  }
});

/**
 * @route GET /api/users/history
 * @desc Get location history of the current user
 */
router.get('/history', verifyToken, async (req, res) => {
  try {
    const history = await LocationHistory.find({ userId: req.user.userId })
      .sort({ timestamp: -1 })
      .limit(100); // Limit to last 100 points
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching history' });
  }
});

export default router;
