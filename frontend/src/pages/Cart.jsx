import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowLeft, FiShoppingBag, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const shippingFee = cartTotal >= 999 || cartTotal === 0 ? 0 : 99;
  const grandTotal = cartTotal + shippingFee;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-7xl mb-4">🛒</div>
          <h1 className="font-display text-3xl text-blush-800 mb-2">Your cart is empty</h1>
          <p className="font-body text-blush-400 text-sm mb-6">Looks like you haven't added anything yet. Let's fix that! 🌸</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/products')} className="p-2 hover:bg-blush-50 rounded-full transition-colors text-blush-500">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-3xl text-blush-800">Your Cart 🛒</h1>
            <p className="font-body text-sm text-blush-400">{cart.items.length} item{cart.items.length > 1 ? 's' : ''} in your cart</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ===== CART ITEMS ===== */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const product = item.product;
              if (!product) return null;
              const price = product.discountPrice || product.price;

              return (
                <div key={product._id} className="bg-white rounded-2xl border border-blush-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center">

                  {/* Image */}
                  <div
                    className="w-24 h-24 bg-blush-50 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    {product.images?.[0] ? (
                      <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">🧶</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3
                      className="font-body font-medium text-blush-800 mb-1 cursor-pointer hover:text-blush-600 transition-colors"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="font-body font-semibold text-blush-600">₹{price}</span>
                      {product.discountPrice && (
                        <span className="font-body text-sm text-gray-400 line-through">₹{product.price}</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 bg-blush-50 rounded-full px-2 py-1">
                    <button
                      onClick={() => updateQuantity(product._id, item.quantity - 1)}
                      className="w-8 h-8 hover:bg-blush-200 rounded-full transition-colors flex items-center justify-center text-blush-600"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="font-body font-medium text-blush-800 w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(product._id, item.quantity + 1)}
                      disabled={item.quantity >= product.stock}
                      className="w-8 h-8 hover:bg-blush-200 rounded-full transition-colors flex items-center justify-center text-blush-600 disabled:opacity-40"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="font-display text-lg text-blush-700 w-20 text-center">
                    ₹{price * item.quantity}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* ===== ORDER SUMMARY ===== */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-blush-100 shadow-sm p-6 sticky top-24">
              <h2 className="font-display text-xl text-blush-800 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between font-body text-sm text-blush-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between font-body text-sm text-blush-600">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'Free 🌸' : `₹${shippingFee}`}</span>
                </div>
                {shippingFee > 0 && (
                  <p className="font-body text-xs text-blush-400 bg-blush-50 rounded-lg p-2">
                    Add ₹{999 - cartTotal} more for free shipping! 🚚
                  </p>
                )}
              </div>

              <div className="border-t border-blush-100 pt-4 mb-6">
                <div className="flex justify-between font-display text-xl text-blush-800">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary py-3 text-base justify-center"
              >
                Proceed to Checkout 🌸
              </button>

              <Link to="/products" className="w-full btn-outline py-3 text-sm justify-center mt-3 flex">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;