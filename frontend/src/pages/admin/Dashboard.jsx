import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiBox, FiUsers, FiDollarSign, FiClock, FiArrowRight, FiUpload } from 'react-icons/fi';
import AdminLayout from '../../components/AdminLayout';
import API from '../../services/api';
import toast from 'react-hot-toast';

const statusColors = {
  'Pending Verification': 'bg-amber-100 text-amber-700',
  'Confirmed': 'bg-blue-100 text-blue-700',
  'Shipped': 'bg-purple-100 text-purple-700',
  'Delivered': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [heroUploading, setHeroUploading] = useState(false);
  const heroInputRef = useRef();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/dashboard/stats');
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setHeroUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      await API.post('/settings/hero-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Hero image updated! 🌸');
    } catch (error) {
      toast.error('Failed to upload hero image');
    } finally {
      setHeroUploading(false);
    }
  };

  const statCards = stats ? [
    { label: 'Total Orders', value: stats.totalOrders, icon: <FiShoppingBag size={20} />, color: 'bg-blush-100 text-blush-600' },
    { label: 'Total Products', value: stats.totalProducts, icon: <FiBox size={20} />, color: 'bg-rose-100 text-rose-600' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: <FiUsers size={20} />, color: 'bg-purple-100 text-purple-600' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: <FiDollarSign size={20} />, color: 'bg-green-100 text-green-600' },
  ] : [];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-blush-800 mb-1">Welcome back, Nisha! 🌸</h1>
        <p className="font-body text-sm text-blush-400">Here's what's happening with your store today</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-blush-100 animate-pulse h-32"></div>
          ))}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statCards.map((card) => (
              <div key={card.label} className="bg-white rounded-2xl p-6 border border-blush-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${card.color}`}>
                  {card.icon}
                </div>
                <p className="font-display text-2xl text-blush-800 mb-1">{card.value}</p>
                <p className="font-body text-xs text-blush-400">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Hero Image Upload */}
          <div className="bg-white rounded-2xl border border-blush-100 shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl text-blush-800 mb-1">Hero Circle Image 🌸</h2>
                <p className="font-body text-sm text-blush-400">Upload a photo to show in the homepage hero circle</p>
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={heroInputRef}
                  onChange={handleHeroImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => heroInputRef.current.click()}
                  disabled={heroUploading}
                  className="btn-primary flex items-center gap-2"
                >
                  <FiUpload size={16} />
                  {heroUploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </div>
          </div>

          {/* Pending orders alert */}
          {stats.pendingOrders > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 flex-shrink-0">
                <FiClock size={18} />
              </div>
              <div className="flex-1">
                <p className="font-body text-sm font-medium text-amber-800">
                  {stats.pendingOrders} order{stats.pendingOrders > 1 ? 's' : ''} waiting for verification
                </p>
                <p className="font-body text-xs text-amber-600">Review and confirm these orders to keep customers happy!</p>
              </div>
              <Link to="/admin/orders" className="font-body text-sm font-medium text-amber-700 hover:underline flex items-center gap-1 flex-shrink-0">
                Review <FiArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-blush-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-blush-100">
              <h2 className="font-display text-xl text-blush-800">Recent Orders 📋</h2>
              <Link to="/admin/orders" className="font-body text-sm text-blush-500 hover:text-blush-700 flex items-center gap-1">
                View All <FiArrowRight size={14} />
              </Link>
            </div>

            {stats.recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📦</div>
                <p className="font-body text-sm text-blush-400">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-blush-50">
                      <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Order ID</th>
                      <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Customer</th>
                      <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Amount</th>
                      <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Status</th>
                      <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-blush-50 hover:bg-blush-50/50 transition-colors">
                        <td className="px-6 py-4 font-body text-sm text-blush-700 font-medium">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 font-body text-sm text-blush-600">
                          {order.user?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 font-body text-sm text-blush-700 font-medium">
                          ₹{order.grandTotal}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`badge ${statusColors[order.orderStatus]}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-body text-xs text-blush-400">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Dashboard;