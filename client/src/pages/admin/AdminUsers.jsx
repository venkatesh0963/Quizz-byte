import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { Loader2, User as UserIcon, BookOpen, Target, Clock } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, attemptsRes] = await Promise.all([
          api.get('/auth/users'),
          api.get('/quiz/all-attempts')
        ]);
        
        // Filter only students
        const students = usersRes.data.filter(u => u.role === 'student');
        setUsers(students);
        setAttempts(attemptsRes.data);
      } catch (error) {
        console.error('Failed to fetch users and attempts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // Aggregate user stats based on attempts
  const userStats = users.map(user => {
    const userAttempts = attempts.filter(a => a.userId?._id === user._id || a.userId === user._id);
    const totalQuizzes = userAttempts.length;
    const totalScore = userAttempts.reduce((sum, a) => sum + a.score, 0);
    const avgAccuracy = totalQuizzes > 0 ? (userAttempts.reduce((sum, a) => sum + a.accuracy, 0) / totalQuizzes).toFixed(2) : 0;
    
    return {
      ...user,
      totalQuizzes,
      totalScore,
      avgAccuracy
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Registered Students</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {userStats.map(student => (
          <div key={student._id} className="glass p-6 rounded-2xl premium-shadow flex flex-col">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xl">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{student.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{student.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center mt-auto border-t border-slate-100 dark:border-slate-800 pt-4">
              <div>
                <div className="flex items-center justify-center text-slate-400 mb-1"><BookOpen className="w-4 h-4" /></div>
                <div className="font-bold text-slate-900 dark:text-white">{student.totalQuizzes}</div>
                <div className="text-xs text-slate-500">Quizzes</div>
              </div>
              <div>
                <div className="flex items-center justify-center text-slate-400 mb-1"><Target className="w-4 h-4" /></div>
                <div className="font-bold text-slate-900 dark:text-white">{student.totalScore}</div>
                <div className="text-xs text-slate-500">Score</div>
              </div>
              <div>
                <div className="flex items-center justify-center text-slate-400 mb-1"><Clock className="w-4 h-4" /></div>
                <div className="font-bold text-slate-900 dark:text-white">{student.avgAccuracy}%</div>
                <div className="text-xs text-slate-500">Avg Acc</div>
              </div>
            </div>
          </div>
        ))}
        {userStats.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No students registered yet.
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Recent Quiz Activity</h2>
      <div className="glass rounded-xl overflow-hidden premium-shadow">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Accuracy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
            {attempts.slice(0, 20).map((attempt) => (
              <tr key={attempt._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                  {attempt.userId?.name || 'Unknown Student'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                  {attempt.categoryId?.name || 'Unknown Category'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-600 dark:text-primary-400">
                  {attempt.score}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                  {attempt.accuracy}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                  {new Date(attempt.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {attempts.length === 0 && (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No quiz attempts recorded yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
