import React, { createContext, useState, useEffect, useContext } from 'react';
import { dbService } from '../services/dbService';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [founder, setFounder] = useState(null);
  const [settings, setSettings] = useState(null);
  const [orders, setOrders] = useState([]);
  const [trafficViews, setTrafficViews] = useState([]);
  const [trafficStats, setTrafficStats] = useState({ totalViews: 0, countryViews: {} });

  // Cart state persisted to localStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('vs_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('vs_cart', JSON.stringify(cart));
  }, [cart]);
  
  // Admin auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('vs_admin_auth') === 'true';
  });

  // Client/User auth
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('vs_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const refreshData = async () => {
    try {
      setLoading(true);
      const [cats, subcats, prods, certs, blgs, fndr, stgs] = await Promise.all([
        dbService.getCategories(),
        dbService.getSubcategories(),
        dbService.getProducts(),
        dbService.getCertificates(),
        dbService.getBlogs(),
        dbService.getFounderDetails(),
        dbService.getWebsiteSettings(),
      ]);

      setCategories(cats);
      setSubcategories(subcats || []);
      setProducts(prods);
      setCertificates(certs);
      setBlogs(blgs);
      setFounder(fndr);
      setSettings(stgs);

      setLoading(false);

      // Fetch admin data in the background
      (async () => {
        try {
          const [enqs, dls, ords, views] = await Promise.all([
            dbService.getEnquiries(),
            dbService.getDownloads(),
            dbService.getOrders(),
            dbService.getTrafficViews(),
          ]);

          setEnquiries(enqs);
          setDownloads(dls);
          setOrders(ords);
          setTrafficViews(views || []);

          // Derive trafficStats from views array
          const totalViews = (views || []).length;
          const countryViews = {};
          (views || []).forEach(v => {
            const c = v.country || 'Unknown';
            countryViews[c] = (countryViews[c] || 0) + 1;
          });
          setTrafficStats({ totalViews, countryViews });
        } catch (adminErr) {
          console.error("Failed to load admin background data", adminErr);
        } finally {
          setIsAdminLoading(false);
        }
      })();

    } catch (err) {
      console.error("Failed to refresh application data", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    // Record page view analytics with visitor country tracking
    const logPageView = async () => {
      console.log("Traffic Analytics: logPageView initialized.");
      // Prevent double counting within a 10-minute window
      const lastLogged = localStorage.getItem('vs_last_view_logged');
      const now = Date.now();
      if (lastLogged && (now - parseInt(lastLogged)) < 10 * 60 * 1000) {
        console.log("Traffic Analytics: Already logged within the last 10 minutes. Skipping.");
        return;
      }

      let country = 'Unknown';
      
      // 1. Try ipapi.co (HTTPS, free limit 1000/day)
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data && data.country_name) {
            country = data.country_name;
          }
        }
      } catch (e) {
        console.warn("ipapi.co rate limited or blocked, trying fallback 1...", e);
      }

      // 2. Try ipwho.is if country is still unknown (HTTPS, free limit 10000/day)
      if (country === 'Unknown') {
        try {
          const res = await fetch('https://ipwho.is/');
          if (res.ok) {
            const data = await res.json();
            if (data && data.success && data.country) {
              country = data.country;
            }
          }
        } catch (e) {
          console.warn("ipwho.is failed, trying fallback 2...", e);
        }
      }

      // 3. Try db-ip.com if country is still unknown (HTTPS, free self-lookup)
      if (country === 'Unknown') {
        try {
          const res = await fetch('https://api.db-ip.com/v2/free/self');
          if (res.ok) {
            const data = await res.json();
            if (data && data.countryName) {
              country = data.countryName;
            }
          }
        } catch (e) {
          console.warn("db-ip.com lookup failed...", e);
        }
      }

      try {
        console.log("Traffic Analytics: Logging country view to database:", country);
        const newView = await dbService.logTrafficView(country);
        setTrafficViews(prev => [newView, ...prev]);
        localStorage.setItem('vs_last_view_logged', Date.now().toString());
      } catch (err) {
        console.error("Failed to log page view analytics", err);
      }
    };
    logPageView();
  }, []);

  // Form Submissions
  const submitEnquiry = async (enquiry) => {
    // Automatically find and attach product code to enquiry if matching product is found
    if (products && enquiry.product_interested && !enquiry.product_code) {
      const prod = products.find(p => p.name === enquiry.product_interested);
      if (prod && prod.product_code) {
        enquiry.product_code = prod.product_code;
      }
    }
    const newEnq = await dbService.createEnquiry(enquiry);
    setEnquiries(prev => [newEnq, ...prev]);
    return newEnq;
  };

  const updateEnquiryStatus = async (id, status) => {
    const updated = await dbService.updateEnquiryStatus(id, status);
    setEnquiries(prev => prev.map(e => e.id === id ? updated : e));
    return updated;
  };

  const submitDownload = async (lead) => {
    const newDl = await dbService.createDownload(lead);
    setDownloads(prev => [newDl, ...prev]);
    return newDl;
  };

  const deleteEnquiry = async (id) => {
    await dbService.deleteEnquiry(id);
    setEnquiries(prev => prev.filter(e => e.id !== id));
  };

  const deleteDownload = async (id) => {
    await dbService.deleteDownload(id);
    setDownloads(prev => prev.filter(e => e.id !== id));
  };

  const deleteOrder = async (id) => {
    await dbService.deleteOrder(id);
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  // CRUDs
  const saveProduct = async (product) => {
    const saved = await dbService.saveProduct(product);
    setProducts(prev => {
      const exists = prev.some(p => p.id === saved.id);
      if (exists) {
        return prev.map(p => p.id === saved.id ? saved : p);
      } else {
        return [saved, ...prev];
      }
    });
    return saved;
  };

  const deleteProduct = async (id) => {
    await dbService.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const saveCategory = async (category) => {
    const saved = await dbService.saveCategory(category);
    setCategories(prev => {
      const exists = prev.some(c => c.id === saved.id);
      if (exists) {
        return prev.map(c => c.id === saved.id ? saved : c);
      } else {
        return [...prev, saved];
      }
    });
    return saved;
  };

  const deleteCategory = async (id) => {
    await dbService.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
    // Refresh products since cascade deletions or category reset may occur
    const prods = await dbService.getProducts();
    setProducts(prods);
  };

  const saveSubcategory = async (subcategory) => {
    const saved = await dbService.saveSubcategory(subcategory);
    setSubcategories(prev => {
      const exists = prev.some(s => s.id === saved.id);
      if (exists) {
        return prev.map(s => s.id === saved.id ? saved : s);
      } else {
        return [...prev, saved];
      }
    });
    return saved;
  };

  const deleteSubcategory = async (id) => {
    await dbService.deleteSubcategory(id);
    setSubcategories(prev => prev.filter(s => s.id !== id));
  };

  const saveCertificate = async (cert) => {
    const saved = await dbService.saveCertificate(cert);
    setCertificates(prev => {
      const exists = prev.some(c => c.id === saved.id);
      if (exists) {
        return prev.map(c => c.id === saved.id ? saved : c);
      } else {
        return [saved, ...prev];
      }
    });
    return saved;
  };

  const deleteCertificate = async (id) => {
    await dbService.deleteCertificate(id);
    setCertificates(prev => prev.filter(c => c.id !== id));
  };

  const saveBlog = async (blog) => {
    const saved = await dbService.saveBlog(blog);
    setBlogs(prev => {
      const exists = prev.some(b => b.id === saved.id);
      if (exists) {
        return prev.map(b => b.id === saved.id ? saved : b);
      } else {
        return [saved, ...prev];
      }
    });
    return saved;
  };

  const deleteBlog = async (id) => {
    await dbService.deleteBlog(id);
    setBlogs(prev => prev.filter(b => b.id !== id));
  };

  const saveFounder = async (fndrDetails) => {
    const saved = await dbService.saveFounderDetails(fndrDetails);
    setFounder(saved);
    return saved;
  };

  const saveSettings = async (stgDetails) => {
    const saved = await dbService.saveWebsiteSettings(stgDetails);
    setSettings(saved);
    return saved;
  };

  // Auth Operations
  const loginUser = async (email, password) => {
    const savedUsers = localStorage.getItem('vs_registered_users');
    const usersList = savedUsers ? JSON.parse(savedUsers) : [];
    
    const userMatch = usersList.find(u => u.email === email && u.password === password);
    if (userMatch) {
      const { password: _, ...userWithoutPassword } = userMatch;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('vs_current_user', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    throw new Error("Invalid email or password");
  };

  const signupUser = async (userData) => {
    const savedUsers = localStorage.getItem('vs_registered_users');
    const usersList = savedUsers ? JSON.parse(savedUsers) : [];
    
    const exists = usersList.some(u => u.email === userData.email);
    if (exists) {
      throw new Error("An account with this email already exists");
    }

    const newUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      ...userData,
      created_at: new Date().toISOString()
    };

    usersList.push(newUser);
    localStorage.setItem('vs_registered_users', JSON.stringify(usersList));

    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('vs_current_user', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('vs_current_user');
  };

  const updateUserProfile = async (updatedData) => {
    const savedUsers = localStorage.getItem('vs_registered_users');
    const usersList = savedUsers ? JSON.parse(savedUsers) : [];

    const idx = usersList.findIndex(u => u.id === currentUser?.id);
    if (idx !== -1) {
      const updatedUser = {
        ...usersList[idx],
        ...updatedData
      };
      usersList[idx] = updatedUser;
      localStorage.setItem('vs_registered_users', JSON.stringify(usersList));

      const { password: _, ...userWithoutPassword } = updatedUser;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('vs_current_user', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    throw new Error("User profile not found");
  };

  const loginAdmin = async (email, password) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        throw new Error(error.message);
      }
      if (data && data.user) {
        setIsAdminAuthenticated(true);
        sessionStorage.setItem('vs_admin_auth', 'true');
        return true;
      }
    }

    // For local mock / default admin
    if (email === "admin@victasure.com" && password === "admin123") {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('vs_admin_auth', 'true');
      return true;
    }
    throw new Error("Invalid username or password");
  };

  const resetAdminPassword = async (email) => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/admin'
      });
      if (error) {
        throw new Error(error.message);
      }
      return true;
    }
    throw new Error("Supabase is not configured for email resets.");
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('vs_admin_auth');
  };

  // CART OPERATIONS
  const addToCart = (product, quantity) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // ORDER OPERATIONS
  const placeOrder = async (orderData) => {
    const newOrder = await dbService.createOrder(orderData);
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const changeOrderStatus = async (id, status) => {
    const updated = await dbService.updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? updated : o));
    return updated;
  };

  return (
    <AppContext.Provider value={{
      loading,
      isAdminLoading,
      categories,
      subcategories,
      products,
      enquiries,
      downloads,
      certificates,
      blogs,
      founder,
      settings,
      isAdminAuthenticated,
      currentUser,
      orders,
      cart,
      trafficViews,
      trafficStats,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      placeOrder,
      changeOrderStatus,
      submitEnquiry,
      updateEnquiryStatus,
      submitDownload,
      saveProduct,
      deleteProduct,
      saveCategory,
      deleteCategory,
      saveSubcategory,
      deleteSubcategory,
      saveCertificate,
      deleteCertificate,
      saveBlog,
      deleteBlog,
      saveFounder,
      saveSettings,
      loginAdmin,
      resetAdminPassword,
      logoutAdmin,
      loginUser,
      signupUser,
      logoutUser,
      updateUserProfile,
      deleteEnquiry,
      deleteDownload,
      deleteOrder,
      refreshData,
      checkSupabaseSchema: dbService.checkSupabaseSchema,
      seedDatabase: dbService.seedDatabase
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
