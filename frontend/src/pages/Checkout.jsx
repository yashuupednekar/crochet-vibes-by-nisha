import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiUser, FiArrowLeft, FiHome } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });
  const [loading, setLoading] = useState(false);

  const shippingFee = cartTotal >= 999 ? 0 : 99;
  const grandTotal = cartTotal + shippingFee;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    for (const key in form) {
      if (!form[key].trim()) {
        toast.error('Please fill in all shipping details');
        return;
      }
    }

    // Validate pincode and phone
    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post('/orders', { shippingAddress: form });
      toast.success('Order details saved! Proceeding to payment 🌸');
      navigate(`/payment/${data.order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-7xl mb-4">🛒</div>
          <h1 className="font-display text-3xl text-blush-800 mb-2">Your cart is empty</h1>
          <p className="font-body text-blush-400 text-sm mb-6">Add some items before checking out 🌸</p>
          <Link to="/products" className="btn-primary">Go to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/cart')} className="p-2 hover:bg-blush-50 rounded-full transition-colors text-blush-500">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-3xl text-blush-800">Checkout 📋</h1>
            <p className="font-body text-sm text-blush-400">Just one more step to your cozy crochet goodies!</p>
          </div>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blush-500 text-white rounded-full flex items-center justify-center font-body text-sm font-medium">1</div>
            <span className="font-body text-sm text-blush-700 font-medium">Shipping</span>
          </div>
          <div className="flex-1 h-px bg-blush-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blush-100 text-blush-400 rounded-full flex items-center justify-center font-body text-sm font-medium">2</div>
            <span className="font-body text-sm text-blush-400">Payment</span>
          </div>
          <div className="flex-1 h-px bg-blush-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blush-100 text-blush-400 rounded-full flex items-center justify-center font-body text-sm font-medium">3</div>
            <span className="font-body text-sm text-blush-400">Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ===== SHIPPING FORM ===== */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-blush-100 shadow-sm p-6">
              <h2 className="font-display text-xl text-blush-800 mb-5 flex items-center gap-2">
                <FiMapPin /> Shipping Address
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-blush-300" size={16} />
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full pl-11 pr-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-blush-300" size={16} />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full pl-11 pr-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Street Address</label>
                  <div className="relative">
                    <FiHome className="absolute left-4 top-1/2 -translate-y-1/2 text-blush-300" size={16} />
                    <input
                      type="text"
                      name="street"
                      value={form.street}
                      onChange={handleChange}
                      placeholder="House no., Street, Landmark"
                      className="w-full pl-11 pr-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">City</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">State</label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 text-base justify-center mt-2"
                >
                  {loading ? 'Saving...' : 'Continue to Payment 💳'}
                </button>
              </form>
            </div>
          </div>

          {/* ===== ORDER SUMMARY ===== */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-blush-100 shadow-sm p-6 sticky top-24">
              <h2 className="font-display text-xl text-blush-800 mb-4">Order Summary</h2>

              {/* Items list */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map((item) => {
                  const product = item.product;
                  if (!product) return null;
                  const price = product.discountPrice || product.price;
                  return (
                    <div key={product._id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blush-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {product.images?.[0] ? (
                          <img src={`https://crochet-vibes-by-nisha.onrender.com${product.images[0]}`} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl">🧶</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs text-blush-700 truncate">{product.name}</p>
                        <p className="font-body text-xs text-blush-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-body text-sm font-medium text-blush-700">₹{price * item.quantity}</p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-blush-100 pt-4 space-y-2">
                <div className="flex justify-between font-body text-sm text-blush-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between font-body text-sm text-blush-600">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'Free 🌸' : `₹${shippingFee}`}</span>
                </div>
              </div>

              <div className="border-t border-blush-100 mt-4 pt-4">
                <div className="flex justify-between font-display text-xl text-blush-800">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
