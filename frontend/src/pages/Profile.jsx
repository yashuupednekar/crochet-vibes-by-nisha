import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setForm({ ...form, address: { ...form.address, [e.target.name]: e.target.value } });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put('/auth/profile', form);
      // Update localStorage and context with new info
      const updatedUser = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated! 🌸');
      setEditing(false);
      window.location.reload(); // refresh to reflect updated context
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blush-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-3xl font-display">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <h1 className="font-display text-3xl text-blush-800">{user?.name}</h1>
          <p className="font-body text-sm text-blush-400">{user?.email}</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-blush-100 shadow-sm p-6 sm:p-8">

          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-blush-800">My Information 🌸</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} className="btn-outline text-sm py-2 flex items-center gap-2">
                <FiEdit2 size={14} /> Edit
              </button>
            )}
          </div>

          {!editing ? (
            /* ===== VIEW MODE ===== */
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <FiUser className="text-blush-400 mt-1" size={16} />
                <div>
                  <p className="font-body text-xs text-blush-400">Full Name</p>
                  <p className="font-body text-sm text-blush-800">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiMail className="text-blush-400 mt-1" size={16} />
                <div>
                  <p className="font-body text-xs text-blush-400">Email Address</p>
                  <p className="font-body text-sm text-blush-800">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="text-blush-400 mt-1" size={16} />
                <div>
                  <p className="font-body text-xs text-blush-400">Phone Number</p>
                  <p className="font-body text-sm text-blush-800">{user?.phone || 'Not added yet'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiMapPin className="text-blush-400 mt-1" size={16} />
                <div>
                  <p className="font-body text-xs text-blush-400">Saved Address</p>
                  <p className="font-body text-sm text-blush-800">
                    {user?.address?.street ? (
                      `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.pincode}`
                    ) : (
                      'No address saved yet'
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* ===== EDIT MODE ===== */
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
                />
              </div>

              <div>
                <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
                />
              </div>

              <div>
                <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={form.address.street}
                  onChange={handleAddressChange}
                  placeholder="House no., Street"
                  className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.address.city}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
                  />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">State</label>
                  <input
                    type="text"
                    name="state"
                    value={form.address.state}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
                  />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={form.address.pincode}
                    onChange={handleAddressChange}
                    maxLength={6}
                    className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditing(false)} className="flex-1 btn-outline justify-center py-3">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 btn-primary justify-center py-3 gap-2">
                  <FiSave size={16} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;