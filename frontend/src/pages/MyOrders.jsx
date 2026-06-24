import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiChevronRight, FiShoppingBag } from 'react-icons/fi';
import API from '../services/api';
import toast from 'react-hot-toast';

const statusColors = {
  'Pending Verification': 'bg-amber-100 text-amber-700',
  'Confirmed': 'bg-blue-100 text-blue-700',
  'Shipped': 'bg-purple-100 text-purple-700',
  'Delivered': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

const statusSteps = ['Pending Verification', 'Confirmed', 'Shipped', 'Delivered'];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/myorders');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-4xl animate-pulse">🧶</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-7xl mb-4">📦</div>
          <h1 className="font-display text-3xl text-blush-800 mb-2">No orders yet</h1>
          <p className="font-body text-blush-400 text-sm mb-6">You haven't placed any orders. Let's find something cute! 🌸</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            <FiShoppingBag size={16} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl text-blush-800 mb-1">My Orders 📦</h1>
          <p className="font-body text-sm text-blush-400">{orders.length} order{orders.length > 1 ? 's' : ''} placed</p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order._id;
            const currentStepIndex = statusSteps.indexOf(order.orderStatus);

            return (
              <div key={order._id} className="bg-white rounded-2xl border border-blush-100 shadow-sm overflow-hidden">

                {/* Order summary row */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-blush-50/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blush-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      {order.items[0]?.image ? (
                        <img src={`http://localhost:5000${order.items[0].image}`} alt="" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <span className="text-xl">🧶</span>
                      )}
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-blush-800">#{order._id.slice(-6).toUpperCase()}</p>
                      <p className="font-body text-xs text-blush-400">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''} • {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-body text-sm font-medium text-blush-700">₹{order.grandTotal}</p>
                      <span className={`badge text-xs ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span>
                    </div>
                    <FiChevronRight className={`text-blush-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`} size={18} />
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-blush-50 p-5 space-y-5">

                    {/* Status Tracker */}
                    {order.orderStatus !== 'Cancelled' ? (
                      <div className="flex items-center justify-between px-2">
                        {statusSteps.map((step, idx) => (
                          <React.Fragment key={step}>
                            <div className="flex flex-col items-center gap-1">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-body font-medium ${
                                idx <= currentStepIndex ? 'bg-green-400 text-white' : 'bg-blush-100 text-blush-300'
                              }`}>
                                {idx <= currentStepIndex ? '✓' : idx + 1}
                              </div>
                              <span className={`font-body text-xs text-center max-w-[60px] ${idx <= currentStepIndex ? 'text-blush-700' : 'text-blush-300'}`}>
                                {step.split(' ')[0]}
                              </span>
                            </div>
                            {idx < statusSteps.length - 1 && (
                              <div className={`flex-1 h-0.5 ${idx < currentStepIndex ? 'bg-green-400' : 'bg-blush-100'}`}></div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-red-50 rounded-xl p-3 text-center">
                        <p className="font-body text-sm text-red-500">This order was cancelled</p>
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-3 pt-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blush-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img src={`http://localhost:5000${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl">🧶</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-body text-sm text-blush-700">{item.name}</p>
                            <p className="font-body text-xs text-blush-400">Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                          <p className="font-body text-sm font-medium text-blush-700">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>

                    {/* Shipping address */}
                    <div className="bg-blush-50 rounded-xl p-4">
                      <p className="font-body text-xs font-medium text-blush-600 mb-1 flex items-center gap-1">
                        <FiPackage size={12} /> Delivery Address
                      </p>
                      <p className="font-body text-xs text-blush-500">
                        {order.shippingAddress.fullName}, {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                    </div>

                    {/* Total breakdown */}
                    <div className="border-t border-blush-100 pt-3 space-y-1">
                      <div className="flex justify-between font-body text-xs text-blush-500">
                        <span>Subtotal</span><span>₹{order.itemsTotal}</span>
                      </div>
                      <div className="flex justify-between font-body text-xs text-blush-500">
                        <span>Shipping</span><span>{order.shippingFee === 0 ? 'Free' : `₹${order.shippingFee}`}</span>
                      </div>
                      <div className="flex justify-between font-display text-base text-blush-800 pt-1">
                        <span>Total</span><span>₹{order.grandTotal}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;