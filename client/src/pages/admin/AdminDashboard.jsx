import React, { useEffect, useState } from 'react';
import api from '../../utils/axios';
import { Users, Library, HelpCircle, Activity, Loader2 } from 'lucide-react';

import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, categories, questions, attempts] = await Promise.all([
          api.get('/auth/users'),
          api.get('/categories'),
          api.get('/questions'),
          api.get('/quiz/all-attempts')
        ]);
        
        setStats({
          totalUsers: users.data.filter(u => u.role === 'student').length,
          totalCategories: categories.data.length,
          totalQuestions: questions.data.length,
          totalQuizzesTaken: attempts.data.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const statCards = [
    { name: 'Total Students', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { name: 'Categories', value: stats.totalCategories, icon: Library, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { name: 'Questions', value: stats.totalQuestions, icon: HelpCircle, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { name: 'Quizzes Taken', value: stats.totalQuizzesTaken, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your platform and view analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
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

      <div className="glass p-8 rounded-2xl premium-shadow">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/admin/categories" className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
            <span className="font-semibold block dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Manage Categories</span>
            <span className="text-sm text-slate-500">Create or edit quiz categories</span>
          </Link>
          <Link to="/admin/questions" className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
            <span className="font-semibold block dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Manage Questions</span>
            <span className="text-sm text-slate-500">Add or edit questions</span>
          </Link>
          <Link to="/admin/users" className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
            <span className="font-semibold block dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">View Users</span>
            <span className="text-sm text-slate-500">Manage student accounts and scores</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
