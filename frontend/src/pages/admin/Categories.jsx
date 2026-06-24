import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import AdminLayout from '../../components/AdminLayout';
import API from '../../services/api';
import toast from 'react-hot-toast';

const emojiOptions = ['🧶', '👜', '🏡', '🎀', '🔑', '🌿', '🎁', '👗', '🧸', '🌸', '☀️', '❄️', '💍', '👶', '🐰'];

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ name: '', emoji: '🧶', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setForm({ name: '', emoji: '🧶', description: '' });
    setEditingCategory(null);
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setForm({ name: category.name, emoji: category.emoji, description: category.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCategory) {
        await API.put(`/categories/${editingCategory._id}`, form);
        toast.success('Category updated! 🌸');
      } else {
        await API.post('/categories', form);
        toast.success('Category added! 🏷️');
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}" category? Products in this category won't be deleted.`)) return;
    try {
      await API.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-blush-800 mb-1">Categories 🏷️</h1>
          <p className="font-body text-sm text-blush-400">{categories.length} categories</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <FiPlus size={16} /> Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl h-32 border border-blush-100 animate-pulse"></div>)}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-blush-100 text-center py-16">
          <div className="text-5xl mb-3">🏷️</div>
          <h3 className="font-display text-xl text-blush-700 mb-2">No categories yet</h3>
          <button onClick={openAddModal} className="btn-primary mt-2">Add Category</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white rounded-2xl p-5 border border-blush-100 shadow-sm hover:shadow-md transition-shadow text-center group relative">
              <span className="text-4xl mb-2 block">{cat.emoji}</span>
              <p className="font-body text-sm font-medium text-blush-800">{cat.name}</p>

              <div className="flex items-center justify-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(cat)} className="p-1.5 hover:bg-blush-100 rounded-lg text-blush-500 transition-colors">
                  <FiEdit2 size={13} />
                </button>
                <button onClick={() => handleDelete(cat._id, cat.name)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-colors">
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== ADD/EDIT MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full">

            <div className="flex items-center justify-between p-6 border-b border-blush-100">
              <h2 className="font-display text-xl text-blush-800">
                {editingCategory ? 'Edit Category ✏️' : 'Add Category 🏷️'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-blush-50 rounded-full text-blush-400">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {/* Emoji picker */}
              <div>
                <label className="font-body text-sm font-medium text-blush-700 mb-2 block">Choose an Icon</label>
                <div className="flex flex-wrap gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setForm({ ...form, emoji })}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                        form.emoji === emoji ? 'bg-blush-500 scale-110' : 'bg-blush-50 hover:bg-blush-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Category Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Seasonal Specials"
                  className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Description (optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="A short description..."
                  rows={2}
                  className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-outline justify-center py-3">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 btn-primary justify-center py-3">
                  {submitting ? 'Saving...' : editingCategory ? 'Update' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategories;