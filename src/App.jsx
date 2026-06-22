import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LeadModal from './components/LeadModal';
import ProtectedRoute from './components/ProtectedRoute';
import { useApp } from './context/AppContext';
import { BookOpen } from 'lucide-react';
import './App.css';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Certificates from './pages/Certificates';
import Blogs from './pages/Blogs';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Testimonials from './pages/Testimonials';
import PreviousWork from './pages/PreviousWork';
import Terms from './pages/Terms';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import UserLogin from './pages/UserLogin';
import Catalogue from './pages/Catalogue';

export default function App() {
  const { settings } = useApp();
  const location = useLocation();
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  
  // Shared product modal / selection states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [enquiryProduct, setEnquiryProduct] = useState(null);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-neutral-lightBg min-w-[320px]">
      
      {/* Visitor Header Navigation */}
      {!isAdminRoute && (
        <Navbar onOpenDownloadModal={() => setIsDownloadOpen(true)} />
      )}

      {/* Primary Routes */}
      <div className="flex-grow flex flex-col">
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                onOpenDownloadModal={() => setIsDownloadOpen(true)} 
                setSelectedProduct={setSelectedProduct}
                setEnquiryProduct={setEnquiryProduct}
              />
            } 
          />
          
          <Route 
            path="/products" 
            element={
              <Products 
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                setEnquiryProduct={setEnquiryProduct}
              />
            } 
          />
          
          <Route path="/about" element={<About />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<Blogs />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/previous-work" element={<PreviousWork />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cart" element={<Cart />} />
          <Route 
            path="/catalogue" 
            element={<Catalogue onOpenDownloadModal={() => setIsDownloadOpen(true)} />} 
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/login" element={<UserLogin />} />
          
          <Route 
            path="/contact" 
            element={
              <Contact 
                enquiryProduct={enquiryProduct} 
                setEnquiryProduct={setEnquiryProduct} 
              />
            } 
          />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>

      {/* Visitor Footer */}
      {!isAdminRoute && (
        <Footer />
      )}

      {/* Floating Widgets for Visitors */}
      {!isAdminRoute && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 items-end">
          {/* Catalogue Sticky button */}
          <button
            onClick={() => setIsDownloadOpen(true)}
            className="bg-primary hover:bg-primary-light text-white w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center cursor-pointer"
            title="Download Catalogue"
          >
            <BookOpen size={20} className="text-accent stroke-[2.5]" />
          </button>

          {/* WhatsApp bubble */}
          <a
            href={`https://wa.me/${settings?.contact_whatsapp ? settings.contact_whatsapp.replace(/[^0-9]/g, '') : '919876543210'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#1EBE57] text-white w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center cursor-pointer"
            title="WhatsApp Trade Desk"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.63-1.019-5.101-2.871-6.956C16.612 1.93 14.14 .99 11.516.99c-5.439 0-9.863 4.42-9.866 9.865-.001 1.75.467 3.461 1.353 4.98L2.002 22l6.23-1.63c1.554.848 3.125 1.296 4.415 1.294z"/>
            </svg>
          </a>
        </div>
      )}

      {/* Global Lead capture catalog download modal */}
      <LeadModal isOpen={isDownloadOpen} onClose={() => setIsDownloadOpen(false)} />

    </div>
  );
}
