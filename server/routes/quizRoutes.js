const express = require('express');
const router = express.Router();
const {
  startQuiz,
  submitQuiz,
  getQuizResult,
  getQuizHistory,
  getAllAttempts,
} = require('../controllers/quizController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/start', protect, startQuiz);
router.post('/submit', protect, submitQuiz);
router.get('/result/:attemptId', protect, getQuizResult);
router.get('/history', protect, getQuizHistory);
router.get('/all-attempts', protect, admin, getAllAttempts);

module.exports = router;
