import React from 'react';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const name = product?.name || 'Cute Crochet Bag';
  const price = product?.price || 599;
  const discountPrice = product?.discountPrice || null;
  const image = product?.images?.[0] || null;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add to cart 🌸');
      navigate('/login');
      return;
    }
    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }
    const success = await addToCart(product._id, 1);
    if (success) {
      toast.success(`${name} added to cart! 🛒`);
    }
  };

  return (
    <div className="card group cursor-pointer" onClick={() => navigate(`/product/${product?._id || '1'}`)}>
      {/* Image */}
      <div className="relative overflow-hidden bg-blush-50 h-56 flex items-center justify-center">
        {image ? (
          <img src={`https://crochet-vibes-by-nisha.onrender.com${image}`} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="text-6xl">🧶</div>
        )}

        {discountPrice && (
          <span className="absolute top-3 left-3 badge bg-rose-500 text-white">
            Sale!
          </span>
        )}

        <button
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm hover:bg-rose-50 transition-colors"
          onClick={(e) => { e.stopPropagation(); }}
        >
          <FiHeart className="text-blush-400" size={16} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-body font-medium text-blush-900 text-sm mb-1 truncate">{name}</h3>
        <div className="flex items-center gap-2">
          {discountPrice ? (
            <>
              <span className="font-body font-semibold text-blush-600">₹{discountPrice}</span>
              <span className="font-body text-sm text-gray-400 line-through">₹{price}</span>
            </>
          ) : (
            <span className="font-body font-semibold text-blush-600">₹{price}</span>
          )}
        </div>

        <button
          className="mt-3 w-full btn-primary text-sm py-2 flex items-center justify-center gap-2 disabled:opacity-50"
          onClick={handleAddToCart}
          disabled={product?.stock === 0}
        >
          <FiShoppingCart size={14} />
          {product?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
