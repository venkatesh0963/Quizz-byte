const Question = require('../models/Question');
const Category = require('../models/Category');

// @desc    Get all questions (Admin)
// @route   GET /api/questions
// @access  Private/Admin
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({}).populate('categoryId', 'name');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get questions by category
// @route   GET /api/questions/category/:categoryId
// @access  Public
const getQuestionsByCategory = async (req, res) => {
  try {
    const questions = await Question.find({ categoryId: req.params.categoryId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private/Admin
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a question
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = async (req, res) => {
  try {
    const {
      categoryId,
      question,
      options,
      correctAnswer,
      explanation,
      difficulty,
      marks,
      image,
    } = req.body;

    const newQuestion = await Question.create({
      categoryId,
      question,
      options,
      correctAnswer,
      explanation,
      difficulty,
      marks,
      image,
    });

    // Update Category totalQuestions count
    await Category.findByIdAndUpdate(categoryId, { $inc: { totalQuestions: 1 } });

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private/Admin
const updateQuestion = async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedQuestion) {
      res.json(updatedQuestion);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (question) {
      await Category.findByIdAndUpdate(question.categoryId, { $inc: { totalQuestions: -1 } });
      await Question.deleteOne({ _id: question._id });
      res.json({ message: 'Question removed' });
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuestions,
  getQuestionsByCategory,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
