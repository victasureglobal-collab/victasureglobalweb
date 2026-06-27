import React, { createContext, useState, useEffect, useContext } from 'react';
import { dbService } from '../services/dbService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
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
    return localStorage.getItem('vs_admin_auth') === 'true';
  });

  // Client/User auth
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('vs_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const refreshData = async () => {
    try {
      setLoading(true);
      const [cats, prods, enqs, dls, certs, blgs, fndr, stgs, ords, views] = await Promise.all([
        dbService.getCategories(),
        dbService.getProducts(),
        dbService.getEnquiries(),
        dbService.getDownloads(),
        dbService.getCertificates(),
        dbService.getBlogs(),
        dbService.getFounderDetails(),
        dbService.getWebsiteSettings(),
        dbService.getOrders(),
        dbService.getTrafficViews(),
      ]);

      setCategories(cats);
      setProducts(prods);
      setEnquiries(enqs);
      setDownloads(dls);
      setCertificates(certs);
      setBlogs(blgs);
      setFounder(fndr);
      setSettings(stgs);
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
    } catch (err) {
      console.error("Failed to refresh application data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    // Record page view analytics with visitor country tracking
    const logPageView = async () => {
      // Check if session view has already been counted to prevent refresh double counting
      const sessionLogged = sessionStorage.getItem('vs_session_view_logged');
      
      if (sessionLogged) {
        return;
      }

      try {
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();
        const country = geoData.country_name || 'Unknown';

        const newView = await dbService.logTrafficView(country);
        setTrafficViews(prev => [newView, ...prev]);
        sessionStorage.setItem('vs_session_view_logged', 'true');
      } catch (err) {
        console.error("Failed to log page view analytics", err);
        try {
          const newView = await dbService.logTrafficView('Unknown');
          setTrafficViews(prev => [newView, ...prev]);
          sessionStorage.setItem('vs_session_view_logged', 'true');
        } catch (e) {}
      }
    };
    logPageView();
  }, []);

  // Form Submissions
  const submitEnquiry = async (enquiry) => {
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
    // For local mock / default admin
    if (email === "admin@victasure.com" && password === "admin123") {
      setIsAdminAuthenticated(true);
      localStorage.setItem('vs_admin_auth', 'true');
      return true;
    }
    throw new Error("Invalid username or password");
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('vs_admin_auth');
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
      categories,
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
      saveCertificate,
      deleteCertificate,
      saveBlog,
      deleteBlog,
      saveFounder,
      saveSettings,
      loginAdmin,
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
