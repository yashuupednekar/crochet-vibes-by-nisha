import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiImage } from 'react-icons/fi';
import AdminLayout from '../../components/AdminLayout';
import API from '../../services/api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '',
    category: '', stock: '', isFeatured: false,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products?limit=100');
      setProducts(data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', discountPrice: '', category: '', stock: '', isFeatured: false });
    setImageFiles([]);
    setImagePreviews([]);
    setEditingProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || '',
      category: product.category?._id || '',
      stock: product.stock,
      isFeatured: product.isFeatured,
    });
    setImagePreviews(product.images?.map(img => `http://localhost:5000${img}`) || []);
    setImageFiles([]);
    setShowModal(true);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImageFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.price || !form.category || form.stock === '') {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('discountPrice', form.discountPrice || '');
      formData.append('category', form.category);
      formData.append('stock', form.stock);
      formData.append('isFeatured', form.isFeatured);
      imageFiles.forEach(file => formData.append('images', file));

      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated! 🌸');
      } else {
        if (imageFiles.length === 0) {
          toast.error('Please add at least one product image');
          setSubmitting(false);
          return;
        }
        await API.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product added! 🧶');
      }

      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-blush-800 mb-1">Products 📦</h1>
          <p className="font-body text-sm text-blush-400">{products.length} products in your store</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-blush-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="text-4xl animate-pulse">🧶</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📦</div>
            <h3 className="font-display text-xl text-blush-700 mb-2">No products yet</h3>
            <p className="font-body text-sm text-blush-400 mb-6">Add your first product to get started!</p>
            <button onClick={openAddModal} className="btn-primary">Add Product</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blush-50">
                  <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Product</th>
                  <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Category</th>
                  <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Price</th>
                  <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Stock</th>
                  <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Status</th>
                  <th className="text-left font-body text-xs text-blush-400 font-medium px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-blush-50 hover:bg-blush-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blush-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl">🧶</span>
                          )}
                        </div>
                        <div>
                          <p className="font-body text-sm font-medium text-blush-800 truncate max-w-xs">{product.name}</p>
                          {product.isFeatured && <span className="font-body text-xs text-amber-500">⭐ Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-blush-600">
                      {product.category?.emoji} {product.category?.name}
                    </td>
                    <td className="px-6 py-4 font-body text-sm">
                      {product.discountPrice ? (
                        <>
                          <span className="text-blush-700 font-medium">₹{product.discountPrice}</span>
                          <span className="text-gray-400 line-through ml-1 text-xs">₹{product.price}</span>
                        </>
                      ) : (
                        <span className="text-blush-700 font-medium">₹{product.price}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-body text-sm">
                      <span className={product.stock === 0 ? 'text-red-500' : 'text-blush-600'}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(product)} className="p-2 hover:bg-blush-100 rounded-lg text-blush-500 transition-colors">
                          <FiEdit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(product._id, product.name)} className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-colors">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== ADD/EDIT MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-blush-100 sticky top-0 bg-white z-10">
              <h2 className="font-display text-xl text-blush-800">
                {editingProduct ? 'Edit Product ✏️' : 'Add New Product 🧶'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-blush-50 rounded-full text-blush-400">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {/* Image Upload */}
              <div>
                <label className="font-body text-sm font-medium text-blush-700 mb-2 block">
                  Product Images {!editingProduct && <span className="text-rose-500">*</span>}
                </label>
                <label className="border-2 border-dashed border-blush-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-blush-50 transition-colors">
                  <FiUpload className="text-blush-400" size={24} />
                  <span className="font-body text-sm text-blush-500">Click to upload images from device (max 5)</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
                </label>

                {imagePreviews.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-blush-100">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                {editingProduct && imageFiles.length === 0 && (
                  <p className="font-body text-xs text-blush-400 mt-2 flex items-center gap-1">
                    <FiImage size={12} /> Upload new images to replace, or leave empty to keep current ones
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Boho Crochet Tote Bag"
                  className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your beautiful creation..."
                  rows={3}
                  className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 resize-none"
                />
              </div>

              {/* Price row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Price (₹) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="899"
                    className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
                  />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={form.discountPrice}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
                  />
                </div>
              </div>

              {/* Category + Stock row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.emoji} {cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Stock Quantity *</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="10"
                    className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
                  />
                </div>
              </div>

              {/* Featured toggle */}
              <label className="flex items-center gap-3 cursor-pointer bg-blush-50 rounded-xl p-4">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-blush-500"
                />
                <div>
                  <p className="font-body text-sm font-medium text-blush-700">⭐ Mark as Featured</p>
                  <p className="font-body text-xs text-blush-400">Featured products show on the homepage</p>
                </div>
              </label>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-outline justify-center py-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary justify-center py-3"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product 🌸'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;