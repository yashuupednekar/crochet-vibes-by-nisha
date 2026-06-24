import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiShoppingCart, FiHeart, FiStar, FiArrowLeft,
  FiPackage, FiTruck, FiShield, FiShare2
} from 'react-icons/fi';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

    const handleAddToCart = async () => {
    if (!user) {
        toast.error('Please login to add to cart 🌸');
        navigate('/login');
        return;
    }
    const success = await addToCart(product._id, quantity);
    if (success) {
        toast.success(`${product.name} added to cart! 🛒`);
    }
    };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      navigate('/login');
      return;
    }
    setSubmittingReview(true);
    try {
      await API.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success('Review submitted! 🌸');
      setReviewComment('');
      setReviewRating(5);
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="space-y-4">
              <div className="h-96 bg-blush-100 rounded-3xl"></div>
              <div className="flex gap-3">
                {[1,2,3].map(i => <div key={i} className="w-24 h-24 bg-blush-100 rounded-xl"></div>)}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-blush-100 rounded w-3/4"></div>
              <div className="h-6 bg-blush-100 rounded w-1/4"></div>
              <div className="h-32 bg-blush-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 font-body text-sm text-blush-400 hover:text-blush-600 transition-colors"
          >
            <FiArrowLeft size={16} /> Back to Shop
          </button>
          <span className="text-blush-200">/</span>
          <span className="font-body text-sm text-blush-400">{product.category?.name}</span>
          <span className="text-blush-200">/</span>
          <span className="font-body text-sm text-blush-700 truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

          {/* ===== LEFT — Images ===== */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-blush-50 rounded-3xl overflow-hidden h-96 flex items-center justify-center border border-blush-100 relative">
              {product.images && product.images.length > 0 ? (
                <img
                  src={`http://localhost:5000${product.images[selectedImage]}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="text-8xl mb-3">🧶</div>
                  <p className="font-body text-sm text-blush-300">No image available</p>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discountPercent && (
                  <span className="badge bg-rose-500 text-white">{discountPercent}% OFF</span>
                )}
                {product.isFeatured && (
                  <span className="badge bg-blush-500 text-white">⭐ Featured</span>
                )}
                {product.stock === 0 && (
                  <span className="badge bg-gray-400 text-white">Out of Stock</span>
                )}
              </div>

              {/* Share button */}
              <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-sm hover:bg-blush-50 transition-colors text-blush-400">
                <FiShare2 size={16} />
              </button>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-blush-500' : 'border-blush-100 hover:border-blush-300'
                    }`}
                  >
                    <img
                      src={`http://localhost:5000${img}`}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== RIGHT — Product Info ===== */}
          <div className="space-y-6">

            {/* Category */}
            <div>
              <span className="badge bg-blush-100 text-blush-600">
                {product.category?.emoji} {product.category?.name}
              </span>
            </div>

            {/* Name */}
            <h1 className="font-display text-3xl text-blush-900 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((star) => (
                  <FiStar
                    key={star}
                    size={16}
                    className={star <= Math.round(product.ratings) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
                  />
                ))}
              </div>
              <span className="font-body text-sm text-blush-400">
                {product.ratings > 0 ? product.ratings.toFixed(1) : 'No ratings yet'} ({product.numReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              {product.discountPrice ? (
                <>
                  <span className="font-display text-4xl text-blush-600">₹{product.discountPrice}</span>
                  <span className="font-body text-xl text-gray-400 line-through">₹{product.price}</span>
                  <span className="badge bg-rose-100 text-rose-600">Save ₹{product.price - product.discountPrice}</span>
                </>
              ) : (
                <span className="font-display text-4xl text-blush-600">₹{product.price}</span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="font-body text-sm text-blush-500">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div>
                <label className="font-body text-sm font-medium text-blush-700 mb-2 block">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-blush-100 hover:bg-blush-200 rounded-full font-body font-medium text-blush-700 transition-colors flex items-center justify-center text-lg"
                  >
                    −
                  </button>
                  <span className="font-body font-medium text-blush-800 w-8 text-center text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 bg-blush-100 hover:bg-blush-200 rounded-full font-body font-medium text-blush-700 transition-colors flex items-center justify-center text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 btn-primary py-3 text-base justify-center gap-2 ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FiShoppingCart size={18} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button className="p-3 border-2 border-blush-200 rounded-full hover:bg-blush-50 text-blush-400 hover:text-rose-500 transition-colors">
                <FiHeart size={20} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-blush-100">
              <div className="text-center">
                <div className="w-10 h-10 bg-blush-50 rounded-full flex items-center justify-center text-blush-400 mx-auto mb-2">
                  <FiTruck size={16} />
                </div>
                <p className="font-body text-xs text-blush-500">Free Delivery ₹999+</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-blush-50 rounded-full flex items-center justify-center text-blush-400 mx-auto mb-2">
                  <FiPackage size={16} />
                </div>
                <p className="font-body text-xs text-blush-500">Easy Returns</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-blush-50 rounded-full flex items-center justify-center text-blush-400 mx-auto mb-2">
                  <FiShield size={16} />
                </div>
                <p className="font-body text-xs text-blush-500">Secure Payment</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== TABS — Description & Reviews ===== */}
        <div className="bg-white rounded-3xl border border-blush-100 shadow-sm overflow-hidden mb-16">

          {/* Tab Headers */}
          <div className="flex border-b border-blush-100">
            {['description', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 font-body text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-blush-600 border-b-2 border-blush-500 bg-blush-50'
                    : 'text-blush-400 hover:text-blush-600'
                }`}
              >
                {tab === 'reviews' ? `Reviews (${product.numReviews})` : 'Description'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' ? (
              <div>
                <p className="font-body text-blush-600 leading-relaxed text-base">{product.description}</p>
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Material', value: 'Premium Yarn' },
                    { label: 'Made In', value: 'India 🇮🇳' },
                    { label: 'Category', value: product.category?.name },
                    { label: 'Stock', value: `${product.stock} available` },
                  ].map((item) => (
                    <div key={item.label} className="bg-blush-50 rounded-xl p-3">
                      <p className="font-body text-xs text-blush-400 mb-1">{item.label}</p>
                      <p className="font-body text-sm font-medium text-blush-700">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Reviews List */}
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div key={review._id} className="bg-blush-50 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blush-400 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-body">{review.name?.charAt(0)}</span>
                            </div>
                            <span className="font-body font-medium text-blush-700 text-sm">{review.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map((star) => (
                              <FiStar
                                key={star}
                                size={12}
                                className={star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="font-body text-sm text-blush-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">⭐</div>
                    <p className="font-body text-blush-400 text-sm">No reviews yet. Be the first to review!</p>
                  </div>
                )}

                {/* Add Review Form */}
                {user && (
                  <div className="border-t border-blush-100 pt-6">
                    <h3 className="font-display text-xl text-blush-800 mb-4">Write a Review 🌸</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      {/* Star Rating */}
                      <div>
                        <label className="font-body text-sm font-medium text-blush-700 mb-2 block">Your Rating</label>
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="text-2xl transition-transform hover:scale-110"
                            >
                              <FiStar
                                size={28}
                                className={star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Comment */}
                      <div>
                        <label className="font-body text-sm font-medium text-blush-700 mb-2 block">Your Review</label>
                        <textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience with this product..."
                          rows={4}
                          required
                          className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="btn-primary py-2.5"
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review 🌸'}
                      </button>
                    </form>
                  </div>
                )}

                {!user && (
                  <div className="text-center py-4 border-t border-blush-100">
                    <p className="font-body text-sm text-blush-400">
                      <Link to="/login" className="text-blush-600 font-medium hover:underline">Login</Link> to write a review
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;