import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiHeart, FiStar, FiTruck } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import API from '../services/api';

// Dummy products for now (will be replaced with real API data later)
// const dummyProducts = [
//   { _id: '1', name: 'Boho Crochet Bag', price: 899, discountPrice: 699, images: [] },
//   { _id: '2', name: 'Flower Wall Hanging', price: 599, discountPrice: null, images: [] },
//   { _id: '3', name: 'Mini Crochet Purse', price: 449, discountPrice: 399, images: [] },
//   { _id: '4', name: 'Crochet Hair Clips Set', price: 299, discountPrice: null, images: [] },
// ];

// const defaultCategories  = [
//   { name: 'Bags & Purses', emoji: '👜', color: 'bg-rose-50 border-rose-200' },
//   { name: 'Home Decor', emoji: '🏡', color: 'bg-blush-50 border-blush-200' },
//   { name: 'Hair Accessories', emoji: '🎀', color: 'bg-amber-50 border-amber-200' },
//   { name: 'Keychains', emoji: '🔑', color: 'bg-purple-50 border-purple-200' },
//   { name: 'Wall Hangings', emoji: '🌿', color: 'bg-green-50 border-green-200' },
//   { name: 'Gift Sets', emoji: '🎁', color: 'bg-pink-50 border-pink-200' },
// ];

const categoryColors = [
  'bg-rose-50 border-rose-200',
  'bg-blush-50 border-blush-200',
  'bg-amber-50 border-amber-200',
  'bg-purple-50 border-purple-200',
  'bg-green-50 border-green-200',
  'bg-pink-50 border-pink-200',
];

const features = [
  { icon: <FiHeart size={24} />, title: 'Made with Love', desc: 'Every piece handcrafted with care and attention to detail.' },
  { icon: <FiStar size={24} />, title: 'Premium Quality', desc: 'Only the finest yarns and materials used in every product.' },
  { icon: <FiTruck size={24} />, title: 'Fast Delivery', desc: 'Pan India delivery. Orders shipped within 2-3 business days.' },
  { icon: <FiShoppingBag size={24} />, title: 'Easy Returns', desc: 'Not happy? We offer hassle-free returns within 7 days.' },
]

const Home = () => {
  const [categories, setCategories] = useState([]);
const [featuredProducts, setFeaturedProducts] = useState([]);
const [heroImage, setHeroImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
  try {
    const catRes = await API.get('/categories');
    setCategories(catRes.data);

    const prodRes = await API.get('/products?featured=true&limit=4');
    setFeaturedProducts(prodRes.data.products);

    // Fetch hero image
    try {
      const heroRes = await API.get('/settings/hero-image');

      if (heroRes.data?.value) {
        setHeroImage(heroRes.data.value);
      }
    } catch (e) {
      console.log('No hero image set yet');
    }

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">

      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-gradient-to-br from-blush-50 via-rose-50 to-cream overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-rose-100 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-blush-200 rounded-full opacity-30 blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-mauve opacity-20 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center gap-12">

            {/* Left Text */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white border border-blush-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
                <span className="text-sm">🧶</span>
                <span className="font-body text-xs text-blush-600 font-medium">Handmade with love in India</span>
              </div>

              <h1 className="font-display text-4xl md:text-6xl text-blush-900 leading-tight mb-4">
                Crochet that tells
                <span className="text-blush-500 block">your story 🌸</span>
              </h1>

              <p className="font-body text-blush-600 text-lg mb-8 leading-relaxed max-w-lg">
                Discover beautiful handmade crochet bags, accessories, and home decor — each piece made with love, just for you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/products" className="btn-primary text-base py-3 px-8 inline-flex items-center justify-center gap-2">
                  <FiShoppingBag size={18} />
                  Shop Now
                </Link>
                <Link to="/about" className="btn-outline text-base py-3 px-8 inline-flex items-center justify-center gap-2">
                  Our Story
                  <FiArrowRight size={18} />
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-10 justify-center md:justify-start">
                <div>
                  <div className="font-display text-2xl text-blush-700">200+</div>
                  <div className="font-body text-xs text-blush-400">Happy Customers</div>
                </div>
                <div className="border-l border-blush-200 pl-8">
                  <div className="font-display text-2xl text-blush-700">50+</div>
                  <div className="font-body text-xs text-blush-400">Unique Products</div>
                </div>
                <div className="border-l border-blush-200 pl-8">
                  <div className="font-display text-2xl text-blush-700">5★</div>
                  <div className="font-body text-xs text-blush-400">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Right — Decorative Box */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Main circle */}
                <div className="w-full h-full bg-gradient-to-br from-blush-100 to-rose-100 rounded-full flex items-center justify-center shadow-xl overflow-hidden border-4 border-white">
                  {heroImage ? (
                    <img
                      src={`https://crochet-vibes-by-nisha.onrender.com${heroImage}`}
                      alt="Crochet Vibes"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={require('../assets/logo.png')}
                      alt="Crochet Vibes by Nisha"
                      className="w-4/5 h-4/5 object-contain"
                    />
                  )}
                </div>
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-3 border border-blush-100">
                  <div className="font-body text-xs text-blush-600 font-medium">✨ New Arrivals</div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-3 border border-blush-100">
                  <div className="font-body text-xs text-blush-600 font-medium">🚚 Free shipping ₹999+</div>
                </div>
                <div className="absolute top-1/2 -right-8 bg-rose-500 text-white rounded-2xl shadow-lg p-3">
                  <div className="font-body text-xs font-medium">🌸 Handmade</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE STRIP ===== */}
      <div className="bg-blush-600 py-3 overflow-hidden">
        <div className="flex gap-12 animate-pulse">
          {['🧶 Handmade with Love', '🌸 New Arrivals Every Week', '🎀 Custom Orders Welcome', '✨ Pan India Delivery', '💝 Perfect Gifts', '🧶 Handmade with Love', '🌸 New Arrivals Every Week', '🎀 Custom Orders Welcome'].map((text, i) => (
            <span key={i} className="font-body text-sm text-white whitespace-nowrap">{text}</span>
          ))}
        </div>
      </div>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="section-title">Shop by Category</h2>
          <p className="font-body text-blush-400 text-sm">Find exactly what you're looking for 🌷</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, index) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className={`${categoryColors[index % categoryColors.length]} border-2 rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all duration-200 hover:-translate-y-1`}
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="font-body text-xs font-medium text-blush-700 text-center leading-tight">{cat.name}</span>
              </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="bg-blush-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="font-body text-blush-400 text-sm">Our most loved handmade pieces 💕</p>
            </div>
            <Link to="/products" className="btn-outline text-sm py-2 hidden sm:flex items-center gap-2">
              View All <FiArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              // Show dummy cards if no products yet
              [1,2,3,4].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-56 bg-blush-100"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-blush-100 rounded w-3/4"></div>
                    <div className="h-4 bg-blush-100 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link to="/products" className="btn-outline text-sm py-2 inline-flex items-center gap-2">
              View All Products <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="section-title">Why Choose Us? 🌸</h2>
          <p className="font-body text-blush-400 text-sm">We pour our heart into every stitch</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-blush-50">
              <div className="w-12 h-12 bg-blush-100 rounded-full flex items-center justify-center text-blush-500 mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="font-display text-lg text-blush-800 mb-2">{feature.title}</h3>
              <p className="font-body text-sm text-blush-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== NEWSLETTER SECTION ===== */}
      <section className="bg-gradient-to-r from-blush-600 to-rose-500 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-4xl mb-4">💌</div>
          <h2 className="font-display text-3xl text-white mb-3">Stay in the Loop!</h2>
          <p className="font-body text-blush-100 text-sm mb-8">Get notified about new arrivals, special offers, and crochet inspiration straight to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3 rounded-full font-body text-sm focus:outline-none focus:ring-2 focus:ring-white border-0"
            />
            <button className="bg-white text-blush-600 font-body font-medium px-6 py-3 rounded-full hover:bg-blush-50 transition-colors whitespace-nowrap">
              Subscribe 🌸
            </button>
          </div>
          <p className="font-body text-xs text-blush-200 mt-4">No spam, just crochet love 🧶</p>
        </div>
      </section>

    </div>
  );
};

export default Home;
