import React, { useState, useEffect } from 'react';
import { FiX, FiMail, FiPhone, FiCalendar, FiShoppingBag } from 'react-icons/fi';
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

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/customers');
      setCustomers(data);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const openCustomerDetail = async (customer) => {
    setSelectedCustomer(customer);
    setLoadingDetail(true);
    try {
      const { data } = await API.get(`/customers/${customer._id}`);
      setCustomerOrders(data.orders);
    } catch (error) {
      toast.error('Failed to load customer details');
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-blush-800 mb-1">Customers 👥</h1>
        <p className="font-body text-sm text-blush-400">{customers.length} registered customers</p>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-blush-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="text-4xl animate-pulse">🧶</div>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">👥</div>
            <h3 className="font-display text-xl text-blush-700 mb-2">No customers yet</h3>
            <p className="font-body text-sm text-blush-400">Customers will appear here once they register</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blush-50">
                  <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Customer</th>
                  <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Email</th>
                  <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Orders</th>
                  <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Total Spent</th>
                  <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer._id}
                    onClick={() => openCustomerDetail(customer)}
                    className="border-b border-blush-50 hover:bg-blush-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blush-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-body font-medium">{customer.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="font-body text-sm font-medium text-blush-800">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-blush-600">{customer.email}</td>
                    <td className="px-6 py-4 font-body text-sm text-blush-600">{customer.orderCount} order{customer.orderCount !== 1 ? 's' : ''}</td>
                    <td className="px-6 py-4 font-body text-sm font-medium text-blush-700">₹{customer.totalSpent}</td>
                    <td className="px-6 py-4 font-body text-xs text-blush-400">
                      {new Date(customer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== CUSTOMER DETAIL MODAL ===== */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between p-6 border-b border-blush-100 sticky top-0 bg-white">
              <h2 className="font-display text-xl text-blush-800">Customer Details</h2>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-blush-50 rounded-full text-blush-400">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Profile */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blush-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-2xl font-body font-medium">{selectedCustomer.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-display text-xl text-blush-800">{selectedCustomer.name}</p>
                  <p className="font-body text-sm text-blush-400 flex items-center gap-1"><FiMail size={12} /> {selectedCustomer.email}</p>
                  {selectedCustomer.phone && (
                    <p className="font-body text-sm text-blush-400 flex items-center gap-1"><FiPhone size={12} /> {selectedCustomer.phone}</p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blush-50 rounded-xl p-4 text-center">
                  <p className="font-display text-2xl text-blush-700">{selectedCustomer.orderCount}</p>
                  <p className="font-body text-xs text-blush-400">Total Orders</p>
                </div>
                <div className="bg-blush-50 rounded-xl p-4 text-center">
                  <p className="font-display text-2xl text-blush-700">₹{selectedCustomer.totalSpent}</p>
                  <p className="font-body text-xs text-blush-400">Total Spent</p>
                </div>
              </div>

              {/* Order history */}
              <div>
                <p className="font-body text-sm font-medium text-blush-700 mb-3 flex items-center gap-2">
                  <FiShoppingBag size={14} /> Order History
                </p>

                {loadingDetail ? (
                  <div className="text-center py-6">
                    <div className="text-2xl animate-pulse">🧶</div>
                  </div>
                ) : customerOrders.length === 0 ? (
                  <p className="font-body text-sm text-blush-400 text-center py-6">No orders yet</p>
                ) : (
                  <div className="space-y-2">
                    {customerOrders.map((order) => (
                      <div key={order._id} className="bg-blush-50 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <p className="font-body text-xs font-medium text-blush-700">#{order._id.slice(-6).toUpperCase()}</p>
                          <p className="font-body text-xs text-blush-400 flex items-center gap-1 mt-0.5">
                            <FiCalendar size={10} /> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-body text-sm font-medium text-blush-700">₹{order.grandTotal}</p>
                          <span className={`badge text-xs ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCustomers;