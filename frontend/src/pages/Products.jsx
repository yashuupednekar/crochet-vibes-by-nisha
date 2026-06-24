import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import API from '../services/api';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, currentPage, sortBy]);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/products?page=${currentPage}&limit=12`;
      if (keyword) url += `&keyword=${keyword}`;
      if (selectedCategory) url += `&category=${selectedCategory}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;

      const { data } = await API.get(url);
      setProducts(data.products);
      setTotalPages(data.pages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleClearFilters = () => {
    setKeyword('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-cream">

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blush-50 to-rose-50 border-b border-blush-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl text-blush-800 mb-2">Our Collection 🧶</h1>
          <p className="font-body text-blush-400 text-sm">Handmade with love, crafted just for you</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ===== SIDEBAR FILTERS ===== */}
          <div className={`lg:w-64 flex-shrink-0`}>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full flex items-center justify-between bg-white border border-blush-200 rounded-xl px-4 py-3 mb-4 font-body text-sm text-blush-700"
            >
              <span className="flex items-center gap-2"><FiFilter size={16} /> Filters</span>
              <FiChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>

              {/* Search */}
              <div className="bg-white rounded-2xl p-5 border border-blush-100 shadow-sm">
                <h3 className="font-display text-lg text-blush-800 mb-3">Search</h3>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blush-300" size={14} />
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-9 pr-4 py-2.5 bg-blush-50 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 border border-blush-100"
                    />
                  </div>
                  <button type="submit" className="mt-2 w-full btn-primary text-sm py-2 justify-center">
                    Search
                  </button>
                </form>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl p-5 border border-blush-100 shadow-sm">
                <h3 className="font-display text-lg text-blush-800 mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}
                    className={`w-full text-left px-3 py-2 rounded-xl font-body text-sm transition-colors ${selectedCategory === '' ? 'bg-blush-500 text-white' : 'hover:bg-blush-50 text-blush-700'}`}
                  >
                    🧶 All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => { setSelectedCategory(cat._id); setCurrentPage(1); }}
                      className={`w-full text-left px-3 py-2 rounded-xl font-body text-sm transition-colors ${selectedCategory === cat._id ? 'bg-blush-500 text-white' : 'hover:bg-blush-50 text-blush-700'}`}
                    >
                      {cat.emoji} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-2xl p-5 border border-blush-100 shadow-sm">
                <h3 className="font-display text-lg text-blush-800 mb-3">Price Range</h3>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min ₹"
                    className="w-full px-3 py-2 bg-blush-50 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 border border-blush-100"
                  />
                  <span className="text-blush-300 font-body text-sm">—</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max ₹"
                    className="w-full px-3 py-2 bg-blush-50 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 border border-blush-100"
                  />
                </div>
                <button
                  onClick={() => { setCurrentPage(1); fetchProducts(); }}
                  className="mt-2 w-full btn-outline text-sm py-2 justify-center"
                >
                  Apply
                </button>
              </div>

              {/* Clear Filters */}
              <button
                onClick={handleClearFilters}
                className="w-full flex items-center justify-center gap-2 text-blush-400 hover:text-blush-600 font-body text-sm transition-colors"
              >
                <FiX size={14} /> Clear all filters
              </button>
            </div>
          </div>

          {/* ===== PRODUCTS GRID ===== */}
          <div className="flex-1">

            {/* Sort bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="font-body text-sm text-blush-400">
                {loading ? 'Loading...' : `${products.length} products found`}
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-body text-sm bg-white border border-blush-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blush-300 text-blush-700"
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Loading skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-56 bg-blush-100"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-blush-100 rounded w-3/4"></div>
                      <div className="h-4 bg-blush-100 rounded w-1/2"></div>
                      <div className="h-8 bg-blush-100 rounded mt-3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty state */
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🧶</div>
                <h3 className="font-display text-2xl text-blush-700 mb-2">No products found</h3>
                <p className="font-body text-blush-400 text-sm mb-6">Try a different search or category</p>
                <button onClick={handleClearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              /* Products Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full font-body text-sm transition-all ${
                      currentPage === page
                        ? 'bg-blush-500 text-white shadow-md'
                        : 'bg-white text-blush-500 border border-blush-200 hover:bg-blush-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;