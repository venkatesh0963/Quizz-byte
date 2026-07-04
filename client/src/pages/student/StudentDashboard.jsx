import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axios';
import { Trophy, Target, Clock, Activity, Loader2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/quiz/history');
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // Calculate stats
  const totalQuizzes = history.length;
  const highestScore = history.reduce((max, attempt) => Math.max(max, attempt.score), 0);
  const avgAccuracy = totalQuizzes > 0 
    ? (history.reduce((sum, attempt) => sum + attempt.accuracy, 0) / totalQuizzes).toFixed(1) 
    : 0;

  // Chart data
  const chartData = history.slice(0, 10).reverse().map((attempt, index) => ({
    name: `Q${index + 1}`,
    score: attempt.score,
    accuracy: attempt.accuracy,
  }));

  const stats = [
    { name: 'Quizzes Taken', value: totalQuizzes, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { name: 'Highest Score', value: highestScore, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { name: 'Avg Accuracy', value: `${avgAccuracy}%`, icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Here is your learning progress.</p>
        </div>
        <Link to="/categories" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-md transition-all">
          Take a New Quiz
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass p-6 rounded-2xl premium-shadow flex items-center space-x-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-6 rounded-2xl premium-shadow">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Performance History</h3>
          {chartData.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis yAxisId="left" stroke="#64748b" />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-500">
              No data available yet. Take a quiz!
            </div>
          )}
        </div>

        <div className="glass p-6 rounded-2xl premium-shadow flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Attempts</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {history.length > 0 ? history.slice(0, 5).map((attempt) => (
              <div key={attempt._id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-900 dark:text-white">{attempt.categoryId?.name || 'Quiz'}</span>
                  <span className="text-sm font-medium px-2 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-md">
                    Score: {attempt.score}
                  </span>
                </div>
                <div className="flex items-center text-xs text-slate-500 space-x-4">
                  <span className="flex items-center space-x-1">
                    <Target className="h-3 w-3" />
                    <span>{attempt.accuracy}% Acc</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s</span>
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-slate-500 text-center py-4">No recent attempts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
