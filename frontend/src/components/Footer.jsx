import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiMail, FiPhone } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-blush-800 text-blush-100 mt-16">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-rose-300 via-blush-400 to-mauve"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🧶</span>
              <div>
                <span className="font-display text-xl text-white block">Crochet Vibes</span>
                <span className="font-body text-xs text-blush-300">by Nisha</span>
              </div>
            </div>
            <p className="font-body text-sm text-blush-300 leading-relaxed">
              Handmade with love 🌸 Every piece is crafted with care, bringing warmth and charm to your everyday life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg text-white mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="font-body text-sm text-blush-300 hover:text-white transition-colors">Home</Link>
              <Link to="/products" className="font-body text-sm text-blush-300 hover:text-white transition-colors">Shop All</Link>
              <Link to="/about" className="font-body text-sm text-blush-300 hover:text-white transition-colors">About Nisha</Link>
              <Link to="/contact" className="font-body text-sm text-blush-300 hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg text-white mb-4">Get in Touch</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:nisha@crochetvibes.com" className="flex items-center gap-2 font-body text-sm text-blush-300 hover:text-white transition-colors">
                <FiMail size={14} /> nisha@crochetvibes.com
              </a>
              <a href="tel:+919999999999" className="flex items-center gap-2 font-body text-sm text-blush-300 hover:text-white transition-colors">
                <FiPhone size={14} /> +91 99999 99999
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 font-body text-sm text-blush-300 hover:text-white transition-colors">
                <FiInstagram size={14} /> @crochetvibesbynisha
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-blush-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-blush-400">© 2024 Crochet Vibes by Nisha. Made with 🌸 in India.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="font-body text-xs text-blush-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="font-body text-xs text-blush-400 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;