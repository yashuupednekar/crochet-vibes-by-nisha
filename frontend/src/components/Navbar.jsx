import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiBell, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiPackage } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import toast from 'react-hot-toast';
import logo from "../assets/logo.png";

// Helper to format relative time
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const notifIcons = {
  order_placed: '🎉',
  order_confirmed: '✅',
  order_shipped: '🚚',
  order_delivered: '📦',
  admin_alert: '🛍️',
  product_added: '🧶',
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully 🌸');
    navigate('/');
  };

  const handleNotifClick = (notif) => {
    if (!notif.isRead) markAsRead(notif._id);
    setNotifOpen(false);
    if (notif.link) navigate(notif.link);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-blush-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Crochet Vibes by Nisha"
              className="w-16 h-16 object-contain"
            />

            <div>
              <span className="font-display text-xl text-blush-700 leading-none block">
                Crochet Vibes
              </span>
              <span className="font-body text-xs text-mauve leading-none">
                by Nisha
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="font-body text-sm text-blush-700 hover:text-blush-500 transition-colors">Home</Link>
            <Link to="/products" className="font-body text-sm text-blush-700 hover:text-blush-500 transition-colors">Shop</Link>
            <Link to="/about" className="font-body text-sm text-blush-700 hover:text-blush-500 transition-colors">About</Link>
            <Link to="/contact" className="font-body text-sm text-blush-700 hover:text-blush-500 transition-colors">Contact</Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-blush-50 rounded-full transition-colors text-blush-600">
              <FiSearch size={18} />
            </button>
            <Link to="/wishlist" className="p-2 hover:bg-blush-50 rounded-full transition-colors text-blush-600">
              <FiHeart size={18} />
            </Link>
            <Link to="/cart" className="relative p-2 hover:bg-blush-50 rounded-full transition-colors text-blush-600">
              <FiShoppingCart size={18} />
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-body">{cartCount}</span>
            </Link>

            {/* Notification Bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
                  className="relative p-2 hover:bg-blush-50 rounded-full transition-colors text-blush-600"
                >
                  <FiBell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-body">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {notifOpen && (
                  <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-lg border border-blush-100 w-80 max-h-96 overflow-hidden z-50 flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-blush-100">
                      <h3 className="font-display text-base text-blush-800">Notifications 🔔</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="font-body text-xs text-blush-500 hover:text-blush-700">
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="overflow-y-auto flex-1">
                      {notifications.length === 0 ? (
                        <div className="text-center py-10">
                          <div className="text-3xl mb-2">🔔</div>
                          <p className="font-body text-sm text-blush-400">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <button
                            key={notif._id}
                            onClick={() => handleNotifClick(notif)}
                            className={`w-full text-left px-4 py-3 border-b border-blush-50 hover:bg-blush-50 transition-colors flex gap-3 ${!notif.isRead ? 'bg-blush-50/60' : ''}`}
                          >
                            <span className="text-xl flex-shrink-0">{notifIcons[notif.type] || '🔔'}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-body text-sm font-medium text-blush-800 mb-0.5">{notif.title}</p>
                              <p className="font-body text-xs text-blush-500 line-clamp-2">{notif.message}</p>
                              <p className="font-body text-xs text-blush-300 mt-1">{timeAgo(notif.createdAt)}</p>
                            </div>
                            {!notif.isRead && <div className="w-2 h-2 bg-rose-500 rounded-full flex-shrink-0 mt-1"></div>}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
                  className="hidden md:flex items-center gap-2 bg-blush-50 hover:bg-blush-100 rounded-full px-4 py-2 transition-colors"
                >
                  <div className="w-6 h-6 bg-blush-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-body font-medium">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="font-body text-sm text-blush-700">{user.name?.split(' ')[0]}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-lg border border-blush-100 py-2 w-48 z-50">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-blush-700 hover:bg-blush-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                      <FiUser size={14} /> My Profile
                    </Link>
                    <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-blush-700 hover:bg-blush-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                      <FiPackage size={14} /> My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-blush-700 hover:bg-blush-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-blush-100 mt-1 pt-1">
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-red-400 hover:bg-red-50 transition-colors w-full">
                        <FiLogOut size={14} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex btn-primary text-sm py-2 px-4 items-center gap-1">
                <FiUser size={14} />
                Login
              </Link>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-blush-600">
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-3 border-t border-blush-50">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blush-300" size={16} />
              <input
                type="text"
                placeholder="Search for crochet bags, flowers, home decor..."
                className="w-full pl-9 pr-4 py-2.5 bg-blush-50 rounded-full font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 border border-blush-100"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
            <div className="md:hidden py-4 border-t border-blush-50 flex flex-col gap-1">
              <Link to="/" className="font-body text-sm text-blush-700 py-2.5 px-2 rounded-lg hover:bg-blush-50" onClick={() => setMenuOpen(false)}>🏠 Home</Link>
              <Link to="/products" className="font-body text-sm text-blush-700 py-2.5 px-2 rounded-lg hover:bg-blush-50" onClick={() => setMenuOpen(false)}>🛍️ Shop</Link>
              <Link to="/about" className="font-body text-sm text-blush-700 py-2.5 px-2 rounded-lg hover:bg-blush-50" onClick={() => setMenuOpen(false)}>📖 About</Link>
              <Link to="/contact" className="font-body text-sm text-blush-700 py-2.5 px-2 rounded-lg hover:bg-blush-50" onClick={() => setMenuOpen(false)}>💌 Contact</Link>

              {user && (
                <>
                  <div className="border-t border-blush-50 my-2"></div>
                  <Link to="/profile" className="font-body text-sm text-blush-700 py-2.5 px-2 rounded-lg hover:bg-blush-50" onClick={() => setMenuOpen(false)}>👤 My Profile</Link>
                  <Link to="/orders" className="font-body text-sm text-blush-700 py-2.5 px-2 rounded-lg hover:bg-blush-50" onClick={() => setMenuOpen(false)}>📦 My Orders</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="font-body text-sm text-blush-700 py-2.5 px-2 rounded-lg hover:bg-blush-50" onClick={() => setMenuOpen(false)}>⚙️ Admin Panel</Link>
                  )}
                </>
              )}

              <div className="border-t border-blush-50 my-2"></div>
              {user ? (
                <button onClick={handleLogout} className="text-left font-body text-sm text-red-400 py-2.5 px-2 rounded-lg hover:bg-red-50">🚪 Logout</button>
              ) : (
                <Link to="/login" className="btn-primary text-sm py-2.5 text-center mt-1" onClick={() => setMenuOpen(false)}>Login</Link>
              )}
            </div>
          )}
      </div>
    </nav>
  );
};

export default Navbar;