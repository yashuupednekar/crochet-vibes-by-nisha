import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiGrid, FiBox, FiTag, FiShoppingBag, FiUsers,
  FiLogOut, FiMenu, FiX, FiArrowLeft
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const menuItems = [
  { name: 'Dashboard', icon: <FiGrid size={18} />, path: '/admin' },
  { name: 'Products', icon: <FiBox size={18} />, path: '/admin/products' },
  { name: 'Categories', icon: <FiTag size={18} />, path: '/admin/categories' },
  { name: 'Orders', icon: <FiShoppingBag size={18} />, path: '/admin/orders' },
  { name: 'Customers', icon: <FiUsers size={18} />, path: '/admin/customers' },
];

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully 🌸');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream flex">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-blush-100 z-50 transition-transform duration-200 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        {/* Logo */}
        <div className="p-6 border-b border-blush-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={require('../assets/logo.png')}
              alt="Crochet Vibes"
              className="w-12 h-12 object-contain"
            />
            <div>
              <p className="font-display text-lg text-blush-700 leading-none">Crochet Vibes</p>
              <p className="font-body text-xs text-mauve">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-blush-400">
            <FiX size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-colors ${isActive
                    ? 'bg-blush-500 text-white shadow-sm'
                    : 'text-blush-600 hover:bg-blush-50'
                  }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-blush-100 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-blush-600 hover:bg-blush-50 transition-colors">
            <FiArrowLeft size={18} />
            Back to Store
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-red-400 hover:bg-red-50 transition-colors">
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden bg-white border-b border-blush-100 p-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-blush-600">
            <FiMenu size={22} />
          </button>
          <span className="font-display text-lg text-blush-700">Admin Panel</span>
          <div className="w-7 h-7 bg-blush-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-body">{user?.name?.charAt(0)}</span>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;