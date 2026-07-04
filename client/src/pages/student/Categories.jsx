import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { Loader2, BookOpen, Layers } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleStartQuiz = async (categoryId) => {
    try {
      // Create a quiz attempt with 10 questions by default for now
      const { data } = await api.post('/quiz/start', { categoryId, numQuestions: 10 });
      navigate(`/quiz/${data.attemptId}`, { state: { questions: data.questions } });
    } catch (error) {
      console.error('Failed to start quiz', error);
      alert(error.response?.data?.message || 'Failed to start quiz');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Choose a Category
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Select a topic below to start testing your knowledge. Each quiz contains 10 random questions from the selected category.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div 
            key={category._id} 
            className="group glass p-6 rounded-2xl premium-shadow hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center border-t border-white/50 dark:border-slate-700/50"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 flex items-center justify-center mb-4 group-hover:shadow-lg transition-all">
              {category.image ? (
                <img src={category.image} alt={category.name} className="w-12 h-12 object-contain" />
              ) : (
                <BookOpen className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              )}
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{category.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 line-clamp-3">
              {category.description}
            </p>
            
            <div className="w-full flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center text-xs font-medium text-slate-500">
                <Layers className="w-4 h-4 mr-1" />
                {category.totalQuestions} Qs
              </span>
              <button
                onClick={() => handleStartQuiz(category._id)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
              >
                Start Quiz
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No categories available yet. Please check back later!
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
