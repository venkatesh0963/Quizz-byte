import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { Clock, ChevronRight, ChevronLeft, Flag, CheckCircle2, Loader2 } from 'lucide-react';

const QuizEngine = () => {
  const { attemptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState(location.state?.questions || []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(!location.state?.questions);

  // If questions weren't passed in state (e.g. refresh), fetch attempt details
  useEffect(() => {
    if (!location.state?.questions) {
      // Since our API currently doesn't expose a 'get quiz in progress' endpoint that returns questions without answers easily,
      // For this implementation, we assume the user must not refresh the page.
      // In a production app, we would fetch the in-progress attempt.
      alert('Quiz session lost due to page refresh. Please start again.');
      navigate('/categories');
    }
  }, [location, navigate]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionSelect = (option) => {
    setAnswers({
      ...answers,
      [questions[currentIdx]._id]: option
    });
  };

  const toggleReview = () => {
    const newSet = new Set(markedForReview);
    const qId = questions[currentIdx]._id;
    if (newSet.has(qId)) {
      newSet.delete(qId);
    } else {
      newSet.add(qId);
    }
    setMarkedForReview(newSet);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formattedAnswers = questions.map(q => ({
        questionId: q._id,
        selectedOption: answers[q._id] || null
      }));

      await api.post('/quiz/submit', {
        attemptId,
        answers: formattedAnswers,
        timeTaken: 600 - timeLeft, // assuming 600s total
      });

      navigate(`/result/${attemptId}`);
    } catch (error) {
      console.error('Failed to submit quiz', error);
      alert('Failed to submit quiz');
      setIsSubmitting(false);
    }
  };

  if (loading || questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const progressPercentage = ((Object.keys(answers).length) / questions.length) * 100;
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Quiz Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-bold text-slate-900 dark:text-white">Question {currentIdx + 1} of {questions.length}</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              currentQ.difficulty === 'Hard' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' :
              currentQ.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' :
              'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30'
            }`}>
              {currentQ.difficulty || 'Medium'}
            </span>
          </div>
          <div className={`flex items-center space-x-2 font-mono text-lg font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-700 dark:text-slate-300'}`}>
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800">
          <div 
            className="h-full bg-primary-500 transition-all duration-300 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Quiz Area */}
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          <div className="glass p-8 rounded-2xl premium-shadow flex-1">
            <h2 className="text-2xl font-medium text-slate-900 dark:text-white leading-relaxed mb-8">
              {currentQ.question}
            </h2>
            
            <div className="space-y-4">
              {currentQ.options.map((option, idx) => {
                const isSelected = answers[currentQ._id] === option;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
                      isSelected 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100 shadow-md' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <span className="text-lg">{option}</span>
                    {isSelected && <CheckCircle2 className="w-6 h-6 text-primary-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between p-4 glass rounded-xl premium-shadow">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="flex items-center px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors font-medium"
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Previous
            </button>
            
            <button
              onClick={toggleReview}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                markedForReview.has(currentQ._id) 
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Flag className={`w-4 h-4 mr-2 ${markedForReview.has(currentQ._id) ? 'fill-current' : ''}`} />
              {markedForReview.has(currentQ._id) ? 'Marked' : 'Mark for Review'}
            </button>

            {currentIdx === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md font-medium transition-colors disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-md font-medium transition-colors"
              >
                Next <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar / Question Navigator */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-2xl premium-shadow sticky top-24">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Question Navigator</h3>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q._id];
                const isMarked = markedForReview.has(q._id);
                const isCurrent = currentIdx === idx;
                
                let btnClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400';
                
                if (isCurrent) {
                  btnClass = 'border-primary-500 ring-2 ring-primary-500/20 text-primary-700 dark:text-primary-300';
                } else if (isMarked) {
                  btnClass = 'bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-900/40 dark:border-amber-700';
                } else if (isAnswered) {
                  btnClass = 'bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-900/40 dark:border-emerald-700';
                }

                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 w-full rounded border flex items-center justify-center font-medium text-sm transition-colors ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-8 space-y-3 text-sm">
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-300 dark:bg-emerald-900/40 mr-3"></div>
                Answered
              </div>
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300 dark:bg-amber-900/40 mr-3"></div>
                Marked for Review
              </div>
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <div className="w-4 h-4 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mr-3"></div>
                Unanswered
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuizEngine;
