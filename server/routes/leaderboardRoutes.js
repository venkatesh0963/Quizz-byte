const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  getCategoryLeaderboard,
} = require('../controllers/leaderboardController');

router.get('/', getLeaderboard);
router.get('/category/:id', getCategoryLeaderboard);

module.exports = router;
