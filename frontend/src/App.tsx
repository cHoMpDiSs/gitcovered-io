import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AuthCallback from './components/AuthCallback';
import '@radix-ui/themes/styles.css';

function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            minHeight: '64px',
          },
          success: {
            style: {
              background: '#4aed88',
              color: '#000',
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/dashboard" element={<Dashboard isAdmin={true} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;