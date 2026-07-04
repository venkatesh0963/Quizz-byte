import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/axios';
import { Trophy, Clock, Target, CheckCircle2, XCircle, AlertCircle, Loader2, ArrowRight, BarChart } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ResultPage = () => {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const { data } = await api.get(`/quiz/result/${attemptId}`);
        setResult(data);
      } catch (error) {
        console.error('Failed to fetch result', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!result) return <div className="p-8 text-center">Result not found.</div>;

  const isPassed = result.accuracy >= 60; // Example pass threshold

  const pieData = [
    { name: 'Correct', value: result.correctAnswers, color: '#10b981' }, // Emerald
    { name: 'Wrong', value: result.wrongAnswers, color: '#ef4444' }, // Red
    { name: 'Unanswered', value: result.unanswered, color: '#94a3b8' }, // Slate
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
      {/* Top Banner */}
      <div className={`rounded-2xl p-8 text-center text-white relative overflow-hidden shadow-xl ${
        isPassed ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-amber-500 to-amber-600'
      }`}>
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
        <div className="relative z-10 flex flex-col items-center">
          <Trophy className="h-16 w-16 mb-4 text-white/90" />
          <h1 className="text-4xl font-extrabold mb-2">
            {isPassed ? 'Congratulations!' : 'Good Effort!'}
          </h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            You have completed the {result.categoryId?.name} quiz. Review your performance below.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Score Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-2xl premium-shadow">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Performance Summary</h3>
            
            <div className="flex justify-center mb-8 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="text-sm text-slate-500 dark:text-slate-400">Total Score</div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{result.score}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="text-sm text-slate-500 dark:text-slate-400">Accuracy</div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{result.accuracy}%</div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                <span className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-2" /> Correct</span>
                <span className="font-bold">{result.correctAnswers}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                <span className="flex items-center"><XCircle className="w-5 h-5 mr-2" /> Wrong</span>
                <span className="font-bold">{result.wrongAnswers}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                <span className="flex items-center"><AlertCircle className="w-5 h-5 mr-2" /> Unanswered</span>
                <span className="font-bold">{result.unanswered}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                <span className="flex items-center"><Clock className="w-5 h-5 mr-2" /> Time Taken</span>
                <span className="font-bold">{Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s</span>
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
              <Link to="/dashboard" className="flex-1 flex justify-center py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg transition-colors font-medium">
                Dashboard
              </Link>
              <Link to="/leaderboard" className="flex-1 flex justify-center py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium shadow-md">
                Leaderboard
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Answers Review */}
        <div className="lg:col-span-2">
          <div className="glass p-6 rounded-2xl premium-shadow h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <BarChart className="w-5 h-5 mr-2 text-primary-500" />
              Detailed Review
            </h3>
            
            <div className="space-y-6 overflow-y-auto pr-2" style={{ maxHeight: '600px' }}>
              {result.answers.map((ans, idx) => {
                const question = result.selectedQuestions.find(q => q._id === ans.questionId);
                if (!question) return null;

                const isCorrect = ans.isCorrect;
                const isUnanswered = ans.selectedOption === null || ans.selectedOption === undefined;

                return (
                  <div key={idx} className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-base font-medium text-slate-900 dark:text-white pr-4">
                        <span className="text-slate-500 mr-2">{idx + 1}.</span>
                        {question.question}
                      </h4>
                      {isCorrect ? (
                        <span className="shrink-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 text-xs font-bold px-2 py-1 rounded flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> +{question.marks}
                        </span>
                      ) : isUnanswered ? (
                        <span className="shrink-0 bg-slate-100 text-slate-600 dark:bg-slate-700 text-xs font-bold px-2 py-1 rounded flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" /> 0
                        </span>
                      ) : (
                        <span className="shrink-0 bg-red-100 text-red-700 dark:bg-red-900/30 text-xs font-bold px-2 py-1 rounded flex items-center">
                          <XCircle className="w-3 h-3 mr-1" /> 0
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <div className={`p-3 rounded-lg text-sm border ${
                        isCorrect 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300'
                          : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
                      }`}>
                        <span className="font-semibold block mb-1">Your Answer:</span>
                        {isUnanswered ? <em className="text-slate-500">Not Answered</em> : ans.selectedOption}
                      </div>
                      
                      {!isCorrect && (
                        <div className="p-3 rounded-lg text-sm bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300">
                          <span className="font-semibold block mb-1">Correct Answer:</span>
                          {question.correctAnswer}
                        </div>
                      )}
                    </div>

                    {question.explanation && (
                      <div className="mt-4 p-4 rounded-lg bg-blue-50/50 border border-blue-100 text-slate-700 dark:bg-blue-900/10 dark:border-blue-900/30 dark:text-slate-300 text-sm">
                        <span className="font-semibold block mb-1 text-blue-800 dark:text-blue-400">Explanation:</span>
                        {question.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
