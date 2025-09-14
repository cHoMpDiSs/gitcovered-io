import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import LearnMore from './components/LearnMore';
import ScrollToTop from './components/ScrollToTop';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import AuthCallback from './components/AuthCallback';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'linear-gradient(90deg, #2563eb, #06b6d4)',
            color: '#fff',
            padding: '16px',
            minHeight: '64px',
          },
          success: {
            style: {
              background: 'linear-gradient(90deg, #2563eb, #06b6d4)',
              color: '#fff',
              padding: '16px',
              minHeight: '64px',
            },
          },
          error: {
            style: {
              background: '#ff4b4b',
              color: '#fff',
              padding: '16px',
              minHeight: '64px',
            },
          },
        }}
      />
      <Router>
        <Theme appearance="light" accentColor="blue" radius="medium">
          <ScrollToTop />
          <Navbar />
        </Theme>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <PrivateRoute requireAdmin={true}>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;