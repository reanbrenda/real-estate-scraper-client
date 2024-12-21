// app/login/page.js
"use client";

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
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
      router.push('/'); // Redirect to the homepage after successful login
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0C573C] to-[#09422D] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-12 bg-white p-10 rounded-xl shadow-2xl">
        {/* Company Branding */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-[#0C573C]">LUCCA</h1>
          <p className="mt-2 text-gray-600 text-lg">
            Your trusted partner in real estate solutions.
          </p>
        </div>

        {/* Welcome Message */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#0C573C]">Welcome Back!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to continue.
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-[#0C573C] focus:border-[#0C573C] sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-[#0C573C] focus:border-[#0C573C] sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center mt-2">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0C573C] hover:bg-[#09422D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0C573C] transition-all"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
