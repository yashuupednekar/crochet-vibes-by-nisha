import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiSend, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    // Simulate sending (no backend email service yet — can be added later!)
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success('Message sent! Nisha will reply soon 🌸');
      setForm({ name: '', email: '', message: '' });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
      <div className="bg-gradient-to-r from-blush-50 to-rose-50 border-b border-blush-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-4xl mb-3 block">💌</span>
          <h1 className="font-display text-4xl text-blush-800 mb-2">Get in Touch</h1>
          <p className="font-body text-blush-400 text-sm">We'd love to hear from you — questions, custom orders, or just to say hi! 🌸</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ===== CONTACT INFO ===== */}
          <div className="space-y-5">

            <div className="bg-white rounded-2xl border border-blush-100 shadow-sm p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-blush-100 rounded-full flex items-center justify-center text-blush-500 flex-shrink-0">
                <FiMail size={18} />
              </div>
              <div>
                <h3 className="font-display text-lg text-blush-800 mb-1">Email Us</h3>
                <a href="mailto:nisha@crochetvibes.com" className="font-body text-sm text-blush-500 hover:text-blush-700">nisha@crochetvibes.com</a>
                <p className="font-body text-xs text-blush-400 mt-1">We usually reply within 24 hours</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-blush-100 shadow-sm p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-blush-100 rounded-full flex items-center justify-center text-blush-500 flex-shrink-0">
                <FiPhone size={18} />
              </div>
              <div>
                <h3 className="font-display text-lg text-blush-800 mb-1">Call Us</h3>
                <a href="tel:+919999999999" className="font-body text-sm text-blush-500 hover:text-blush-700">+91 99999 99999</a>
                <p className="font-body text-xs text-blush-400 mt-1 flex items-center gap-1"><FiClock size={11} /> Mon–Sat, 10am–7pm</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-blush-100 shadow-sm p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-blush-100 rounded-full flex items-center justify-center text-blush-500 flex-shrink-0">
                <FiInstagram size={18} />
              </div>
              <div>
                <h3 className="font-display text-lg text-blush-800 mb-1">Follow Along</h3>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="font-body text-sm text-blush-500 hover:text-blush-700">@crochetvibesbynisha</a>
                <p className="font-body text-xs text-blush-400 mt-1">See our latest creations & behind the scenes</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-blush-100 shadow-sm p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-blush-100 rounded-full flex items-center justify-center text-blush-500 flex-shrink-0">
                <FiMapPin size={18} />
              </div>
              <div>
                <h3 className="font-display text-lg text-blush-800 mb-1">Based In</h3>
                <p className="font-body text-sm text-blush-500">India 🇮🇳 — Pan India shipping available</p>
              </div>
            </div>
          </div>

          {/* ===== CONTACT FORM ===== */}
          <div className="bg-white rounded-3xl border border-blush-100 shadow-sm p-6 sm:p-8">
            {sent ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="font-display text-2xl text-blush-800 mb-2">Message Sent!</h3>
                <p className="font-body text-sm text-blush-400 mb-6">Thank you for reaching out. Nisha will get back to you soon 🌸</p>
                <button onClick={() => setSent(false)} className="btn-outline">Send Another Message</button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-xl text-blush-800 mb-5">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="What should we call you?"
                      className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
                    />
                  </div>

                  <div>
                    <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300"
                    />
                  </div>

                  <div>
                    <label className="font-body text-sm font-medium text-blush-700 mb-1.5 block">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us what's on your mind — custom orders, questions, anything! 🌸"
                      rows={5}
                      className="w-full px-4 py-3 bg-blush-50 border border-blush-100 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-blush-300 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3 text-base justify-center gap-2"
                  >
                    {loading ? 'Sending...' : (
                      <>
                        <FiSend size={16} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;