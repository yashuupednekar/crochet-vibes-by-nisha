import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheck, FiArrowLeft, FiShield } from 'react-icons/fi';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { fetchCart } = useCart();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data } = await API.get(`/orders/${orderId}`);
      setOrder(data);
      if (data.paymentStatus === 'Paid') {
        setSuccess(true);
      }
    } catch (error) {
      toast.error('Order not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = () => {
    if (!window.Razorpay) {
      toast.error('Payment gateway is loading, please try again in a moment');
      return;
    }

    setProcessing(true);

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: order.grandTotal * 100,
      currency: 'INR',
      name: 'Crochet Vibes by Nisha',
      description: `Order #${order._id.slice(-6).toUpperCase()}`,
      order_id: order.razorpayOrderId,
      handler: async function (response) {
        try {
          await API.put(`/orders/${orderId}/pay`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          await fetchCart();
          setSuccess(true);
          toast.success('Payment successful! 🎉');
        } catch (error) {
          toast.error('Payment verification failed. Please contact support.');
        } finally {
          setProcessing(false);
        }
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: order.shippingAddress?.phone || '',
      },
      theme: {
        color: '#e11d6a',
      },
      modal: {
        ondismiss: function () {
          setProcessing(false);
          toast('Payment cancelled', { icon: '😔' });
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      setProcessing(false);
      toast.error('Payment failed. Please try again.');
    });
    rzp.open();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-4xl animate-pulse">🧶</div>
      </div>
    );
  }

  // ===== SUCCESS SCREEN =====
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blush-50 via-rose-50 to-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-blush-100">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-50"></div>
            <div className="relative w-24 h-24 bg-green-400 rounded-full flex items-center justify-center">
              <FiCheck className="text-white" size={48} />
            </div>
          </div>

          <h1 className="font-display text-3xl text-blush-800 mb-2">Payment Successful! 🎉</h1>
          <p className="font-body text-blush-500 text-sm mb-6">
            Thank you for your order! We've received your payment and your order is now <strong>Pending Verification</strong>.
          </p>

          <div className="bg-blush-50 rounded-2xl p-5 mb-6 text-left space-y-2">
            <div className="flex justify-between font-body text-sm">
              <span className="text-blush-500">Order ID</span>
              <span className="text-blush-800 font-medium">#{order._id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between font-body text-sm">
              <span className="text-blush-500">Amount Paid</span>
              <span className="text-blush-800 font-medium">₹{order.grandTotal}</span>
            </div>
            <div className="flex justify-between font-body text-sm">
              <span className="text-blush-500">Status</span>
              <span className="badge bg-amber-100 text-amber-700">Pending Verification</span>
            </div>
          </div>

          <p className="font-body text-xs text-blush-400 mb-6">
            🌸 Nisha will review and confirm your order shortly. You'll get an email and notification once it's confirmed!
          </p>

          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/orders')} className="btn-primary w-full justify-center">
              View My Orders
            </button>
            <button onClick={() => navigate('/products')} className="btn-outline w-full justify-center">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== PAYMENT SCREEN =====
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/checkout')} className="p-2 hover:bg-blush-50 rounded-full transition-colors text-blush-500">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-3xl text-blush-800">Payment 💳</h1>
            <p className="font-body text-sm text-blush-400">Secure checkout powered by Razorpay</p>
          </div>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-400 text-white rounded-full flex items-center justify-center font-body text-sm font-medium">
              <FiCheck size={14} />
            </div>
            <span className="font-body text-sm text-blush-700 font-medium">Shipping</span>
          </div>
          <div className="flex-1 h-px bg-blush-400"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blush-500 text-white rounded-full flex items-center justify-center font-body text-sm font-medium">2</div>
            <span className="font-body text-sm text-blush-700 font-medium">Payment</span>
          </div>
          <div className="flex-1 h-px bg-blush-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blush-100 text-blush-400 rounded-full flex items-center justify-center font-body text-sm font-medium">3</div>
            <span className="font-body text-sm text-blush-400">Confirmation</span>
          </div>
        </div>

        {/* Amount + Pay button */}
        <div className="bg-white rounded-3xl border border-blush-100 shadow-sm p-8 text-center">
          <div className="bg-gradient-to-r from-blush-500 to-rose-500 rounded-2xl p-6 mb-6">
            <p className="font-body text-blush-100 text-sm mb-1">Amount to Pay</p>
            <p className="font-display text-4xl text-white">₹{order.grandTotal}</p>
          </div>

          <p className="font-body text-sm text-blush-500 mb-6">
            Click below to pay securely using Card, UPI, Netbanking, or Wallet via Razorpay.
          </p>

          <button
            onClick={handleRazorpayPayment}
            disabled={processing}
            className="w-full btn-primary py-4 text-base justify-center gap-2"
          >
            {processing ? 'Opening payment window...' : `Pay ₹${order.grandTotal} Now`}
          </button>

          <p className="flex items-center justify-center gap-2 font-body text-xs text-blush-300 mt-4">
            <FiShield size={12} /> Secured by Razorpay • Test Mode
          </p>

          {/* Test card info box */}
          <div className="mt-6 bg-blush-50 rounded-xl p-4 text-left">
            <p className="font-body text-xs font-medium text-blush-600 mb-2">🧪 Test Mode — use these dummy details:</p>
            <p className="font-body text-xs text-blush-500">Card: 4111 1111 1111 1111</p>
            <p className="font-body text-xs text-blush-500">Expiry: Any future date • CVV: Any 3 digits</p>
            <p className="font-body text-xs text-blush-500">UPI: success@razorpay</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;