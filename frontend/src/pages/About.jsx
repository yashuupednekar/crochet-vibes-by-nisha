import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const values = [
  { icon: '🧶', title: 'Handmade with Love', desc: 'Every single piece is crocheted by hand, stitch by stitch, with care and patience.' },
  { icon: '🌱', title: 'Quality Materials', desc: 'We use only premium yarns that are soft, durable, and gentle on the skin.' },
  { icon: '💝', title: 'Made to Order', desc: 'Many of our pieces are made fresh for you, ensuring the best quality every time.' },
  { icon: '🌍', title: 'Sustainable Craft', desc: 'Crochet is a slow, mindful craft — kinder to the planet than mass production.' },
];

const milestones = [
  { year: '2022', text: 'Nisha picked up a crochet hook for the first time during lockdown' },
  { year: '2023', text: 'Started selling handmade pieces to friends and family' },
  { year: '2024', text: 'Crochet Vibes was born — now available online for everyone!' },
  { year: '2026', text: '200+ happy customers and counting 🌸' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-cream">

      {/* ===== HERO ===== */}
      <section className="bg-gradient-to-br from-blush-50 via-rose-50 to-cream py-16 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-48 h-48 bg-rose-100 rounded-full opacity-40 blur-3xl"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="text-5xl mb-4 block">🌸</span>
          <h1 className="font-display text-4xl md:text-5xl text-blush-900 mb-4">Our Story</h1>
          <p className="font-body text-blush-500 text-lg leading-relaxed max-w-2xl mx-auto">
            Crochet Vibes by Nisha began with a single hook, a ball of yarn, and a whole lot of love. Today, it's a small business built on passion, patience, and a dream to bring handmade warmth into your life.
          </p>
        </div>
      </section>

      {/* ===== STORY SECTION ===== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Photo placeholder */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blush-200 to-rose-200 rounded-3xl flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-7xl mb-3">👩‍🎨</div>
                <p className="font-display text-blush-700 text-xl">Hi, I'm Nisha!</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-blush-100">
              <p className="font-display text-2xl text-blush-600">200+</p>
              <p className="font-body text-xs text-blush-400">Happy Customers</p>
            </div>
          </div>

          {/* Text */}
          <div>
            <span className="badge bg-blush-100 text-blush-600 mb-4 inline-block">Meet the Maker</span>
            <h2 className="font-display text-3xl text-blush-800 mb-4">From a Hobby to a Heartfelt Business</h2>
            <p className="font-body text-blush-600 leading-relaxed mb-4">
              What started as a way to relax during quiet evenings quickly turned into something much bigger. Nisha discovered that every loop and stitch brought her joy — and soon, friends and family wanted pieces of their own.
            </p>
            <p className="font-body text-blush-600 leading-relaxed mb-6">
              Today, Crochet Vibes is a celebration of that journey. Every bag, every flower, every little hair clip carries a piece of that same passion — made just for you, with the same love it all began with. 🌸
            </p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              Shop Our Collection <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TIMELINE ===== */}
      <section className="bg-blush-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Journey 🧶</h2>
            <p className="font-body text-blush-400 text-sm">From a single skein of yarn to a growing community</p>
          </div>

          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl border border-blush-100 shadow-sm flex items-center justify-center">
                  <span className="font-display text-sm text-blush-600">{m.year}</span>
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-blush-100 shadow-sm p-4 mt-1">
                  <p className="font-body text-sm text-blush-700">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">What We Believe In 💕</h2>
          <p className="font-body text-blush-400 text-sm">The values behind every stitch</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div key={value.title} className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-blush-50">
              <span className="text-4xl mb-4 block">{value.icon}</span>
              <h3 className="font-display text-lg text-blush-800 mb-2">{value.title}</h3>
              <p className="font-body text-sm text-blush-400 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-gradient-to-r from-blush-600 to-rose-500 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-4xl mb-4">🎀</div>
          <h2 className="font-display text-3xl text-white mb-3">Want Something Custom Made?</h2>
          <p className="font-body text-blush-100 text-sm mb-8">We love bringing your ideas to life! Reach out and let's create something special together.</p>
          <Link to="/contact" className="bg-white text-blush-600 font-body font-medium px-8 py-3 rounded-full hover:bg-blush-50 transition-colors inline-flex items-center gap-2">
            Get in Touch <FiArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;