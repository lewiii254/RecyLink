const express = require('express');
const RewardLog = require('../models/RewardLog');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/rewards/history
// @desc    Get user's reward history
// @access  Private
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const rewards = await RewardLog.find({ user: req.user._id })
      .populate('report', 'title status')
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 rewards

    res.json({
      success: true,
      rewards,
      totalRewards: rewards.length
    });

  } catch (error) {
    console.error('Get rewards history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reward history'
    });
  }
});

// @route   GET /api/rewards/stats
// @desc    Get user's reward statistics
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await RewardLog.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalPoints: { $sum: '$pointsAwarded' }
        }
      }
    ]);

    const totalPoints = await RewardLog.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: '$pointsAwarded' }
        }
      }
    ]);

    res.json({
      success: true,
      stats,
      totalPoints: totalPoints[0]?.total || 0
    });

  } catch (error) {
    console.error('Get rewards stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reward statistics'
    });
  }
});

module.exports = router;

// Leaderboard endpoint: GET /api/rewards/leaderboard?limit=10
// Returns top users by points with basic profile info
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);

    const topUsers = await User.find({})
      .select('username points reportsMade role')
      .sort({ points: -1 })
      .limit(limit)
      .lean();

    // Add rank and reports count
    const leaderboard = topUsers.map((u, idx) => ({
      rank: idx + 1,
      id: u._id,
      username: u.username,
      points: u.points || 0,
      reportsCount: Array.isArray(u.reportsMade) ? u.reportsMade.length : 0,
      role: u.role || 'user'
    }));

    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching leaderboard' });
  }
});
