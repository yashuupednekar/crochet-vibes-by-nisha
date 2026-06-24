import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiShoppingBag } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🧶</div>
        <h1 className="font-display text-5xl text-blush-800 mb-3">404</h1>
        <h2 className="font-display text-2xl text-blush-700 mb-3">Oops! This page got tangled up</h2>
        <p className="font-body text-blush-400 text-sm mb-8">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary inline-flex items-center justify-center gap-2">
            <FiHome size={16} /> Go Home
          </Link>
          <Link to="/products" className="btn-outline inline-flex items-center justify-center gap-2">
            <FiShoppingBag size={16} /> Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;