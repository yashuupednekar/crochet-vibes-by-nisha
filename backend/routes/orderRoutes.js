const express = require('express');
const router = express.Router();
const {
  createOrder, getOrderById, getMyOrders, payOrder,
  getAllOrders, updateOrderStatus
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, payOrder);

module.exports = router;