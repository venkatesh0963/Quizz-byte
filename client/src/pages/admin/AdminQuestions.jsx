import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { Loader2, Plus, Edit2, Trash2, X } from 'lucide-react';

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({ 
    categoryId: '', question: '', options: ['', '', '', ''], correctAnswer: '', explanation: '', difficulty: 'Medium', marks: 1 
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {
    try {
      const [qRes, cRes] = await Promise.all([
        api.get('/questions'),
        api.get('/categories')
      ]);
      setQuestions(qRes.data);
      setCategories(cRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/questions/${currentQuestion._id}`, currentQuestion);
      } else {
        await api.post('/questions', currentQuestion);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save question', error);
      alert(error.response?.data?.message || 'Failed to save question');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await api.delete(`/questions/${id}`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  const openModal = (q = null) => {
    if (q) {
      setCurrentQuestion(q);
      setIsEditing(true);
    } else {
      setCurrentQuestion({ categoryId: categories[0]?._id || '', question: '', options: ['', '', '', ''], correctAnswer: '', explanation: '', difficulty: 'Medium', marks: 1 });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Questions</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow transition-colors"
        >
          <Plus className="w-5 h-5 mr-1" /> Add Question
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
      ) : (
        <div className="glass rounded-xl overflow-hidden premium-shadow">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase w-1/2">Question</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Difficulty</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
              {questions.map((q) => (
                <tr key={q._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                    <p className="line-clamp-2">{q.question}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {q.categoryId?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      q.difficulty === 'Hard' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' :
                      q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30'
                    }`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal({
                      ...q, categoryId: q.categoryId?._id
                    })} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4">
                      <Edit2 className="w-4 h-4 inline" />
                    </button>
                    <button onClick={() => handleDelete(q._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {questions.length === 0 && (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No questions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl premium-shadow overflow-hidden my-8">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {isEditing ? 'Edit Question' : 'New Question'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    required value={currentQuestion.categoryId}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, categoryId: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
                  <select
                    required value={currentQuestion.difficulty}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, difficulty: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Question</label>
                <textarea
                  required rows="2" value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Options (Ensure one is the correct answer)</label>
                {currentQuestion.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-slate-500 text-sm w-4">{idx + 1}.</span>
                    <input
                      type="text" required value={opt} placeholder={`Option ${idx + 1}`}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Correct Answer (Must match an option exactly)</label>
                <select
                    required value={currentQuestion.correctAnswer}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="" disabled>Select correct answer</option>
                    {currentQuestion.options.map((opt, idx) => opt.trim() && (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Explanation (Optional)</label>
                <textarea
                  rows="2" value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, explanation: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestions;
