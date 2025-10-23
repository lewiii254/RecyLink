const express = require('express');
const Report = require('../models/Report');
const User = require('../models/User');
const RewardLog = require('../models/RewardLog');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateReportCreation, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/reports
// @desc    Create a new report
// @access  Private
router.post('/', authenticateToken, validateReportCreation, async (req, res) => {
  try {
    const { title, description, location, imageUrl } = req.body;

    // Create new report
    const report = new Report({
      title,
      description,
      location,
      imageUrl,
      reporter: req.user._id
    });

    await report.save();

    // Add report to user's reportsMade array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { reportsMade: report._id }
    });

    // Award points for reporting (25 points)
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { points: 25 } },
      { new: true }
    );

    // Log the reward
    await RewardLog.createReward(
      req.user._id,
      'Reported',
      25,
      report._id,
      'Points awarded for reporting waste issue'
    );

    // Populate reporter info
    await report.populate('reporter', 'username email');

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      report,
      pointsAwarded: 25,
      newTotalPoints: user.points
    });

  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating report'
    });
  }
});

// @route   GET /api/reports
// @desc    Get all reports (admin) or user's reports
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = {};
    
    // If user is not admin, only show their own reports
    if (req.user.role !== 'admin') {
      query.reporter = req.user._id;
    }

    const reports = await Report.find(query)
      .populate('reporter', 'username email')
      .populate('verifiedBy', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reports,
      count: reports.length
    });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reports'
    });
  }
});

// @route   GET /api/reports/:id
// @desc    Get a specific report
// @access  Private
router.get('/:id', authenticateToken, validateObjectId('id'), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reporter', 'username email')
      .populate('verifiedBy', 'username');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user can access this report (own report or admin)
    if (req.user.role !== 'admin' && report.reporter._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own reports.'
      });
    }

    res.json({
      success: true,
      report
    });

  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching report'
    });
  }
});

// @route   PUT /api/reports/:id/verify
// @desc    Verify a report
// @access  Private
router.put('/:id/verify', authenticateToken, validateObjectId('id'), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user already verified this report
    if (report.verifiedBy.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already verified this report'
      });
    }

    // Check if user is trying to verify their own report
    if (report.reporter.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot verify your own report'
      });
    }

    // Add verification
    await report.addVerification(req.user._id);

    // Check if report just got verified (reached 3 verifications)
    if (report.verificationCount === 3 && report.status === 'Verified') {
      // Award points to the reporter (50 points)
      const reporter = await User.findByIdAndUpdate(
        report.reporter,
        { $inc: { points: 50 } },
        { new: true }
      );

      // Log the reward
      await RewardLog.createReward(
        report.reporter,
        'Verified',
        50,
        report._id,
        'Points awarded for report verification by community'
      );

      // Populate the updated report
      await report.populate('reporter', 'username email');
      await report.populate('verifiedBy', 'username');

      return res.json({
        success: true,
        message: 'Report verified successfully and reporter awarded 50 points!',
        report,
        pointsAwardedToReporter: 50
      });
    }

    // Populate the updated report
    await report.populate('reporter', 'username email');
    await report.populate('verifiedBy', 'username');

    res.json({
      success: true,
      message: 'Report verified successfully',
      report,
      verificationsNeeded: 3 - report.verificationCount
    });

  } catch (error) {
    console.error('Verify report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying report'
    });
  }
});

// @route   PUT /api/admin/reports/:id/collect
// @desc    Mark a report as collected (Admin only)
// @access  Private (Admin)
router.put('/:id/collect', authenticateToken, requireAdmin, validateObjectId('id'), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (report.status === 'Collected') {
      return res.status(400).json({
        success: false,
        message: 'Report is already marked as collected'
      });
    }

    // Update report status
    report.status = 'Collected';
    await report.save();

    // Award points to the reporter (100 points)
    const reporter = await User.findByIdAndUpdate(
      report.reporter,
      { $inc: { points: 100 } },
      { new: true }
    );

    // Log the reward
    await RewardLog.createReward(
      report.reporter,
      'Collected',
      100,
      report._id,
      'Points awarded for waste collection completion'
    );

    // Populate the updated report
    await report.populate('reporter', 'username email');
    await report.populate('verifiedBy', 'username');

    res.json({
      success: true,
      message: 'Report marked as collected successfully',
      report,
      pointsAwardedToReporter: 100
    });

  } catch (error) {
    console.error('Collect report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking report as collected'
    });
  }
});

module.exports = router;
