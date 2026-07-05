import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ShieldAlert, LogIn, LogOut, ShoppingCart, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

import logoImg from '../assets/logo/VictaSure_Final.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { settings, isAdminAuthenticated, logoutAdmin, currentUser, logoutUser, cart, loading } = useApp();

  useEffect(() => {
    const initTranslateElement = () => {
      const el = document.getElementById('google_translate_element');
      if (el && window.google && window.google.translate) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,de,fr,es,pt,ar,ta,hi,ml,te,kn,mr,gu,bn', // Added de, fr, es, pt, ar
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            },
            'google_translate_element'
          );
        } catch (e) {
          console.error("Failed to initialize Google Translate:", e);
        }
      }
    };


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
  ];

  if (settings?.show_previous_work !== false) {
    navigation.push({ name: 'Previous Work', href: '/previous-work' });
  }

  navigation.push({ name: 'Testimonials', href: '/testimonials' });
  navigation.push({ name: 'Blogs', href: '/blogs' });

  if (settings?.show_certificates_page !== false) {
    navigation.push({ name: 'Certificates', href: '/certificates' });
  }

  navigation.push({ name: 'Contact', href: '/contact' });

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      {/* Top Bar for contact details and Google Translate */}
      <div className="relative z-50 bg-primary text-white text-[10px] sm:text-[11px] py-2 px-4 sm:px-6 lg:px-8 border-b border-primary-light">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 text-gray-300 relative z-[60] pointer-events-auto">
            <a href={`mailto:${settings?.contact_email || "info@victasure.com"}`} className="hover:text-white transition-colors relative z-[60] pointer-events-auto cursor-pointer">
              {settings?.contact_email || "info@victasure.com"}
            </a>
            <span className="hidden sm:inline">|</span>
            <a href={`tel:${(settings?.contact_phone || "+91 83909 00120").replace(/\s+/g, "")}`} className="hidden sm:inline hover:text-white transition-colors relative z-[60] pointer-events-auto cursor-pointer">
              {settings?.contact_phone || "+91 83909 00120"}
            </a>
          </div>
          <div className="flex items-center space-x-3 ml-auto">
            <div className="flex items-center space-x-1.5">
              <Globe size={11} className="text-accent" />
              <select
                onChange={(e) => {
                  const lang = e.target.value;
                  document.cookie = `googtrans=/en/${lang}; path=/;`;
                  window.location.reload();
                }}
                className="bg-primary border border-primary-light text-white text-[10px] sm:text-[11px] rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Language</option>
                <option value="en">English</option>
                <option value="de">German</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="pt">Portuguese</option>
                <option value="ar">Arabic</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="kn">Kannada</option>
                <option value="ml">Malayalam</option>
                <option value="mr">Marathi</option>
                <option value="gu">Gujarati</option>
                <option value="bn">Bengali</option>
              </select>
            </div>
            <div id="google_translate_element" className="google-translate-topbar hidden sm:block"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <img src={settings?.logo_url || logoImg} alt={companyName} className="h-10 w-auto object-contain max-w-[180px]" />
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

            {settings?.enable_cart && (
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
            )}

            {settings?.enable_client_login && (
              <div className="flex items-center space-x-3">
                {currentUser ? (
                  <div className="flex items-center space-x-2 border-l pl-4 border-gray-200">
                    <Link
                      to="/profile"
                      className="text-xs font-bold text-primary hover:text-accent flex items-center space-x-1"
                    >
                      <span>Profile</span>
                    </Link>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={logoutUser}
                      className="text-red-500 text-[10px] hover:underline focus:outline-none cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="text-xs font-bold text-gray-600 hover:text-primary flex items-center space-x-1"
                  >
                    <LogIn size={14} />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            )}

            {/* Desktop Admin Login desk */}
            <div className="hidden md:flex items-center space-x-3">
              {isAdminAuthenticated && (
                <div className="flex items-center space-x-3 border-l pl-4 border-gray-200 text-[10px] font-bold">
                  <Link to="/admin" className="text-secondary hover:underline flex items-center space-x-1">
                    <Shield size={12} />
                    <span>Admin Panel</span>
                  </Link>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={logoutAdmin}
                    className="text-red-500 hover:underline focus:outline-none cursor-pointer flex items-center space-x-1"
                    title="Logout"
                  >
                    <LogOut size={12} />
                    <span>Logout</span>
                  </button>
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

             {settings?.enable_client_login && (
              <div className="px-3 py-2.5 flex items-center justify-between border-t border-gray-100 mt-2">
                {currentUser ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="text-primary font-semibold text-xs flex items-center space-x-1"
                    >
                      <span>Profile ({currentUser.name})</span>
                    </Link>
                    <button
                      onClick={() => { logoutUser(); setIsOpen(false); }}
                      className="text-red-500 font-semibold text-xs flex items-center space-x-1 focus:outline-none cursor-pointer"
                    >
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-600 font-semibold text-xs flex items-center space-x-1"
                  >
                    <LogIn size={14} />
                    <span>Client Login</span>
                  </Link>
                )}
              </div>
            )}

            {/* Mobile Actions Drawer (Only Admin panel shown if authenticated) */}
            {isAdminAuthenticated && (
              <div className="px-3 py-2.5 flex items-center justify-between border-t border-gray-100 mt-2">
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="text-secondary font-semibold text-xs flex items-center space-x-1"
                >
                  <Shield size={14} />
                  <span>Admin Panel</span>
                </Link>
                <button
                  onClick={() => { logoutAdmin(); setIsOpen(false); }}
                  className="text-red-500 font-semibold text-xs flex items-center space-x-1 focus:outline-none cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
