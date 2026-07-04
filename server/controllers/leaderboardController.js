const QuizAttempt = require('../models/QuizAttempt');

// @desc    Get global leaderboard
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await QuizAttempt.aggregate([
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$score' },
          totalQuizzes: { $sum: 1 },
          avgAccuracy: { $avg: '$accuracy' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          name: '$user.name',
          avatar: '$user.avatar',
          totalScore: 1,
          totalQuizzes: 1,
          avgAccuracy: { $round: ['$avgAccuracy', 2] },
        },
      },
      { $sort: { totalScore: -1, avgAccuracy: -1 } },
      { $limit: 100 },
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get category specific leaderboard
// @route   GET /api/leaderboard/category/:id
// @access  Public
const getCategoryLeaderboard = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Convert id to ObjectId for matching
    const mongoose = require('mongoose');
    const categoryId = mongoose.Types.ObjectId(id);

    const leaderboard = await QuizAttempt.aggregate([
      { $match: { categoryId } },
      {
        $group: {
          _id: '$userId',
          bestScore: { $max: '$score' },
          bestAccuracy: { $max: '$accuracy' },
          timeTaken: { $min: '$timeTaken' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          name: '$user.name',
          avatar: '$user.avatar',
          bestScore: 1,
          bestAccuracy: 1,
          timeTaken: 1,
        },
      },
      { $sort: { bestScore: -1, timeTaken: 1 } },
      { $limit: 50 },
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// You can add daily, weekly, monthly by adding $match with date ranges in aggregate

module.exports = {
  getLeaderboard,
  getCategoryLeaderboard,
};
