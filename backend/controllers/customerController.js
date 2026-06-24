const User = require('../models/User');
const Order = require('../models/Order');

// Get all customers (admin)
const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });

    // Add order count and total spent for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ user: customer._id, paymentStatus: 'Paid' });
        const totalSpent = orders.reduce((sum, o) => sum + o.grandTotal, 0);
        return {
          ...customer.toObject(),
          orderCount: orders.length,
          totalSpent,
        };
      })
    );

    res.json(customersWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single customer with order history
const getCustomerById = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });

    res.json({ customer, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCustomers, getCustomerById };