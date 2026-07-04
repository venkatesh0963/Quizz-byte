const QuizAttempt = require('../models/QuizAttempt');
const Question = require('../models/Question');
const mongoose = require('mongoose');

// @desc    Start a quiz
// @route   POST /api/quiz/start
// @access  Private
const startQuiz = async (req, res) => {
  try {
    const { categoryId, numQuestions } = req.body;

    // Fetch random questions from the category
    const questions = await Question.aggregate([
      { $match: { categoryId: new mongoose.Types.ObjectId(categoryId) } },
      { $sample: { size: Number(numQuestions) || 10 } },
    ]);

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this category' });
    }

    const questionIds = questions.map((q) => q._id);

    // Create a new Quiz Attempt
    const attempt = await QuizAttempt.create({
      userId: req.user._id,
      categoryId,
      selectedQuestions: questionIds,
      answers: [],
    });

    // Send back the attempt ID and questions (without correct answers)
    const sanitizedQuestions = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options.sort(() => Math.random() - 0.5), // shuffle options
      difficulty: q.difficulty,
      marks: q.marks,
      image: q.image,
    }));

    res.status(201).json({
      attemptId: attempt._id,
      questions: sanitizedQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit a quiz
// @route   POST /api/quiz/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { attemptId, answers, timeTaken } = req.body;

    const attempt = await QuizAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({ message: 'Quiz attempt not found' });
    }

    if (attempt.completedAt && attempt.answers.length > 0) {
      return res.status(400).json({ message: 'Quiz already submitted' });
    }

    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const evaluatedAnswers = [];

    // Evaluate answers
    for (const ans of answers) {
      const question = await Question.findById(ans.questionId);
      
      let isCorrect = false;
      if (ans.selectedOption === null || ans.selectedOption === undefined || ans.selectedOption === '') {
        unansweredCount++;
      } else if (question.correctAnswer === ans.selectedOption) {
        isCorrect = true;
        correctCount++;
        score += question.marks;
      } else {
        wrongCount++;
        // Optional: negative marking logic here
      }

      evaluatedAnswers.push({
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect,
      });
    }

    // Handle any missing questions in the payload as unanswered
    const totalQuestions = attempt.selectedQuestions.length;
    if (answers.length < totalQuestions) {
       unansweredCount += (totalQuestions - answers.length);
    }

    const accuracy = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(2) : 0;

    attempt.answers = evaluatedAnswers;
    attempt.score = score;
    attempt.correctAnswers = correctCount;
    attempt.wrongAnswers = wrongCount;
    attempt.unanswered = unansweredCount;
    attempt.accuracy = accuracy;
    attempt.timeTaken = timeTaken;
    attempt.completedAt = Date.now();

    await attempt.save();

    res.json({ message: 'Quiz submitted successfully', attemptId: attempt._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quiz result
// @route   GET /api/quiz/result/:attemptId
// @access  Private
const getQuizResult = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.attemptId)
      .populate('categoryId', 'name image')
      .populate('selectedQuestions', '-__v');

    if (!attempt) {
      return res.status(404).json({ message: 'Quiz attempt not found' });
    }

    if (attempt.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this result' });
    }

    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quiz history for user
// @route   GET /api/quiz/history
// @access  Private
const getQuizHistory = async (req, res) => {
  try {
    const history = await QuizAttempt.find({ userId: req.user._id })
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all quiz attempts (Admin only)
// @route   GET /api/quiz/all-attempts
// @access  Private/Admin
const getAllAttempts = async (req, res) => {
  try {
    const history = await QuizAttempt.find({})
      .populate('categoryId', 'name')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  startQuiz,
  submitQuiz,
  getQuizResult,
  getQuizHistory,
  getAllAttempts,
};
