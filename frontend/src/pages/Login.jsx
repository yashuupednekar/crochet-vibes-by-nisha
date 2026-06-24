import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}! 🌸`);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 via-rose-50 to-cream flex items-center justify-center px-4 py-12">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-48 h-48 bg-rose-100 rounded-full opacity-40 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-blush-200 rounded-full opacity-30 blur-3xl"></div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-blush-100">

         
          {/* Header */}
          <div className="text-center mb-8">
            <img
              src={logo}
              alt="Crochet Vibes by Nisha"
              className="w-24 h-24 object-contain mx-auto mb-4 drop-shadow-lg"
            />

            <h1 className="font-display text-3xl text-blush-800 mb-1">
              Welcome Back!
            </h1>

            <p className="font-body text-sm text-blush-400">
              Sign in to your Crochet Vibes account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-blush-300" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nisha@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blush-300" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-11 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blush-300 hover:text-blush-500"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base justify-center mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In 🌸'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-blush-100"></div>
            <span className="font-body text-xs text-blush-300">or</span>
            <div className="flex-1 h-px bg-blush-100"></div>
          </div>

          {/* Register link */}
          <p className="text-center font-body text-sm text-blush-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blush-600 font-medium hover:text-blush-800 transition-colors">
              Create one 🎀
            </Link>
          </p>
        </div>

        {/* Bottom note */}
        <p className="text-center font-body text-xs text-blush-300 mt-4">
          Made with 🌸 by Crochet Vibes
        </p>
      </div>
    </div>
  );
};

export default Login;