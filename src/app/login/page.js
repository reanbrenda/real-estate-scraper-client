// app/login/page.js
"use client";
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      router.push('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0C573C] via-[#09422D] to-[#0C573C]">
      <div className="max-w-md w-full mx-4 space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        {/* Logo & Branding */}
        <div className="text-center space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <h1 className="px-4 text-5xl font-extrabold text-[#0C573C] bg-white">
                LUCCA
              </h1>
            </div>
          </div>
          <p className="text-gray-600">
            Exclusive luxury properties hand-picked for you
          </p>
        </div>

        {/* Welcome Message */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="text-sm text-gray-500">
            Please sign in to access your account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C573C] focus:border-transparent transition-all"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C573C] focus:border-transparent transition-all"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center bg-red-50 py-2 px-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-[#0C573C] hover:bg-[#09422D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0C573C] transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;