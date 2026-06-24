import React, { useState, useEffect } from 'react';
import { FiX, FiPhone, FiMapPin, FiPackage } from 'react-icons/fi';
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

const statusFlow = ['Pending Verification', 'Confirmed', 'Shipped', 'Delivered'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/orders/admin/all?status=${filterStatus}`);
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const { data } = await API.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}! 🌸`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getNextStatus = (current) => {
    const idx = statusFlow.indexOf(current);
    return idx >= 0 && idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-blush-800 mb-1">Orders 📋</h1>
          <p className="font-body text-sm text-blush-400">{orders.length} orders found</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all', ...statusFlow, 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full font-body text-xs font-medium whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? 'bg-blush-500 text-white'
                  : 'bg-white text-blush-500 border border-blush-200 hover:bg-blush-50'
              }`}
            >
              {status === 'all' ? 'All Orders' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-blush-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="text-4xl animate-pulse">🧶</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📦</div>
            <h3 className="font-display text-xl text-blush-700 mb-2">No orders found</h3>
            <p className="font-body text-sm text-blush-400">Orders will appear here once customers start shopping</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blush-50">
                  <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Order ID</th>
                  <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Customer</th>
                  <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Items</th>
                  <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Amount</th>
                  <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Status</th>
                  <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const nextStatus = getNextStatus(order.orderStatus);
                  return (
                    <tr key={order._id} className="border-b border-blush-50 hover:bg-blush-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <button onClick={() => setSelectedOrder(order)} className="font-body text-sm text-blush-700 font-medium hover:underline">
                          #{order._id.slice(-6).toUpperCase()}
                        </button>
                      </td>
                      <td className="px-6 py-4 font-body text-sm text-blush-600">{order.user?.name}</td>
                      <td className="px-6 py-4 font-body text-sm text-blush-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                      <td className="px-6 py-4 font-body text-sm text-blush-700 font-medium">₹{order.grandTotal}</td>
                      <td className="px-6 py-4">
                        <span className={`badge ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span>
                      </td>
                      <td className="px-6 py-4">
                        {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' ? (
                          <button
                            onClick={() => handleStatusUpdate(order._id, nextStatus)}
                            disabled={updating}
                            className="font-body text-xs font-medium bg-blush-500 hover:bg-blush-600 text-white px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                          >
                            Mark as {nextStatus}
                          </button>
                        ) : (
                          <span className="font-body text-xs text-blush-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== ORDER DETAIL MODAL ===== */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between p-6 border-b border-blush-100 sticky top-0 bg-white">
              <h2 className="font-display text-xl text-blush-800">
                Order #{selectedOrder._id.slice(-6).toUpperCase()}
              </h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-blush-50 rounded-full text-blush-400">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-blush-500">Status</span>
                <span className={`badge ${statusColors[selectedOrder.orderStatus]}`}>{selectedOrder.orderStatus}</span>
              </div>

              {/* Customer info */}
              <div className="bg-blush-50 rounded-xl p-4 space-y-2">
                <p className="font-body text-sm font-medium text-blush-800">{selectedOrder.shippingAddress.fullName}</p>
                <p className="font-body text-xs text-blush-500 flex items-center gap-2"><FiPhone size={12} /> {selectedOrder.shippingAddress.phone}</p>
                <p className="font-body text-xs text-blush-500 flex items-center gap-2">
                  <FiMapPin size={12} />
                  {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </p>
              </div>

              {/* Items */}
              <div>
                <p className="font-body text-sm font-medium text-blush-700 mb-2 flex items-center gap-2">
                  <FiPackage size={14} /> Items
                </p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blush-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={`http://localhost:5000${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg">🧶</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-body text-xs text-blush-700">{item.name}</p>
                        <p className="font-body text-xs text-blush-400">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="font-body text-sm font-medium text-blush-700">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-blush-100 pt-4 space-y-1">
                <div className="flex justify-between font-body text-sm text-blush-600">
                  <span>Subtotal</span><span>₹{selectedOrder.itemsTotal}</span>
                </div>
                <div className="flex justify-between font-body text-sm text-blush-600">
                  <span>Shipping</span><span>{selectedOrder.shippingFee === 0 ? 'Free' : `₹${selectedOrder.shippingFee}`}</span>
                </div>
                <div className="flex justify-between font-display text-lg text-blush-800 pt-2">
                  <span>Total</span><span>₹{selectedOrder.grandTotal}</span>
                </div>
              </div>

              {/* Status update buttons */}
              {selectedOrder.orderStatus !== 'Delivered' && selectedOrder.orderStatus !== 'Cancelled' && (
                <div className="flex gap-2 pt-2">
                  {getNextStatus(selectedOrder.orderStatus) && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder._id, getNextStatus(selectedOrder.orderStatus))}
                      disabled={updating}
                      className="flex-1 btn-primary justify-center py-2.5"
                    >
                      Mark as {getNextStatus(selectedOrder.orderStatus)}
                    </button>
                  )}
                  <button
                    onClick={() => handleStatusUpdate(selectedOrder._id, 'Cancelled')}
                    disabled={updating}
                    className="px-4 py-2.5 rounded-full font-body text-sm text-red-400 border-2 border-red-200 hover:bg-red-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;