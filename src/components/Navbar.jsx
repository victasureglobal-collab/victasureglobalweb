import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ShieldAlert, LogIn, LogOut, ShoppingCart, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const { settings, isAdminAuthenticated, logoutAdmin, currentUser, logoutUser, cart } = useApp();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const initTranslateElement = () => {
      const el = document.getElementById('google_translate_element');
      if (el && window.google && window.google.translate) {
        el.innerHTML = ''; // Clear previous translations element to avoid duplicate widgets
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

    // To ensure fresh initialization on every mount/view switch, reload the script
    const loadScript = () => {
      // 1. Remove old script tags
      const oldScript = document.getElementById('google-translate-script');
      if (oldScript) oldScript.remove();

      const allScripts = document.getElementsByTagName('script');
      for (let i = allScripts.length - 1; i >= 0; i--) {
        const src = allScripts[i].src || '';
        if (src.includes('translate_a/element.js') || src.includes('translate_a/main.js') || src.includes('translate.google.com')) {
          allScripts[i].remove();
        }
      }

      // 2. Clear global google translation states
      if (window.google) {
        window.google.translate = undefined;
      }

      // 3. Create fresh script tag
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    loadScript();

    const timer = setTimeout(initTranslateElement, 400);
    return () => {
      clearTimeout(timer);
      window.googleTranslateElementInit = null;
    };
  }, [isMobile, isOpen]);

  const companyName = settings?.company_name || "VictaSure Global";
  const cartItemCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Previous Work', href: '/previous-work' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="w-9 h-9 bg-primary text-white rounded-large font-bold flex items-center justify-center text-sm shadow-sm">
                VS
              </span>
              <div className="flex flex-col">
                <span className="text-primary font-extrabold text-base tracking-wide group-hover:text-secondary transition-colors">
                  {companyName}
                </span>
                <span className="text-[9px] text-accent font-semibold tracking-widest uppercase">
                  Global Exporter
                </span>
              </div>
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
            
            {/* Google Translate (Desktop only in header to prevent mobile clutter) */}
            {!isMobile && (
              <div className="flex items-center space-x-1 google-translate-container">
                <Globe size={13} className="text-primary" />
                <div id="google_translate_element"></div>
              </div>
            )}

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
                  <Link
                    to="/admin"
                    className="bg-primary/5 hover:bg-primary/10 text-primary text-[10px] font-bold px-3 py-1.5 rounded-large border border-primary/20 flex items-center space-x-1 transition-all"
                  >
                    <Shield size={12} className="text-accent" />
                    <span>Admin Panel</span>
                  </Link>
                  <button
                    onClick={logoutAdmin}
                    className="text-gray-500 hover:text-red-600 text-xs font-semibold focus:outline-none cursor-pointer"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 border-l pl-4 border-gray-200 font-sans">
                  {currentUser ? (
                    <div className="flex items-center space-x-2.5">
                      <span className="text-[10px] font-bold text-gray-700">Hello, {currentUser.name.split(' ')[0]}</span>
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
            
            {/* Google Translate Mobile (Inside Drawer Menu to keep header clean) */}
            {isMobile && (
              <div className="px-3 py-2.5 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 flex items-center space-x-1">
                  <Globe size={14} className="text-gray-400" />
                  <span>Language / மொழி:</span>
                </span>
                <div className="google-translate-container">
                  <div id="google_translate_element"></div>
                </div>
              </div>
            )}

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
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 text-sm font-semibold text-primary"
                >
                  <Shield size={16} className="text-accent" />
                  <span>Go to Admin Panel</span>
                </Link>
                <button
                  onClick={() => { logoutAdmin(); setIsOpen(false); }}
                  className="text-red-500 font-semibold text-sm flex items-center space-x-1 focus:outline-none cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-100 mt-2 pt-2 space-y-1 font-sans">
                {currentUser ? (
                  <div className="px-3 py-2 flex items-center justify-between text-sm font-semibold text-gray-700">
                    <span>Hello, {currentUser.name}</span>
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
