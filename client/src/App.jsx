import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';

import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminUsers from './pages/admin/AdminUsers';

import Categories from './pages/student/Categories';
import QuizEngine from './pages/student/QuizEngine';
import ResultPage from './pages/student/ResultPage';
import Leaderboard from './pages/student/Leaderboard';

// Basic layouts for now
const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-transparent transition-colors">
    <Navbar />
    <main className="flex-1 flex flex-col">{children}</main>
  </div>
);

// We will build these actual components next
const Home = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
    <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
      Test Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Knowledge</span>
    </h1>
    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
      The ultimate platform to challenge yourself, track your progress, and compete with others across various categories.
    </p>
    <Link to="/categories" className="mt-8 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
      Start Exploring
    </Link>
  </div>
);

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  
  return children;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/categories" 
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/quiz/:attemptId" 
            element={
              <ProtectedRoute>
                <QuizEngine />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/result/:attemptId" 
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/categories" 
            element={
              <ProtectedRoute adminOnly>
                <AdminCategories />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/questions" 
            element={
              <ProtectedRoute adminOnly>
                <AdminQuestions />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
