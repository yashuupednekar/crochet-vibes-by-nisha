const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendOrderConfirmationEmail, sendStatusUpdateEmail } = require('../utils/emailService');


const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create new order (before payment)
const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0] || '',
      price: item.product.discountPrice || item.product.price,
      quantity: item.quantity,
    }));

    const itemsTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = itemsTotal >= 999 ? 0 : 99;
    const grandTotal = itemsTotal + shippingFee;

    // Create Razorpay order (amount in paise, so multiply by 100)
    const razorpayOrder = await razorpay.orders.create({
      amount: grandTotal * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      itemsTotal,
      shippingFee,
      grandTotal,
      razorpayOrderId: razorpayOrder.id,
    });

    res.status(201).json({ order, razorpayOrderId: razorpayOrder.id, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged in user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pay for order 
const payOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Verify the payment signature (proves payment is genuine)
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    order.paymentStatus = 'Paid';
    order.orderStatus = 'Pending Verification';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    await Notification.create({
      user: req.user._id,
      title: 'Order Placed Successfully! 🎉',
      message: `Your order #${order._id.toString().slice(-6).toUpperCase()} has been placed and is being processed.`,
      type: 'order_placed',
      link: `/orders`,
    });

    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        title: 'New Order Received! 🛍️',
        message: `New order #${order._id.toString().slice(-6).toUpperCase()} worth ₹${order.grandTotal} needs verification.`,
        type: 'admin_alert',
        link: `/admin/orders`,
      });
    }

    sendOrderConfirmationEmail(req.user.email, req.user.name, order);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ===== ADMIN FUNCTIONS =====

// Get ALL orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending Verification', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.orderStatus = status;
    await order.save();

    // Notify customer about status change
    const statusMessages = {
      'Confirmed': { title: 'Order Confirmed! ✅', message: `Great news! Your order #${order._id.toString().slice(-6).toUpperCase()} has been confirmed and is being prepared.`, type: 'order_confirmed' },
      'Shipped': { title: 'Order Shipped! 🚚', message: `Your order #${order._id.toString().slice(-6).toUpperCase()} is on its way to you!`, type: 'order_shipped' },
      'Delivered': { title: 'Order Delivered! 📦', message: `Your order #${order._id.toString().slice(-6).toUpperCase()} has been delivered. Enjoy your crochet goodies! 🌸`, type: 'order_delivered' },
      'Cancelled': { title: 'Order Cancelled', message: `Your order #${order._id.toString().slice(-6).toUpperCase()} has been cancelled.`, type: 'admin_alert' },
    };

    if (statusMessages[status]) {
      await Notification.create({
        user: order.user,
        title: statusMessages[status].title,
        message: statusMessages[status].message,
        type: statusMessages[status].type,
        link: `/orders`,
      });

      // Send email notification
      const customer = await User.findById(order.user);
      if (customer) {
        sendStatusUpdateEmail(customer.email, customer.name, order, status);
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder, getOrderById, getMyOrders, payOrder,
  getAllOrders, updateOrderStatus
};