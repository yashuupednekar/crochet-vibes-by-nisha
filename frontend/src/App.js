import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';
import AdminCategories from './pages/admin/Categories';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// const ComingSoon = ({ page }) => (
//   <div className="min-h-screen flex items-center justify-center">
//     <div className="text-center">
//       <div className="text-6xl mb-4">🧶</div>
//       <h1 className="font-display text-3xl text-blush-700 mb-2">{page}</h1>
//       <p className="font-body text-blush-400">Coming soon — we're crafting this page!</p>
//     </div>
//   </div>
// );

// Layout wrapper that hides Navbar/Footer on admin pages
const StorefrontLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <Toaster position="top-center" toastOptions={{
        style: { fontFamily: 'Poppins', fontSize: '14px', borderRadius: '12px' },
      }} />
      <Routes>
        {/* Admin routes — no navbar/footer */}
        <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
         <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />

        {/* Storefront routes — with navbar/footer */}
        <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
        <Route path="/login" element={<StorefrontLayout><Login /></StorefrontLayout>} />
        <Route path="/register" element={<StorefrontLayout><Register /></StorefrontLayout>} />
        <Route path="/products" element={<StorefrontLayout><Products /></StorefrontLayout>} />
        <Route path="/product/:id" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
        <Route path="/cart" element={<StorefrontLayout><Cart /></StorefrontLayout>} />
        <Route path="/checkout" element={<StorefrontLayout><Checkout /></StorefrontLayout>} />
        <Route path="/payment/:orderId" element={<StorefrontLayout><Payment /></StorefrontLayout>} />
        <Route path="/about" element={<StorefrontLayout><About /></StorefrontLayout>} />
        <Route path="/contact" element={<StorefrontLayout><Contact /></StorefrontLayout>} />
        <Route path="/profile" element={<StorefrontLayout><Profile /></StorefrontLayout>} />
        <Route path="/orders" element={<StorefrontLayout><MyOrders /></StorefrontLayout>} />
        <Route path="*" element={<StorefrontLayout><NotFound /></StorefrontLayout>} />
      </Routes>
    </Router>
  );
}

export default App;