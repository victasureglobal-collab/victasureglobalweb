import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ShieldAlert, LogIn, LogOut, ShoppingCart, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

import logoImg from '../assets/logo/VictaSure_Final.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { settings, isAdminAuthenticated, logoutAdmin, currentUser, logoutUser, cart } = useApp();

  useEffect(() => {
    const initTranslateElement = () => {
      const el = document.getElementById('google_translate_element');
      if (el && window.google && window.google.translate) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,ta,hi,ml,te,kn,mr,gu,bn', // English, Tamil, Hindi, Malayalam, Telugu, etc.
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            },
            'google_translate_element'
          );
        } catch (e) {
          console.warn("Google Translate initialization delayed or failed:", e);
        }
      }
    };

    window.googleTranslateElementInit = initTranslateElement;

    // Check if script is already present and initialized
    if (window.google && window.google.translate) {
      initTranslateElement();
    } else {
      const scriptId = 'google-translate-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }
    }

    const timer = setTimeout(initTranslateElement, 600);
    return () => clearTimeout(timer);
  }, []);

  const companyName = settings?.company_name || "VictaSure Global";
  const cartItemCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Catalogue', href: '/catalogue' },
    { name: 'Previous Work', href: '/previous-work' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Contact', href: '/contact' },
  ];

  if (settings?.show_terms_page !== false) {
    navigation.splice(navigation.length - 1, 0, { name: 'Terms & Conditions', href: '/terms' });
  }

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      {/* Top Bar for contact details and Google Translate */}
      <div className="bg-primary text-white text-[10px] sm:text-[11px] py-2 px-4 sm:px-6 lg:px-8 border-b border-primary-light">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 text-gray-300">
            <span>{settings?.contact_email || "export@victasure.com"}</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">{settings?.contact_phone || "+91 98765 43210"}</span>
          </div>
          <div className="flex items-center space-x-1.5 ml-auto">
            <Globe size={11} className="text-accent" />
            <div id="google_translate_element" className="google-translate-topbar"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group">
              <img src={logoImg} alt={companyName} className="h-10 w-auto object-contain max-w-[180px]" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`py-2 text-xs font-semibold tracking-wide transition-all border-b-2 ${
                  isActive(item.href)
                    ? 'text-primary border-primary font-bold'
                    : 'text-gray-500 border-transparent hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions Toolbar - Shared on desktop & mobile */}
          <div className="flex items-center space-x-3 sm:space-x-4">

            {/* Cart Link with Badge */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-500 hover:text-primary transition-colors flex items-center"
              title="Shopping Cart"
            >
              <ShoppingCart size={19} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Desktop Admin/Client Login desk */}
            <div className="hidden md:flex items-center space-x-3">
              {isAdminAuthenticated ? (
                <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
                  <button
                    onClick={logoutAdmin}
                    className="text-[10px] font-bold text-red-500 hover:underline focus:outline-none cursor-pointer flex items-center space-x-1"
                    title="Logout"
                  >
                    <LogOut size={13} />
                    <span>Admin Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 border-l pl-4 border-gray-200 font-sans">
                  {currentUser ? (
                    <div className="flex items-center space-x-2.5">
                      <Link to="/profile" className="text-[10px] font-bold text-gray-700 hover:text-accent transition-colors hover:underline">
                        Hello, {currentUser.name.split(' ')[0]}
                      </Link>
                      <button
                        onClick={logoutUser}
                        className="text-[10px] font-bold text-red-500 hover:underline focus:outline-none cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="bg-secondary hover:bg-secondary-light text-white text-[10px] font-bold px-3 py-1.5 rounded-large flex items-center space-x-1 transition-all shadow-sm"
                    >
                      <span>Client Login</span>
                    </Link>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-large text-gray-500 hover:text-primary hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            


            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-large text-sm font-semibold ${
                  isActive(item.href)
                    ? 'text-primary bg-gray-50 font-bold'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Actions Drawer (No Admin login links publicly shown) */}
            {isAdminAuthenticated ? (
              <div className="px-3 py-2.5 flex items-center justify-between border-t border-gray-100 mt-2">
                <button
                  onClick={() => { logoutAdmin(); setIsOpen(false); }}
                  className="text-red-500 font-semibold text-sm flex items-center space-x-1 focus:outline-none cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Admin Logout</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-100 mt-2 pt-2 space-y-1 font-sans">
                {currentUser ? (
                  <div className="px-3 py-2 flex items-center justify-between text-sm font-semibold text-gray-700">
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="hover:text-accent transition-colors hover:underline">
                      Hello, {currentUser.name}
                    </Link>
                    <button
                      onClick={() => { logoutUser(); setIsOpen(false); }}
                      className="text-red-500 font-semibold underline focus:outline-none cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-large text-sm font-semibold text-gray-600 hover:text-primary hover:bg-gray-50"
                  >
                    <LogIn size={16} className="text-accent" />
                    <span>Client Login</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
