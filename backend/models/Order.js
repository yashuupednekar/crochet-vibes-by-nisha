const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  itemsTotal: { type: Number, required: true },
  shippingFee: { type: Number, required: true, default: 0 },
  grandTotal: { type: Number, required: true },
  
  paymentMethod: {
    type: String,
    default: 'Razorpay',
  },
  paymentStatus: {
    type: String,
    enum: ['Not Paid', 'Paid'],
    default: 'Not Paid',
  },
  razorpayOrderId: {
    type: String,
    default: '',
  },
  razorpayPaymentId: {
    type: String,
    default: '',
  },
  orderStatus: {
    type: String,
    enum: ['Pending Verification', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending Verification',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);