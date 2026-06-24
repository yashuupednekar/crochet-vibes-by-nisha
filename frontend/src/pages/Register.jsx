import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created! Welcome to Crochet Vibes 🌸');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 via-rose-50 to-cream flex items-center justify-center px-4 py-12">
      <div className="absolute top-20 left-10 w-48 h-48 bg-rose-100 rounded-full opacity-40 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-blush-200 rounded-full opacity-30 blur-3xl"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-blush-100">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🌸</div>
            <h1 className="font-display text-3xl text-blush-800 mb-1">Join Us!</h1>
            <p className="font-body text-sm text-blush-400">Create your Crochet Vibes account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-blush-300" size={16} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full pl-11 pr-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-blush-300" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blush-300" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-11 pr-11 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all"
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

            {/* Confirm Password */}
            <div>
              <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blush-300" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-11 pr-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all"
                />
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
                  Creating account...
                </span>
              ) : 'Create Account 🌸'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-blush-100"></div>
            <span className="font-body text-xs text-blush-300">or</span>
            <div className="flex-1 h-px bg-blush-100"></div>
          </div>

          <p className="text-center font-body text-sm text-blush-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blush-600 font-medium hover:text-blush-800 transition-colors">
              Sign in 🧶
            </Link>
          </p>
        </div>

        <p className="text-center font-body text-xs text-blush-300 mt-4">
          Made with 🌸 by Crochet Vibes
        </p>
      </div>
    </div>
  );
};

export default Register;