import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Box, FolderTree, FileSpreadsheet, Newspaper, Award, Settings, LogOut, 
  TrendingUp, Download, Mail, Users, Plus, Edit2, Trash2, Check, Eye, EyeOff, Save, CheckCircle,
  ShoppingCart, Database, Upload, Globe, RefreshCw, Menu, X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import logoImg from '../../assets/logo/VictaSure_Final.png';

export default function Dashboard() {
  const {
    products, categories, subcategories, enquiries, downloads, certificates, blogs, founder, settings,
    saveProduct, deleteProduct, saveCategory, deleteCategory, saveSubcategory, deleteSubcategory, updateEnquiryStatus,
    saveCertificate, deleteCertificate, saveBlog, deleteBlog, saveFounder, saveSettings, logoutAdmin,
    orders, changeOrderStatus, checkSupabaseSchema, seedDatabase, refreshData, trafficStats,
    deleteEnquiry, deleteDownload, deleteOrder, trafficViews, loading
  } = useApp();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [catSubTab, setCatSubTab] = useState('categories'); // 'categories' | 'subcategories'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState('7days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Modal / Form States
  const [editingItem, setEditingItem] = useState(null); // holds product/cat/blog/cert being added or edited
  const [itemType, setItemType] = useState(""); // 'product' | 'category' | 'blog' | 'certificate'
  const [successToast, setSuccessToast] = useState("");
  const [schemaStatus, setSchemaStatus] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCheckingSchema, setIsCheckingSchema] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedError, setSeedError] = useState("");
  const [seedResult, setSeedResult] = useState(null);

  const runSchemaCheck = async () => {
    setIsCheckingSchema(true);
    try {
      const res = await checkSupabaseSchema();
      setSchemaStatus(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCheckingSchema(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'database') {
      runSchemaCheck();
    }
  }, [activeTab]);

  const triggerToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3000);
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const filterByDateRange = (list) => {
    if (!list) return [];
    const now = new Date();
    
    if (dateRange === 'custom') {
      if (!customStartDate && !customEndDate) return list;
      const start = customStartDate ? new Date(customStartDate) : null;
      if (start) start.setHours(0,0,0,0);
      const end = customEndDate ? new Date(customEndDate) : null;
      if (end) end.setHours(23,59,59,999);
      
      return list.filter(item => {
        const d = new Date(item.created_at || item.date);
        if (start && d < start) return false;
        if (end && d > end) return false;
        return true;
      });
    }
    
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(todayStart);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return list.filter(item => {
      const d = new Date(item.created_at || item.date);
      if (dateRange === 'today') {
        return d >= todayStart;
      } else if (dateRange === 'yesterday') {
        return d >= yesterdayStart && d < todayStart;
      } else if (dateRange === '7days') {
        return d >= sevenDaysAgo;
      } else if (dateRange === '30days') {
        return d >= thirtyDaysAgo;
      }
      return true;
    });
  };

  // Analytics numbers depending on dateRange filter
  const getAnalyticsData = () => {
    const filteredEnquiries = filterByDateRange(enquiries);
    const filteredDownloads = filterByDateRange(downloads);

    const totalDls = filteredEnquiries.length + filteredDownloads.length;

    // Use actual trafficStats view tracking or fallback if empty
    const visitorsCount = trafficStats?.totalViews || 0;
    const uniqueVis = Math.round(visitorsCount * 0.7);

    // Let's generate actual chartData by days dynamically
    let chartData = [];
    const now = new Date();
    let numDays = 7;
    if (dateRange === '30days') {
      numDays = 30;
    } else if (dateRange === 'today') {
      numDays = 1;
    } else if (dateRange === 'yesterday') {
      numDays = 2; // Show today and yesterday
    } else if (dateRange === 'custom' && customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      const diffTime = Math.abs(end - start);
      numDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    }

    // Go back in time and build daily data points
    const start = new Date();
    if (dateRange === 'custom' && customStartDate) {
      start.setTime(new Date(customStartDate).getTime());
    } else {
      start.setDate(now.getDate() - numDays + 1);
    }

    for (let i = 0; i < numDays; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      
      const dayName = d.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric'
      });
      
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
      
      const dayDls = downloads ? downloads.filter(dl => {
        const date = new Date(dl.created_at || dl.date);
        return date >= dayStart && date <= dayEnd;
      }).length : 0;
      
      const dayEnqs = enquiries ? enquiries.filter(en => {
        const date = new Date(en.created_at || en.date);
        return date >= dayStart && date <= dayEnd;
      }).length : 0;

      let dayViews = trafficViews ? trafficViews.filter(v => {
        const date = new Date(v.created_at);
        return date >= dayStart && date <= dayEnd;
      }).length : 0;

      // Fallback: if no views are recorded in the database, show a baseline of at least 1 view, 
      // or more if there are downloads/enquiries on that day.
      if (!trafficViews || trafficViews.length === 0) {
        dayViews = Math.max(1, dayDls + dayEnqs);
      }

      chartData.push({
        name: dayName,
        Visitors: dayViews,
        Downloads: dayDls + dayEnqs
      });
    }

    const totalChartViews = chartData.reduce((sum, item) => sum + item.Visitors, 0);
    const finalVisitors = trafficViews && trafficViews.length > 0 ? visitorsCount : totalChartViews;
    const finalUnique = Math.round(finalVisitors * 0.7);

    // Compute country geolocations distribution dynamically
    let countryViews = {};
    if (trafficViews && trafficViews.length > 0) {
      trafficViews.forEach(v => {
        const c = v.country || 'Unknown';
        countryViews[c] = (countryViews[c] || 0) + 1;
      });
    } else {
      // Fallback: Aggregate countries from enquiries and downloads in the database
      if (enquiries) {
        enquiries.forEach(e => {
          if (e.country) countryViews[e.country] = (countryViews[e.country] || 0) + 1;
        });
      }
      if (downloads) {
        downloads.forEach(d => {
          if (d.country) countryViews[d.country] = (countryViews[d.country] || 0) + 1;
        });
      }
      // Guarantee at least one entry so the table is never blank
      if (Object.keys(countryViews).length === 0) {
        countryViews['India'] = 1;
      }
    }

    return {
      totalVisitors: finalVisitors,
      uniqueVisitors: finalUnique,
      conversionRate: finalVisitors > 0 ? ((totalDls / finalVisitors) * 100).toFixed(1) + "%" : "0.0%",
      catalogueDownloads: totalDls,
      countryViews,
      chartData
    };
  };

  const stats = getAnalyticsData();

  const totalRevenueINR = orders ? orders.reduce((sum, ord) => ord.status !== 'cancelled' ? sum + ord.total_inr : sum, 0) : 0;
  const totalRevenueUSD = orders ? orders.reduce((sum, ord) => ord.status !== 'cancelled' ? sum + ord.total_usd : sum, 0) : 0;
  const pendingOrdersCount = orders ? orders.filter(ord => ord.status === 'pending').length : 0;

  // --- RENDERING TABS ---

  // 1. ANALYTICS VIEW
  const renderAnalytics = () => (
    <div className="space-y-6">
      
      {/* Date Range Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-neutral-border p-4 rounded-large shadow-sm gap-4">
        <h2 className="text-sm font-bold text-primary">Overview Metrics</h2>
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Filters */}
          <div className="flex space-x-1.5">
            {['today', 'yesterday', '7days', '30days'].map((range) => (
              <button
                key={range}
                onClick={() => {
                  setDateRange(range);
                  setCustomStartDate('');
                  setCustomEndDate('');
                }}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-large border transition-all cursor-pointer ${
                  dateRange === range 
                    ? 'bg-secondary border-secondary text-white shadow-sm' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range === '7days' ? 'Last 7 Days' : range === '30days' ? 'Last 30 Days' : range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>

          {/* Custom Date Inputs */}
          <div className="flex items-center space-x-2 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-3 border-gray-200 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Custom range:</span>
            <div className="flex items-center space-x-1.5">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => {
                  setCustomStartDate(e.target.value);
                  setDateRange('custom');
                }}
                className="text-[11px] px-2 py-1 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary bg-white text-gray-700"
              />
              <span className="text-gray-400 text-xs font-medium">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => {
                  setCustomEndDate(e.target.value);
                  setDateRange('custom');
                }}
                className="text-[11px] px-2 py-1 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary bg-white text-gray-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white border border-neutral-border p-5 rounded-large shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-primary"></div>
          <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider block">Total Visitors</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-xl font-bold text-primary">{stats.totalVisitors}</span>
            <span className="text-[10px] text-secondary font-bold flex items-center">
              <TrendingUp size={10} className="mr-0.5" /> +12.4%
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-border p-5 rounded-large shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-accent"></div>
          <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider block">Unique Visitors</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-xl font-bold text-primary">{stats.uniqueVisitors}</span>
            <span className="text-[10px] text-secondary font-bold flex items-center">
              <TrendingUp size={10} className="mr-0.5" /> +8.1%
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-border p-5 rounded-large shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-secondary"></div>
          <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider block">Lead Conversion</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-xl font-bold text-primary">{stats.conversionRate}</span>
            <span className="text-[10px] text-secondary font-bold">Standard Bench</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-border p-5 rounded-large shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-primary-light"></div>
          <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider block">Total B2B Orders</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-xl font-bold text-primary">{orders ? orders.length : 0}</span>
            <span className="text-[10px] text-yellow-600 font-bold">{pendingOrdersCount} Pending</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-border p-5 rounded-large shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-[#C89B3C]"></div>
          <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider block">Export Sales Revenue</span>
          <div className="flex flex-col mt-1.5 leading-none">
            <span className="text-sm font-extrabold text-primary">₹{totalRevenueINR.toLocaleString()}</span>
            <span className="text-[9px] font-bold text-gray-400 mt-1">${totalRevenueUSD.toLocaleString()} USD</span>
          </div>
        </div>

      </div>

      {/* Chart Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Visitors Chart */}
        <div className="bg-white border border-neutral-border p-6 rounded-xlarge shadow-premium space-y-4">
          <h3 className="font-bold text-sm text-primary">Daily Traffic Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D2C54" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0D2C54" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="Visitors" stroke="#0D2C54" fillOpacity={1} fill="url(#colorVis)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Conversion Chart */}
        <div className="bg-white border border-neutral-border p-6 rounded-xlarge shadow-premium space-y-4">
          <h3 className="font-bold text-sm text-primary">Lead Generation vs Catalogue Downloads</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Downloads" fill="#2E7D32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid of Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Table mock */}
        <div className="bg-white border border-neutral-border rounded-xlarge overflow-hidden shadow-premium">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-sm text-primary">Top Performing Product Catalogues</h3>
          </div>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100 text-gray-500 font-bold border-b border-gray-200">
                <th className="p-4">Product Name</th>
                <th className="p-4">FOB Pricing Inquiries</th>
                <th className="p-4">Downloads Logged</th>
                <th className="p-4">Active Export Regions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-600">
              {products.slice(0, 4).map((p, idx) => (
                <tr key={p.id}>
                  <td className="p-4 font-bold text-primary">{p.name}</td>
                  <td className="p-4">{15 + idx * 8} Enquiries</td>
                  <td className="p-4">{35 + idx * 12} times</td>
                  <td className="p-4 font-semibold text-accent-dark">{p.country_availability?.slice(0,3).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Live Visitor Geolocations */}
        <div className="bg-white border border-neutral-border rounded-xlarge overflow-hidden shadow-premium">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-sm text-primary">Live Visitor Geolocations</h3>
          </div>
          <div className="overflow-y-auto max-h-[220px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 text-gray-500 font-bold border-b border-gray-200">
                  <th className="p-4">Country / Region</th>
                  <th className="p-4 text-right">View Count</th>
                  <th className="p-4 text-right">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-600">
                {!stats.countryViews || Object.entries(stats.countryViews).length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-400">No visitor logs recorded yet.</td>
                  </tr>
                ) : (
                  Object.entries(stats.countryViews).map(([country, count]) => {
                    const pct = stats.totalVisitors ? ((count / stats.totalVisitors) * 100).toFixed(1) : 0;
                    return (
                      <tr key={country}>
                        <td className="p-4 font-bold text-primary">{country}</td>
                        <td className="p-4 text-right font-semibold">{count}</td>
                        <td className="p-4 text-right text-secondary font-bold">{pct}%</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );

  // 2. PRODUCTS CRUD VIEW
  const renderProducts = () => {
    const handleEditProductClick = (prod) => {
      setItemType("product");
      setEditingItem(prod || {
        name: "", category_id: "", subcategory_id: "", short_description: "", detailed_description: "",
        dimensions: "", material: "", moq: "", price_inr: 0, price_usd: 0, country_availability: ["USA", "Germany"], status: "published",
        is_featured: false, images: ["https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&q=80&w=800"], specifications: {},
        product_code: "", show_price: true
      });
    };

    const handleSaveProduct = async (e) => {
      e.preventDefault();
      // Ensure country availability is array if user edited as text
      if (typeof editingItem.country_availability === "string") {
        editingItem.country_availability = editingItem.country_availability.split(",").map(c => c.trim());
      }
      await saveProduct(editingItem);
      setEditingItem(null);
      triggerToast("Product details saved successfully.");
    };

    return (
      <div className="space-y-6">
        
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-primary">Manage Export Products</h2>
          <button
            onClick={() => handleEditProductClick(null)}
            className="flex items-center space-x-1.5 bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-2 px-4 rounded-large transition-colors shadow"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Products Table list */}
        <div className="bg-white border border-neutral-border rounded-xlarge overflow-hidden shadow-premium">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                <th className="p-4">Thumbnail</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">MOQ</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-600">
              {products.map((p) => {
                const catName = categories.find(c => c.id === p.category_id)?.name || "Uncategorized";
                return (
                  <tr key={p.id}>
                    <td className="p-4">
                      <img src={p.images?.[0]} alt="" className="w-12 h-8 object-cover rounded border" />
                    </td>
                    <td className="p-4 font-bold text-primary">{p.name}</td>
                    <td className="p-4 space-y-1">
                      <span className="font-semibold block">{catName}</span>
                      {p.subcategory_id && (
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                          {subcategories?.find(s => s.id === p.subcategory_id)?.name || "N/A"}
                        </span>
                      )}
                    </td>
                    <td className="p-4">{p.moq}</td>
                    <td className="p-4">
                      {p.is_featured ? (
                        <span className="text-secondary font-bold">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center space-x-3 mt-1">
                      <button
                        onClick={() => handleEditProductClick(p)}
                        className="text-primary hover:text-accent"
                        title="Edit product"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => { if(confirm("Delete product?")) deleteProduct(p.id); }}
                        className="text-red-500 hover:text-red-700"
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal for Add / Edit Product */}
        {editingItem && itemType === "product" && (
          <div className="fixed inset-0 bg-primary/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xlarge max-w-2xl w-full border border-neutral-border max-h-[90vh] overflow-y-auto custom-scrollbar shadow-premium">
              <form onSubmit={handleSaveProduct} className="p-6 sm:p-8 space-y-4">
                <h3 className="font-sans font-bold text-lg text-primary border-b pb-2">
                  {editingItem.id ? "Edit Product Details" : "Add New Product"}
                </h3>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.name || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Product Code (e.g. VS-101) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. VS-101"
                      value={editingItem.product_code || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, product_code: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                    <select
                      required
                      value={editingItem.category_id || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, category_id: e.target.value, subcategory_id: "" })}
                      className="w-full text-xs px-3 py-2 bg-white rounded border focus:outline-none focus:ring-1"
                    >
                      <option value="">Select Category...</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Subcategory *</label>
                    <select
                      required
                      value={editingItem.subcategory_id || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, subcategory_id: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-white rounded border focus:outline-none focus:ring-1"
                    >
                      <option value="">Select Subcategory...</option>
                      {(subcategories || [])
                        .filter(s => s.category_id === editingItem.category_id)
                        .map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Short Description</label>
                  <input
                    type="text"
                    required
                    value={editingItem.short_description}
                    onChange={(e) => setEditingItem({ ...editingItem, short_description: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded border focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Detailed Description</label>
                  <textarea
                    rows="3"
                    value={editingItem.detailed_description}
                    onChange={(e) => setEditingItem({ ...editingItem, detailed_description: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded border focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Dimensions (e.g. 10x10 inches)</label>
                    <input
                      type="text"
                      value={editingItem.dimensions}
                      onChange={(e) => setEditingItem({ ...editingItem, dimensions: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded border"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Material (e.g. Areca Palm Leaf)</label>
                    <input
                      type="text"
                      value={editingItem.material}
                      onChange={(e) => setEditingItem({ ...editingItem, material: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Minimum Order Qty (MOQ)</label>
                    <input
                      type="text"
                      value={editingItem.moq}
                      onChange={(e) => setEditingItem({ ...editingItem, moq: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded border"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity Unit</label>
                    <select
                      value={editingItem.qty_unit || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, qty_unit: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded border bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select Unit (None)</option>
                      <option value="Pieces">Pieces</option>
                      <option value="KGs">KGs</option>
                      <option value="MT">MT</option>
                      <option value="Cartons">Cartons</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">Product Images (Upload up to 10 images - click '+' to add)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 border p-3 rounded bg-gray-50">
                    {(editingItem.images || []).map((img, idx) => (
                      <div key={idx} className="relative aspect-[4/3] border rounded overflow-hidden bg-white shadow-sm group">
                        <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedImages = (editingItem.images || []).filter((_, i) => i !== idx);
                            setEditingItem({ ...editingItem, images: updatedImages });
                          }}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md transition-colors font-bold"
                          title="Remove image"
                        >
                          ×
                        </button>
                        <span className="absolute bottom-1 left-1 bg-primary/75 text-white text-[8px] px-1.5 py-0.5 rounded font-extrabold font-sans">
                          {idx === 0 ? 'Primary' : `#${idx + 1}`}
                        </span>
                      </div>
                    ))}

                    {(!editingItem.images || editingItem.images.length < 10) && (
                      <div className="aspect-[4/3] border border-dashed rounded bg-white hover:bg-gray-100 transition-colors flex items-center justify-center">
                        <ImageUploader
                          label=""
                          value=""
                          onChange={(val) => {
                            if (val) {
                              const currentImages = editingItem.images || [];
                              setEditingItem({ ...editingItem, images: [...currentImages, val] });
                            }
                          }}
                          aspect="4:3"
                          isCompact={true}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Product Video URL (YouTube, MP4 link, etc.)</label>
                  <input
                    type="url"
                    placeholder="e.g. https://www.youtube.com/watch?v=... or direct MP4 video link"
                    value={editingItem.video_url || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, video_url: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Price (INR - ₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="any"
                      placeholder="e.g. 400"
                      value={editingItem.price_inr !== undefined ? editingItem.price_inr : ""}
                      onChange={(e) => {
                        const valStr = e.target.value;
                        if (valStr === "") {
                          setEditingItem({
                            ...editingItem,
                            price_inr: "",
                            price_usd: ""
                          });
                        } else {
                          const val = parseFloat(valStr) || 0;
                          const usdVal = parseFloat((val / 83).toFixed(2)) || 0;
                          setEditingItem({
                            ...editingItem,
                            price_inr: valStr,
                            price_usd: usdVal
                          });
                        }
                      }}
                      className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Price (USD - $)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="any"
                      placeholder="e.g. 5"
                      value={editingItem.price_usd !== undefined ? editingItem.price_usd : ""}
                      onChange={(e) => {
                        const valStr = e.target.value;
                        if (valStr === "") {
                          setEditingItem({
                            ...editingItem,
                            price_usd: "",
                            price_inr: ""
                          });
                        } else {
                          const val = parseFloat(valStr) || 0;
                          const inrVal = parseFloat((val * 83).toFixed(2)) || 0;
                          setEditingItem({
                            ...editingItem,
                            price_usd: valStr,
                            price_inr: inrVal
                          });
                        }
                      }}
                      className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Country Availability (Comma separated list)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingItem.country_availability) ? editingItem.country_availability.join(", ") : editingItem.country_availability}
                    onChange={(e) => setEditingItem({ ...editingItem, country_availability: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded border"
                  />
                </div>
                <div className="flex items-center space-x-6 border-t pt-4">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.is_featured}
                      onChange={(e) => setEditingItem({ ...editingItem, is_featured: e.target.checked })}
                      className="rounded text-primary focus:ring-0"
                    />
                    <span>Featured Product (Display on Home page)</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.show_price !== false}
                      onChange={(e) => setEditingItem({ ...editingItem, show_price: e.target.checked })}
                      className="rounded text-primary focus:ring-0"
                    />
                    <span>Show Price on Website</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700">
                    <select
                      value={editingItem.status}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                      className="text-xs rounded border py-1 px-2"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                    <span>Status</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 border text-xs font-bold rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded hover:bg-secondary-light"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  };

  // 3. CATEGORIES & SUBCATEGORIES CRUD VIEW
  const renderCategories = () => {
    const handleEditCategory = (cat) => {
      setItemType("category");
      setEditingItem(cat || { name: "", slug: "", description: "", is_visible: true });
    };

    const handleSaveCategory = async (e) => {
      e.preventDefault();
      // Generate slug if empty
      if (!editingItem.slug) {
        editingItem.slug = editingItem.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      await saveCategory(editingItem);
      setEditingItem(null);
      triggerToast("Category configurations saved.");
    };

    const handleEditSubcategory = (sub) => {
      setItemType("subcategory");
      setEditingItem(sub || { name: "", slug: "", category_id: "" });
    };

    const handleSaveSubcategory = async (e) => {
      e.preventDefault();
      if (!editingItem.category_id) {
        alert("Please select a parent category.");
        return;
      }
      if (!editingItem.slug) {
        editingItem.slug = editingItem.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      await saveSubcategory(editingItem);
      setEditingItem(null);
      triggerToast("Subcategory saved successfully.");
    };

    return (
      <div className="space-y-6">
        
        {/* Sub-tab navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => { setCatSubTab('categories'); setEditingItem(null); }}
            className={`py-2.5 px-6 font-bold text-xs border-b-2 transition-all ${
              catSubTab === 'categories'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-gray-400 hover:text-primary'
            }`}
          >
            Main Categories
          </button>
          <button
            onClick={() => { setCatSubTab('subcategories'); setEditingItem(null); }}
            className={`py-2.5 px-6 font-bold text-xs border-b-2 transition-all ${
              catSubTab === 'subcategories'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-gray-400 hover:text-primary'
            }`}
          >
            Subcategories Management
          </button>
        </div>

        {catSubTab === 'categories' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-primary">Product Categories</h2>
              <button
                onClick={() => handleEditCategory(null)}
                className="flex items-center space-x-1.5 bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-2 px-4 rounded-large transition-colors shadow"
              >
                <Plus size={16} />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white border border-neutral-border rounded-xlarge overflow-hidden shadow-premium">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                      <th className="p-4">Category Name</th>
                      <th className="p-4">Slug</th>
                      <th className="p-4">Visibility</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-600">
                    {categories.map((c) => (
                      <tr key={c.id}>
                        <td className="p-4 font-bold text-primary">{c.name}</td>
                        <td className="p-4"><code>{c.slug}</code></td>
                        <td className="p-4">
                          {c.is_visible !== false ? (
                            <span className="text-green-600 font-bold">Visible</span>
                          ) : (
                            <span className="text-gray-400 font-semibold">Hidden</span>
                          )}
                        </td>
                        <td className="p-4 flex items-center space-x-3">
                          <button onClick={() => handleEditCategory(c)} className="text-primary hover:text-accent">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => { if(confirm("Delete category? This will unlink products in it.")) deleteCategory(c.id); }} className="text-red-500 hover:text-red-700">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {editingItem && itemType === "category" ? (
                <div className="bg-white border border-neutral-border p-6 rounded-xlarge shadow-premium h-fit">
                  <form onSubmit={handleSaveCategory} className="space-y-4">
                    <h3 className="font-bold text-sm text-primary border-b pb-2">
                      {editingItem.id ? "Edit Category Details" : "Create Category"}
                    </h3>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Category Name</label>
                      <input
                        type="text"
                        required
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded border focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Slug (leave empty for auto)</label>
                      <input
                        type="text"
                        placeholder="areca-leaf-plates"
                        value={editingItem.slug}
                        onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded border focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                      <textarea
                        rows="2"
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded border focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="checkbox"
                        id="is_visible"
                        checked={editingItem.is_visible !== false}
                        onChange={(e) => setEditingItem({ ...editingItem, is_visible: e.target.checked })}
                        className="rounded text-primary focus:ring-0"
                      />
                      <label htmlFor="is_visible" className="text-xs font-semibold text-gray-700">Display Category publicly on site</label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 border text-xs font-bold rounded">
                        Cancel
                      </button>
                      <button type="submit" className="px-3 py-1.5 bg-secondary text-white text-xs font-bold rounded">
                        Save Category
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-gray-50 border border-dashed rounded-xlarge p-8 text-center flex flex-col justify-center text-gray-400">
                  <FolderTree size={36} className="mx-auto text-gray-300 mb-2" />
                  <span className="text-xs font-semibold">Select edit icon or create category to start editing parameters.</span>
                </div>
              )}

            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-primary">Subcategories Management</h2>
              <button
                onClick={() => handleEditSubcategory(null)}
                className="flex items-center space-x-1.5 bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-2 px-4 rounded-large transition-colors shadow"
              >
                <Plus size={16} />
                <span>Add Subcategory</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white border border-neutral-border rounded-xlarge overflow-hidden shadow-premium">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                      <th className="p-4">Subcategory Name</th>
                      <th className="p-4">Parent Category</th>
                      <th className="p-4">Slug</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-600">
                    {(subcategories || []).map((s) => {
                      const parentCat = categories.find(c => c.id === s.category_id);
                      return (
                        <tr key={s.id}>
                          <td className="p-4 font-bold text-primary">{s.name}</td>
                          <td className="p-4">
                            <span className="bg-primary/5 text-primary text-[10px] font-bold px-2 py-0.5 rounded border border-primary/10">
                              {parentCat ? parentCat.name : 'Unlinked Category'}
                            </span>
                          </td>
                          <td className="p-4"><code>{s.slug}</code></td>
                          <td className="p-4 flex items-center space-x-3">
                            <button onClick={() => handleEditSubcategory(s)} className="text-primary hover:text-accent">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => { if(confirm("Delete subcategory?")) deleteSubcategory(s.id); }} className="text-red-500 hover:text-red-700">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {(!subcategories || subcategories.length === 0) && (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-gray-400 font-semibold italic">
                          No subcategories created yet. Click Add Subcategory.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {editingItem && itemType === "subcategory" ? (
                <div className="bg-white border border-neutral-border p-6 rounded-xlarge shadow-premium h-fit">
                  <form onSubmit={handleSaveSubcategory} className="space-y-4">
                    <h3 className="font-bold text-sm text-primary border-b pb-2">
                      {editingItem.id ? "Edit Subcategory Details" : "Create Subcategory"}
                    </h3>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Subcategory Name</label>
                      <input
                        type="text"
                        required
                        value={editingItem.name || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded border focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Parent Category (Mandatory) *</label>
                      <select
                        required
                        value={editingItem.category_id || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, category_id: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded border bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Select Category...</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Slug (leave empty for auto)</label>
                      <input
                        type="text"
                        placeholder="e.g. square-plates"
                        value={editingItem.slug || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded border focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 border text-xs font-bold rounded">
                        Cancel
                      </button>
                      <button type="submit" className="px-3 py-1.5 bg-secondary text-white text-xs font-bold rounded">
                        Save Subcategory
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-gray-50 border border-dashed rounded-xlarge p-8 text-center flex flex-col justify-center text-gray-400">
                  <FolderTree size={36} className="mx-auto text-gray-300 mb-2" />
                  <span className="text-xs font-semibold">Select edit icon or create subcategory to start editing parameters.</span>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    );
  };

  // 4. LEADS / ENQUIRIES & DOWNLOADS TABLE VIEW
  const renderLeads = () => {
    const handleStatusChange = async (enqId, status) => {
      await updateEnquiryStatus(enqId, status);
      triggerToast("Enquiry follow-up status updated.");
    };

    const formatDateAndDay = (dateStr) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;
      const dayOptions = { weekday: 'long' };
      const weekdayStr = d.toLocaleDateString(undefined, dayOptions);
      return `${day}/${month}/${year} ${timeStr} (${weekdayStr})`;
    };

    return (
      <div className="space-y-8 font-sans">
        
        {/* Enquiries block */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-primary flex items-center space-x-1.5">
            <Mail size={18} className="text-accent" />
            <span>Product Inquiries Received (User List)</span>
          </h2>

          <div className="bg-white border border-neutral-border rounded-xlarge overflow-hidden shadow-premium">
            <table className="w-full text-left border-collapse text-[11px] sm:text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone Number</th>
                  <th className="p-3">Address / Details</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Date & Day</th>
                  <th className="p-3">Product & Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-600">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-primary">{enq.name}</td>
                    <td className="p-3 font-medium text-gray-700">{enq.email}</td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-600">{enq.phone}</span>
                        {enq.phone && (
                          <a
                            href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${enq.name}, we received your enquiry about "${enq.product_interested}" on Victa Sure Global. We would love to discuss this further with you!`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-0.5 transition-all flex items-center justify-center"
                            title="Chat on WhatsApp"
                          >
                            <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.135-1.348a9.957 9.957 0 0 0 4.877 1.28h.005c5.505 0 9.989-4.478 9.99-9.985A9.98 9.98 0 0 0 12.012 2zm5.72 14.12c-.244.688-1.22 1.25-1.68 1.314-.46.064-.9.23-2.92-.574-2.023-.805-3.327-2.855-3.428-2.99-.102-.134-.817-1.086-.817-2.072 0-.986.516-1.472.7-1.674.184-.202.402-.252.536-.252.135 0 .27 0 .387.006.122.006.286-.046.446.337.165.39.566 1.378.615 1.478.05.1.084.216.017.35-.067.135-.1.218-.2.336-.1.118-.21.264-.3.354-.1.1-.2.208-.084.402.118.196.52.854 1.116 1.385.768.683 1.414.894 1.616.994.2.1.32.084.437-.05.118-.135.516-.6.655-.807.135-.2.27-.168.454-.1.184.067 1.173.553 1.374.654.202.1.337.15.387.236.05.084.05.49-.193 1.178z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-3 max-w-xs">
                      <div className="font-semibold text-gray-700">{enq.state || 'N/A'} {enq.pincode ? `(${enq.pincode})` : ''}</div>
                      <div className="text-[10px] text-gray-400 truncate hover:text-clip" title={enq.message}>{enq.message}</div>
                    </td>
                    <td className="p-3 font-semibold text-accent-dark">{enq.country}</td>
                    <td className="p-3 text-[10px] font-bold text-gray-500">
                      {formatDateAndDay(enq.created_at)}
                    </td>
                    <td className="p-3 space-y-1">
                      <span className="block font-semibold text-secondary-dark leading-tight">{enq.product_interested}</span>
                      {enq.quantity && (
                        <span className="block font-bold text-accent-dark text-[10px] mt-0.5">Qty: {enq.quantity} {products?.find(p => p.name === enq.product_interested)?.qty_unit || ""}</span>
                      )}
                      {enq.product_code && (
                        <span className="inline-block bg-primary/10 text-primary font-sans font-extrabold text-[9px] uppercase px-1.5 py-0.5 rounded mt-0.5">Code: {enq.product_code}</span>
                      )}
                      <div className="flex items-center space-x-2">
                        <select
                          value={enq.status}
                          onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                          className={`text-[10px] font-bold rounded border py-0.5 px-1 bg-white focus:outline-none ${
                            enq.status === 'new' ? 'text-blue-600 font-extrabold border-blue-400' :
                            enq.status === 'contacted' ? 'text-yellow-600 border-yellow-400' :
                            enq.status === 'qualified' ? 'text-indigo-600 border-indigo-400' :
                            enq.status === 'converted' ? 'text-green-600 border-green-400' : 'text-gray-500'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button
                          onClick={async () => {
                            if (confirm(`Are you sure you want to delete this enquiry from ${enq.name}?`)) {
                              await deleteEnquiry(enq.id);
                              triggerToast("Enquiry deleted.");
                            }
                          }}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-all cursor-pointer"
                          title="Delete Enquiry"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Catalogue Downloads block */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-primary flex items-center space-x-1.5">
            <Download size={18} className="text-secondary" />
            <span>Catalogue Downloads Captured (User List)</span>
          </h2>

          <div className="bg-white border border-neutral-border rounded-xlarge overflow-hidden shadow-premium">
            <table className="w-full text-left border-collapse text-[11px] sm:text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone Number</th>
                  <th className="p-3">Address / State</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Date & Day</th>
                  <th className="p-3">Product Interest</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-600">
                {downloads.map((dl) => (
                  <tr key={dl.id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-primary">{dl.name}</td>
                    <td className="p-3 font-medium text-gray-700">{dl.email}</td>
                    <td className="p-3 font-semibold text-gray-600">{dl.phone}</td>
                    <td className="p-3 font-medium text-gray-500">{dl.state || 'N/A'}</td>
                    <td className="p-3 font-semibold text-accent-dark">{dl.country}</td>
                    <td className="p-3 text-[10px] font-bold text-gray-500">{formatDateAndDay(dl.created_at)}</td>
                    <td className="p-3 font-bold text-secondary-dark">{dl.product_interest}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete this download log for ${dl.name}?`)) {
                            await deleteDownload(dl.id);
                            triggerToast("Download log deleted.");
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-all cursor-pointer inline-flex items-center"
                        title="Delete Download Log"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  };

  // 4.5 ORDERS VIEW
  const renderOrders = () => {
    const handleOrderStatus = async (orderId, status) => {
      await changeOrderStatus(orderId, status);
      triggerToast("Order fulfillment status updated.");
    };

    const handleReload = async () => {
      setIsRefreshing(true);
      await refreshData();
      setTimeout(() => {
        setIsRefreshing(false);
        triggerToast("Live order records updated.");
      }, 600);
    };

    const showOrdersLoading = loading || isRefreshing;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-primary flex items-center space-x-1.5">
            <ShoppingCart size={18} className="text-accent" />
            <span>Customer Purchase Orders</span>
          </h2>
          <button
            onClick={handleReload}
            disabled={showOrdersLoading}
            className="flex items-center space-x-1.5 bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-2 px-4 rounded-large transition-all shadow disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={14} className={showOrdersLoading ? "animate-spin" : ""} />
            <span>{showOrdersLoading ? "Loading..." : "Reload Desk"}</span>
          </button>
        </div>

        <div className="bg-white border border-neutral-border rounded-xlarge overflow-hidden shadow-premium">
          <table className="w-full text-left border-collapse text-[11px] sm:text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                <th className="p-3">Order Ref</th>
                <th className="p-3">Client & Company</th>
                <th className="p-3">Port / Destination</th>
                <th className="p-3">Items Purchased</th>
                <th className="p-3">Order Total</th>
                <th className="p-3">Fulfillment Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-600">
              {showOrdersLoading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center">
                    <div className="flex flex-col justify-center items-center space-y-3 text-gray-400">
                      <RefreshCw className="animate-spin text-accent" size={28} />
                      <span className="text-xs font-semibold">Auto-loading live purchase orders...</span>
                    </div>
                  </td>
                </tr>
              ) : orders && orders.length > 0 ? (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <span className="font-bold text-primary block">#{ord.id}</span>
                      <span className="text-[10px] text-gray-400">{(() => {
                        const d = new Date(ord.created_at);
                        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                      })()}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-primary block">{ord.customer_name}</span>
                      <span className="text-gray-400 block">{ord.company_name}</span>
                      <span className="text-[10px] text-gray-400 block">{ord.email}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] block font-medium">{ord.phone}</span>
                        {ord.phone && (
                          <a
                            href={`https://wa.me/${String(ord.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${ord.customer_name}, we received your order #${ord.id} on Victa Sure Global. We would like to confirm your delivery to port ${ord.delivery_port}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-0.5 transition-all flex items-center justify-center"
                            title="Chat on WhatsApp"
                          >
                            <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.135-1.348a9.957 9.957 0 0 0 4.877 1.28h.005c5.505 0 9.989-4.478 9.99-9.985A9.98 9.98 0 0 0 12.012 2zm5.72 14.12c-.244.688-1.22 1.25-1.68 1.314-.46.064-.9.23-2.92-.574-2.023-.805-3.327-2.855-3.428-2.99-.102-.134-.817-1.086-.817-2.072 0-.986.516-1.472.7-1.674.184-.202.402-.252.536-.252.135 0 .27 0 .387.006.122.006.286-.046.446.337.165.39.566 1.378.615 1.478.05.1.084.216.017.35-.067.135-.1.218-.2.336-.1.118-.2.264-.3.354-.1.1-.2.208-.084.402.118.196.52.854 1.116 1.385.768.683 1.414.894 1.616.994.2.1.32.084.437-.05.118-.135.516-.6.655-.807.135-.2.27-.168.454-.1.184.067 1.173.553 1.374.654.202.1.337.15.387.236.05.084.05.49-.193 1.178z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-secondary-dark block">{ord.delivery_port}</span>
                      <span className="text-[10px] text-gray-400 block max-w-xs truncate">{ord.address}, {ord.country}</span>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1 max-w-xs">
                        {ord.items && ord.items.map((item, idx) => (
                          <div key={idx} className="text-[10px] leading-tight">
                            • <span className="font-semibold text-primary">{item.product_name}</span> (Qty: {item.quantity})
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-extrabold text-accent block">₹{Number(ord.total_inr || 0).toLocaleString()}</span>
                      <span className="text-[10px] font-bold text-gray-400 block">${Number(ord.total_usd || 0).toLocaleString()}</span>
                    </td>
                    <td className="p-3">
                      <select
                        value={ord.status}
                        onChange={(e) => handleOrderStatus(ord.id, e.target.value)}
                        className={`text-[10px] font-bold rounded border py-1 px-1 bg-white focus:outline-none ${
                          ord.status === 'pending' ? 'text-blue-600 border-blue-400' :
                          ord.status === 'confirmed' ? 'text-indigo-600 border-indigo-400' :
                          ord.status === 'processing' ? 'text-yellow-600 border-yellow-400' :
                          ord.status === 'dispatched' ? 'text-orange-600 border-orange-400' :
                          ord.status === 'delivered' ? 'text-green-600 border-green-400' : 'text-red-500 border-red-400'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete order #${ord.id}?`)) {
                            await deleteOrder(ord.id);
                            triggerToast("Order deleted.");
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded transition-all cursor-pointer inline-flex items-center"
                        title="Delete Order"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400 italic font-semibold">
                    No purchase orders received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 5. BLOGS CRUD VIEW
  const renderBlogs = () => {
    const handleEditBlog = (blog) => {
      setItemType("blog");
      setEditingItem(blog || { title: "", content: "", featured_image: "", seo_title: "", seo_description: "", status: "published" });
    };

    const handleSaveBlog = async (e) => {
      e.preventDefault();
      // Auto-generate slug from title if empty
      if (!editingItem.slug) {
        editingItem.slug = editingItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      await saveBlog(editingItem);
      setEditingItem(null);
      triggerToast("Trade article saved successfully.");
    };

    return (
      <div className="space-y-6">
        
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-primary">Manage Trade Blogs</h2>
          <button
            onClick={() => handleEditBlog(null)}
            className="flex items-center space-x-1.5 bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-2 px-4 rounded-large transition-colors shadow"
          >
            <Plus size={16} />
            <span>Write New Article</span>
          </button>
        </div>

        <div className="bg-white border border-neutral-border rounded-xlarge overflow-hidden shadow-premium">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                <th className="p-4">Image</th>
                <th className="p-4">Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-600">
              {blogs.map((b) => (
                <tr key={b.id}>
                  <td className="p-4">
                    <img src={b.featured_image} alt="" className="w-12 h-8 object-cover rounded border" />
                  </td>
                  <td className="p-4 font-bold text-primary max-w-xs truncate" title={b.title}>{b.title}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 flex items-center space-x-3 mt-1">
                    <button onClick={() => handleEditBlog(b)} className="text-primary hover:text-accent">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => { if(confirm("Delete article?")) deleteBlog(b.id); }} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400 font-semibold italic">
                    No articles drafted yet. Click Write New Article to create.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal for Add / Edit Blog Post */}
        {editingItem && itemType === "blog" && (
          <div className="fixed inset-0 bg-primary/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xlarge max-w-2xl w-full border border-neutral-border max-h-[90vh] overflow-y-auto custom-scrollbar shadow-premium">
              <form onSubmit={handleSaveBlog} className="p-6 sm:p-8 space-y-4">
                <h3 className="font-sans font-bold text-lg text-primary border-b pb-2">
                  {editingItem.id ? "Edit Blog Details" : "Write New Article"}
                </h3>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. The Rising Global Demand for Areca Leaf Dinnerware"
                  />
                </div>

                <div>
                  <ImageUploader
                    label="Featured Image"
                    value={editingItem.featured_image || ""}
                    onChange={(val) => setEditingItem({ ...editingItem, featured_image: val })}
                    aspect="16:9"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Article Content (HTML supported)</label>
                  <textarea
                    rows="6"
                    required
                    value={editingItem.content}
                    onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Write your article content here..."
                  />
                </div>

                <div className="border-t pt-3 space-y-3">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">SEO Metadata</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-600">Meta Title</label>
                      <input
                        type="text"
                        value={editingItem.seo_title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, seo_title: e.target.value })}
                        className="w-full text-xs px-3 py-1.5 rounded border"
                        placeholder="Search engine title..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-600">Meta Description</label>
                      <input
                        type="text"
                        value={editingItem.seo_description || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, seo_description: e.target.value })}
                        className="w-full text-xs px-3 py-1.5 rounded border"
                        placeholder="Search engine brief..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700">
                    <select
                      value={editingItem.status}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                      className="border rounded text-xs py-1 px-2"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                    <span>Status</span>
                  </label>

                  <div className="flex space-x-3">
                    <button 
                      type="button" 
                      onClick={() => setEditingItem(null)} 
                      className="px-4 py-2 border text-xs font-bold rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded hover:bg-secondary-light"
                    >
                      Save Article
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  };

  // 6. CERTIFICATES VIEW
  const renderCertificates = () => {
    const handleEditCert = (cert) => {
      setItemType("certificate");
      setEditingItem(cert || { title: "", image_url: "", file_url: "#", is_visible: true });
    };

    const handleSaveCert = async (e) => {
      e.preventDefault();
      await saveCertificate(editingItem);
      setEditingItem(null);
      triggerToast("Compliance certificate saved.");
    };

    return (
      <div className="space-y-6">
        
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-primary">Customs & Compliance Certificates</h2>
          <button
            onClick={() => handleEditCert(null)}
            className="flex items-center space-x-1.5 bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-2 px-4 rounded-large transition-colors shadow"
          >
            <Plus size={16} />
            <span>Upload Certificate</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="bg-white border border-neutral-border rounded-xlarge overflow-hidden shadow-premium lg:col-span-2">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                  <th className="p-4">Certificate Badge</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Visibility</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-600">
                {certificates.map((c) => (
                  <tr key={c.id}>
                    <td className="p-4">
                      <img src={c.image_url} alt="" className="w-12 h-8 object-cover rounded border" />
                    </td>
                    <td className="p-4 font-bold text-primary">{c.title}</td>
                    <td className="p-4">
                      {c.is_visible ? (
                        <span className="text-green-600 font-bold flex items-center"><Eye size={12} className="mr-1" /> Public</span>
                      ) : (
                        <span className="text-gray-400 flex items-center"><EyeOff size={12} className="mr-1" /> Hidden</span>
                      )}
                    </td>
                    <td className="p-4 flex items-center space-x-3 mt-1">
                      <button onClick={() => handleEditCert(c)} className="text-primary hover:text-accent">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => { if(confirm("Delete certificate?")) deleteCertificate(c.id); }} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editingItem && itemType === "certificate" ? (
            <div className="bg-white border border-neutral-border p-6 rounded-xlarge shadow-premium lg:col-span-1 h-fit">
              <form onSubmit={handleSaveCert} className="space-y-4">
                <h3 className="font-bold text-sm text-primary border-b pb-2">
                  {editingItem.id ? "Edit Certificate" : "Upload Certificate Details"}
                </h3>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Certificate Title</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded border focus:outline-none"
                  />
                </div>

                <div>
                  <ImageUploader
                    label="Badge Image"
                    value={editingItem.image_url || ""}
                    onChange={(val) => setEditingItem({ ...editingItem, image_url: val })}
                    aspect="1:1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Document Link / PDF File URL</label>
                  <input
                    type="text"
                    value={editingItem.file_url}
                    onChange={(e) => setEditingItem({ ...editingItem, file_url: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded border"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_visible"
                    checked={editingItem.is_visible}
                    onChange={(e) => setEditingItem({ ...editingItem, is_visible: e.target.checked })}
                    className="rounded text-primary focus:ring-0"
                  />
                  <label htmlFor="is_visible" className="text-xs font-semibold text-gray-700">Display publicly on site</label>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 border text-xs font-bold rounded">
                    Cancel
                  </button>
                  <button type="submit" className="px-3 py-1.5 bg-secondary text-white text-xs font-bold rounded">
                    Save Certificate
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed rounded-xlarge p-8 text-center flex flex-col justify-center text-gray-400">
              <Award size={36} className="mx-auto text-gray-300 mb-2" />
              <span className="text-xs font-semibold">Select upload / edit certificate to see editing parameters.</span>
            </div>
          )}

        </div>

      </div>
    );
  };

  // 7. WEBSITE SETTINGS / CMS VIEW
  const renderSettings = () => {
    return <SettingsManager triggerToast={triggerToast} />;
  };

  // 8. DATABASE SETUP / SUPABASE VIEW
  const renderDatabase = () => {
    const sqlScript = `-- 1. Categories
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_visible BOOLEAN DEFAULT true
);

-- ALTER TABLE categories ADD COLUMN is_visible BOOLEAN DEFAULT true;

-- 1.5 Subcategories
CREATE TABLE subcategories (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_visible BOOLEAN DEFAULT true
);

-- 2. Products
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  product_code TEXT,
  show_price BOOLEAN DEFAULT true,
  short_description TEXT,
  detailed_description TEXT,
  specifications JSONB DEFAULT '{}'::jsonb,
  dimensions TEXT,
  material TEXT,
  moq TEXT,
  price_inr NUMERIC DEFAULT 400,
  price_usd NUMERIC DEFAULT 5,
  country_availability JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'published',
  is_featured BOOLEAN DEFAULT false,
  images JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ALTER TABLE products ADD COLUMN video_url TEXT;
-- ALTER TABLE products ADD COLUMN product_code TEXT;
-- ALTER TABLE products ADD COLUMN show_price BOOLEAN DEFAULT true;

-- 3. Enquiries
CREATE TABLE enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  phone TEXT,
  state TEXT,
  pincode TEXT,
  product_interested TEXT,
  product_code TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ALTER TABLE enquiries ADD COLUMN product_code TEXT;

-- 4. Catalogue Downloads
CREATE TABLE catalogue_downloads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  phone TEXT,
  state TEXT,
  product_interest TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Certificates
CREATE TABLE certificates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT,
  image_url TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Blogs
CREATE TABLE blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  featured_image TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Founder Details
CREATE TABLE founder_details (
  id TEXT PRIMARY KEY DEFAULT 'main',
  photo_url TEXT,
  name TEXT NOT NULL,
  designation TEXT,
  message TEXT,
  is_visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Website Settings
CREATE TABLE website_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  company_name TEXT NOT NULL,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_banner_url TEXT,
  about_overview TEXT,
  about_mission TEXT,
  about_vision TEXT,
  about_core_values JSONB DEFAULT '[]'::jsonb,
  about_quality_commitment TEXT,
  show_hero_section BOOLEAN DEFAULT true,
  show_featured_section BOOLEAN DEFAULT true,
  show_why_choose_us BOOLEAN DEFAULT true,
  show_founder_section BOOLEAN DEFAULT true,
  show_overview_section BOOLEAN DEFAULT true,
  contact_whatsapp TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_address TEXT,
  testimonials JSONB DEFAULT '[]'::jsonb,
  consignments JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  socials JSONB DEFAULT '[]'::jsonb,
  show_certificates_page BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- IF YOU ALREADY CREATED TABLES, RUN THIS TO ADD THE NEW COLUMNS:
-- ALTER TABLE website_settings ADD COLUMN show_certificates_page BOOLEAN DEFAULT true;
-- ALTER TABLE website_settings ADD COLUMN testimonials JSONB DEFAULT '[]'::jsonb;
-- ALTER TABLE website_settings ADD COLUMN consignments JSONB DEFAULT '[]'::jsonb;
-- ALTER TABLE website_settings ADD COLUMN faqs JSONB DEFAULT '[]'::jsonb;
-- ALTER TABLE website_settings ADD COLUMN socials JSONB DEFAULT '[]'::jsonb;

-- 9. Orders
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  country TEXT,
  state TEXT,
  address TEXT,
  pincode TEXT,
  delivery_port TEXT,
  notes TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_inr NUMERIC NOT NULL,
  total_usd NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ALTER TABLE orders ADD COLUMN user_id TEXT;

-- 10. Disable Row Level Security (RLS) on all tables to allow client-side inserts/upserts using anon key
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE catalogue_downloads DISABLE ROW LEVEL SECURITY;
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE founder_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
`;

    const handleCopySQL = () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(sqlScript);
          triggerToast("SQL script copied to clipboard!");
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = sqlScript;
          textarea.style.position = "fixed";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          triggerToast("SQL script copied (fallback)!");
        }
      } catch (err) {
        console.error("Failed to copy:", err);
        triggerToast("Failed to copy automatically. Please select the script text and copy manually.");
      }
    };

    const handleSeed = async () => {
      setIsSeeding(true);
      setSeedError("");
      setSeedResult(null);
      try {
        const res = await seedDatabase();
        setSeedResult(res.results);
        triggerToast("Supabase database successfully seeded!");
        await refreshData();
      } catch (err) {
        setSeedError(err.message || "Failed to seed database.");
      } finally {
        setIsSeeding(false);
      }
    };

    const isConfigured = schemaStatus && schemaStatus.configured;
    const tableEntries = schemaStatus ? Object.entries(schemaStatus.tables) : [];
    const missingTables = tableEntries.filter(([_, t]) => !t.exists);
    const hasMissing = missingTables.length > 0;

    return (
      <div className="space-y-6">
        
        {/* Connection Status Card */}
        <div className="bg-white border border-neutral-border p-6 rounded-xlarge shadow-premium space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-bold text-sm text-primary">Supabase Connection Parameters</h3>
              <p className="text-[10px] text-gray-400">Status of environmental variable connection and remote tables.</p>
            </div>
            <div>
              {!schemaStatus ? (
                <span className="px-3 py-1 bg-yellow-50 text-yellow-600 border border-yellow-200 text-[10px] font-extrabold rounded-full animate-pulse">Checking connection...</span>
              ) : !isConfigured ? (
                <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 text-[10px] font-extrabold rounded-full">Disconnected / Not Configured</span>
              ) : hasMissing ? (
                <span className="px-3 py-1 bg-yellow-50 text-yellow-600 border border-yellow-200 text-[10px] font-extrabold rounded-full">Tables Missing (Schema Incomplete)</span>
              ) : (
                <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-200 text-[10px] font-extrabold rounded-full">Connected & Fully Active</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600">
            <div className="space-y-2">
              <div>
                <span className="font-bold text-gray-400 block uppercase text-[9px] tracking-wider">Project Endpoint URL</span>
                <code className="bg-gray-50 border px-2 py-1 rounded block text-primary mt-1 select-all font-mono">
                  {import.meta.env.VITE_SUPABASE_URL || "NOT CONFIGURED"}
                </code>
              </div>
              <div>
                <span className="font-bold text-gray-400 block uppercase text-[9px] tracking-wider">Client Anon Key</span>
                <code className="bg-gray-50 border px-2 py-1 rounded block text-primary mt-1 truncate select-all font-mono text-[10px]">
                  {import.meta.env.VITE_SUPABASE_ANON_KEY || "NOT CONFIGURED"}
                </code>
              </div>
            </div>

            <div className="bg-gray-50 border p-4 rounded-large space-y-2">
              <span className="font-bold text-gray-700 block uppercase text-[9px] tracking-wider">Table Status Inventory</span>
              {!schemaStatus ? (
                <div className="py-4 text-center text-gray-400">Verifying tables...</div>
              ) : !isConfigured ? (
                <div className="py-4 text-center text-red-500 font-semibold">Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your local .env file.</div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {tableEntries.map(([name, status]) => (
                    <div key={name} className="flex justify-between items-center border-b pb-1">
                      <span className="font-mono font-semibold text-primary">{name}</span>
                      {status.exists ? (
                        <span className="text-green-600 font-bold">Ready</span>
                      ) : (
                        <span className="text-red-500 font-bold" title={status.error}>Missing</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* If Not Configured instructions */}
        {schemaStatus && !isConfigured && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-xlarge text-xs text-red-800 space-y-3 shadow-sm">
            <h4 className="font-bold text-sm">Supabase Credentials Required</h4>
            <p>
              To host your products database, leads, and orders in your live Supabase project, create a <code>.env</code> file in the project root directory with the following variables:
            </p>
            <pre className="bg-red-100/50 p-3 rounded font-mono text-[10px] text-red-900">
{`VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key`}
            </pre>
          </div>
        )}

        {/* SQL Setup Instructions if Tables are missing */}
        {schemaStatus && isConfigured && hasMissing && (
          <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-xlarge space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-yellow-800">⚠️ Database Schema Setup Required</h4>
                <p className="text-xs text-yellow-700 mt-1">
                  Supabase environment connection is established, but the required tables are missing on the remote server.
                </p>
              </div>
              <button
                onClick={handleCopySQL}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-xs py-1.5 px-3 rounded-large shadow transition-all cursor-pointer"
              >
                Copy SQL Script
              </button>
            </div>
            
            <p className="text-xs text-yellow-800 font-semibold">
              Instructions: Open the <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline hover:text-yellow-900 font-bold text-primary">Supabase Dashboard</a> for this project, go to the <strong>SQL Editor</strong>, paste the script below, and click <strong>Run</strong>.
            </p>

            <div className="relative">
              <pre className="bg-neutral-border/25 border border-yellow-200 text-yellow-900 p-4 rounded-large font-mono text-[10px] max-h-60 overflow-y-auto custom-scrollbar select-all">
                {sqlScript}
              </pre>
            </div>
          </div>
        )}

        {/* Database Seeding Option (Active when tables are ready) */}
        {schemaStatus && isConfigured && !hasMissing && (
          <div className="bg-green-50 border border-green-100 p-6 rounded-xlarge space-y-4 shadow-sm">
            <div>
              <h4 className="font-bold text-sm text-green-800">🌱 Database Seeding</h4>
              <p className="text-xs text-green-700 mt-1">
                Your database tables exist and are ready to hold data. You can seed them with the default Areca Leaf tableware collection, categories, certificates, founder info, and settings.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleSeed}
                disabled={isSeeding}
                className="bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-2.5 px-5 rounded-large shadow transition-all disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
              >
                {isSeeding ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Seeding Database...</span>
                  </>
                ) : (
                  <span>Seed Supabase Database</span>
                )}
              </button>
              
              <button
                onClick={runSchemaCheck}
                disabled={isCheckingSchema}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs py-2.5 px-4 rounded-large transition-all cursor-pointer"
              >
                Refresh Status
              </button>
            </div>

            {seedError && (
              <div className="p-3 bg-red-100 border border-red-200 rounded text-red-700 text-xs font-semibold">
                Error during seeding: {seedError}
              </div>
            )}

            {seedResult && (
              <div className="p-4 bg-white border border-green-200 rounded-large text-xs text-green-800 space-y-2 shadow-inner">
                <span className="font-bold block">Seeding completed successfully! Imported:</span>
                <ul className="list-disc pl-5 font-semibold space-y-0.5 text-gray-700">
                  <li>Categories: {seedResult.categories} items</li>
                  <li>Products: {seedResult.products} items</li>
                  <li>Compliance Certificates: {seedResult.certificates} items</li>
                  <li>Trade Articles / Blogs: {seedResult.blogs} items</li>
                  <li>Founder Leadership Message: {seedResult.founder_details} profiles</li>
                  <li>CMS Website Settings: {seedResult.website_settings} profiles</li>
                </ul>
                <p className="text-[10px] text-gray-500 font-normal italic pt-1">
                  The website will now retrieve products and settings dynamically from your live Supabase database!
                </p>
              </div>
            )}
          </div>
        )}

        {/* RLS Troubleshooting Card */}
        {schemaStatus && isConfigured && (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-xlarge space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-bold text-sm text-amber-800 flex items-center">
                  🔐 Row Level Security (RLS) Troubleshooting
                </h4>
                <p className="text-xs text-amber-700 mt-1">
                  If you encounter errors when adding products, creating categories, or saving CMS settings (e.g. new products not showing up on the live website catalog, or errors in console), it is because Supabase has Row-Level Security (RLS) enabled on your tables by default.
                </p>
              </div>
              <button
                onClick={() => {
                  const rlsSql = `ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE catalogue_downloads DISABLE ROW LEVEL SECURITY;
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE founder_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;`;
                  try {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(rlsSql);
                      triggerToast("RLS Fix SQL copied!");
                    } else {
                      const textarea = document.createElement("textarea");
                      textarea.value = rlsSql;
                      textarea.style.position = "fixed";
                      document.body.appendChild(textarea);
                      textarea.focus();
                      textarea.select();
                      document.execCommand('copy');
                      document.body.removeChild(textarea);
                      triggerToast("RLS Fix SQL copied!");
                    }
                  } catch (err) {
                    console.error("Failed to copy RLS script:", err);
                  }
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-1.5 px-3.5 rounded-large shadow transition-all cursor-pointer whitespace-nowrap"
              >
                Copy RLS Fix SQL
              </button>
            </div>
            <p className="text-xs text-amber-800">
              <strong>To fix:</strong> Copy the RLS Fix script using the button above, go to the <strong>SQL Editor</strong> in your <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline hover:text-amber-900 font-bold">Supabase Dashboard</a>, paste it, and click <strong>Run</strong>. This allows client-side updates via the public anonymous key.
            </p>
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="flex-grow md:h-screen md:overflow-hidden bg-neutral-lightBg flex flex-col md:flex-row">
      
      {/* Mobile Header Bar */}
      <div className="flex md:hidden items-center justify-between p-4 bg-primary text-white border-b border-primary-light flex-shrink-0 w-full z-30 shadow-md">
        <div className="relative">
          <img src={logoImg} alt="VictaSure Logo" className="h-8 w-auto object-contain max-w-[130px]" />
          <span className="absolute -top-1 -right-3 text-[6px] font-extrabold text-[#8CE48C] select-none font-sans">TM</span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 text-white hover:text-accent focus:outline-none cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Overlay Background */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/65 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 h-full bg-primary text-gray-300 flex flex-col justify-between border-r border-primary-light flex-shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-grow">
          
          {/* Sidebar Close Button for Mobile */}
          <div className="flex justify-end md:hidden">
            <button onClick={() => setIsMobileSidebarOpen(false)} className="text-gray-400 hover:text-white p-1 cursor-pointer">
              <X size={18} />
            </button>
          </div>

          {/* Header Brand */}
          <div className="flex flex-col items-center text-center space-y-2 border-b border-primary-light pb-4">
            <div className="relative inline-block">
              <img src={logoImg} alt="VictaSure Logo" className="h-9 w-auto object-contain max-w-[150px]" />
              <span className="absolute -top-1 -right-3 text-[7px] font-extrabold text-[#8CE48C] select-none font-sans">TM</span>
            </div>
            <span className="text-[#8CE48C] font-bold text-[10px] uppercase tracking-widest mt-1">Admin Portal</span>
          </div>

          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center space-x-1.5 bg-primary-light hover:bg-secondary text-white font-bold text-[10px] py-1.5 px-3 rounded-large border border-primary-light hover:border-secondary transition-all w-full cursor-pointer shadow-sm mt-3"
          >
            <Globe size={12} className="text-accent" />
            <span>Visit Live Website</span>
          </a>

          {/* Nav List */}
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveTab('analytics'); setEditingItem(null); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-large text-xs font-semibold transition-all ${
                activeTab === 'analytics' ? 'bg-secondary text-white font-bold shadow' : 'hover:bg-primary-light hover:text-white'
              }`}
            >
              <BarChart3 size={16} className="text-accent" />
              <span>Analytics Metrics</span>
            </button>

            <button
              onClick={() => { setActiveTab('products'); setEditingItem(null); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-large text-xs font-semibold transition-all ${
                activeTab === 'products' ? 'bg-secondary text-white font-bold shadow' : 'hover:bg-primary-light hover:text-white'
              }`}
            >
              <Box size={16} className="text-accent" />
              <span>Export Products</span>
            </button>

            <button
              onClick={() => { setActiveTab('categories'); setEditingItem(null); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-large text-xs font-semibold transition-all ${
                activeTab === 'categories' ? 'bg-secondary text-white font-bold shadow' : 'hover:bg-primary-light hover:text-white'
              }`}
            >
              <FolderTree size={16} className="text-accent" />
              <span>Product Categories</span>
            </button>

            <button
              onClick={() => { setActiveTab('leads'); setEditingItem(null); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-large text-xs font-semibold transition-all ${
                activeTab === 'leads' ? 'bg-secondary text-white font-bold shadow' : 'hover:bg-primary-light hover:text-white'
              }`}
            >
              <FileSpreadsheet size={16} className="text-accent" />
              <span>Lead Database</span>
            </button>

            <button
              onClick={() => { setActiveTab('orders'); setEditingItem(null); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-large text-xs font-semibold transition-all ${
                activeTab === 'orders' ? 'bg-secondary text-white font-bold shadow' : 'hover:bg-primary-light hover:text-white'
              }`}
            >
              <ShoppingCart size={16} className="text-accent" />
              <span>Orders Database</span>
            </button>

            <button
              onClick={() => { setActiveTab('blogs'); setEditingItem(null); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-large text-xs font-semibold transition-all ${
                activeTab === 'blogs' ? 'bg-secondary text-white font-bold shadow' : 'hover:bg-primary-light hover:text-white'
              }`}
            >
              <Newspaper size={16} className="text-accent" />
              <span>Trade Blogs</span>
            </button>

            <button
              onClick={() => { setActiveTab('certificates'); setEditingItem(null); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-large text-xs font-semibold transition-all ${
                activeTab === 'certificates' ? 'bg-secondary text-white font-bold shadow' : 'hover:bg-primary-light hover:text-white'
              }`}
            >
              <Award size={16} className="text-accent" />
              <span>Certificates</span>
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setEditingItem(null); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-large text-xs font-semibold transition-all ${
                activeTab === 'settings' ? 'bg-secondary text-white font-bold shadow' : 'hover:bg-primary-light hover:text-white'
              }`}
            >
              <Settings size={16} className="text-accent" />
              <span>CMS Page Content</span>
            </button>
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-6 border-t border-primary-light flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 text-xs font-bold text-red-400 hover:text-red-300 py-2 px-3 rounded hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            <span>Portal Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Panel */}
      <main className="flex-grow flex flex-col md:h-screen md:overflow-hidden bg-neutral-lightBg">
        
        {/* Header toolbar */}
        <div className="flex justify-between items-center border-b p-6 sm:px-8 border-gray-200 bg-white flex-shrink-0 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-primary font-sans uppercase">
              {activeTab === 'analytics' ? 'Trading Metrics' : 
               activeTab === 'products' ? 'Product Assortment' :
               activeTab === 'categories' ? 'Category Taxonomy' :
               activeTab === 'leads' ? 'Importer Leads Panel' :
               activeTab === 'orders' ? 'E-Commerce Orders' :
               activeTab === 'blogs' ? 'Editorial Articles' :
               activeTab === 'certificates' ? 'Audit Accreditations' :
               activeTab === 'database' ? 'Supabase Sync & Setup' : 'CMS Settings Config'}
            </h1>
            <p className="text-xs text-gray-400 flex flex-wrap items-center gap-2 mt-1">
              <span>Admin console tracking session actions and database states.</span>
              {isSupabaseConfigured() ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                  ● Supabase Connected
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                  ▲ Local Offline Storage Mode
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-grow p-6 sm:p-8 overflow-y-auto space-y-6 custom-scrollbar">
          
          {/* Tab Switching */}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'categories' && renderCategories()}
          {activeTab === 'leads' && renderLeads()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'blogs' && renderBlogs()}
          {activeTab === 'certificates' && renderCertificates()}
          {activeTab === 'settings' && renderSettings()}

        </div>

        {/* Success Toast Notification */}
        {successToast && (
          <div className="bg-secondary text-white p-3 rounded-large shadow-lg flex items-center space-x-2 text-xs font-semibold animate-bounce fixed bottom-5 right-5 z-50">
            <CheckCircle size={16} />
            <span>{successToast}</span>
          </div>
        )}

      </main>

    </div>
  );
}

function SettingsManager({ triggerToast }) {
  const { settings, founder, saveSettings, saveFounder } = useApp();
  const [subTab, setSubTab] = React.useState('general');

  // Local state for General/Contact
  const [companyName, setCompanyName] = React.useState('');
  const [heroTitle, setHeroTitle] = React.useState('');
  const [heroSubtitle, setHeroSubtitle] = React.useState('');
  const [heroBannerUrls, setHeroBannerUrls] = React.useState(['', '', '', '', '', '', '', '']);
  const [logoUrl, setLogoUrl] = React.useState('');
  const [heroSlideDelay, setHeroSlideDelay] = React.useState('5');
  const [contactWhatsapp, setContactWhatsapp] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [contactPhone, setContactPhone] = React.useState('');
  const [contactAddress, setContactAddress] = React.useState('');
  const [cataloguePdf, setCataloguePdf] = React.useState('');
  
  // Section switches
  const [showHero, setShowHero] = React.useState(true);
  const [showFeatured, setShowFeatured] = React.useState(true);
  const [showWhyChooseUs, setShowWhyChooseUs] = React.useState(true);
  const [showFounder, setShowFounder] = React.useState(true);
  const [showOverview, setShowOverview] = React.useState(true);
  const [showCertificatesPage, setShowCertificatesPage] = React.useState(true);

  // Local state for About Page
  const [aboutOverview, setAboutOverview] = React.useState('');
  const [aboutMission, setAboutMission] = React.useState('');
  const [aboutMissionIcon, setAboutMissionIcon] = React.useState('Target');
  const [aboutVision, setAboutVision] = React.useState('');
  const [aboutVisionIcon, setAboutVisionIcon] = React.useState('Compass');
  const [coreValuesText, setCoreValuesText] = React.useState('');
  const [qualityCommitment, setQualityCommitment] = React.useState('');

  const [whyChooseUsItems, setWhyChooseUsItems] = React.useState([
    { icon: "ShieldCheck", title: "", description: "" },
    { icon: "Globe", title: "", description: "" },
    { icon: "Award", title: "", description: "" },
    { icon: "Leaf", title: "", description: "" }
  ]);

  // Local state for Founder details
  const [founderName, setFounderName] = React.useState('');
  const [founderDesignation, setFounderDesignation] = React.useState('');
  const [founderPhotoUrl, setFounderPhotoUrl] = React.useState('');
  const [founderMessage, setFounderMessage] = React.useState('');
  const [founderIsVisible, setFounderIsVisible] = React.useState(true);

  // Local lists for Testimonials & Consignments
  const [testimonials, setTestimonials] = React.useState([]);
  const [consignments, setConsignments] = React.useState([]);
  const [faqs, setFaqs] = React.useState([]);
  const [socials, setSocials] = React.useState([
    { platform: "Globe", url: "" },
    { platform: "Linkedin", url: "" },
    { platform: "Facebook", url: "" }
  ]);

  // Editor states for testimonial / consignment forms
  const [editingTestimonial, setEditingTestimonial] = React.useState(null); 
  const [editingConsignment, setEditingConsignment] = React.useState(null); 
  const [editingFaq, setEditingFaq] = React.useState(null);

  // Local state for Terms & Conditions Page
  const [showTermsPage, setShowTermsPage] = React.useState(true);
  const [termsEffectiveDate, setTermsEffectiveDate] = React.useState('');
  const [termsNotice, setTermsNotice] = React.useState('');
  const [termsContent, setTermsContent] = React.useState('');

  // Setting buttons loading states
  const [isSavingGeneral, setIsSavingGeneral] = React.useState(false);
  const [isSavedGeneral, setIsSavedGeneral] = React.useState(false);
  const [isSavingAbout, setIsSavingAbout] = React.useState(false);
  const [isSavedAbout, setIsSavedAbout] = React.useState(false);
  const [isSavingFounder, setIsSavingFounder] = React.useState(false);
  const [isSavedFounder, setIsSavedFounder] = React.useState(false);
  const [isSavingTerms, setIsSavingTerms] = React.useState(false);
  const [isSavedTerms, setIsSavedTerms] = React.useState(false);

  // Sync settings local state to context data when loaded
  React.useEffect(() => {
    if (settings) {
      setCompanyName(settings.company_name || '');
      setHeroTitle(settings.hero_title || '');
      setHeroSubtitle(settings.hero_subtitle || '');
      setLogoUrl(settings.logo_url || '');
      setHeroSlideDelay(settings.hero_slide_delay || '5');
      
      const val = settings.hero_banner_url || '';
      let urls = ['', '', '', '', '', '', '', ''];
      if (val.startsWith('[') && val.endsWith(']')) {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            urls = [
              parsed[0] || '',
              parsed[1] || '',
              parsed[2] || '',
              parsed[3] || '',
              parsed[4] || '',
              parsed[5] || '',
              parsed[6] || '',
              parsed[7] || ''
            ];
          }
        } catch (e) {
          console.error("Failed to parse hero_banner_url", e);
          urls = [val, '', '', '', '', '', '', ''];
        }
      } else {
        urls = [val, '', '', '', '', '', '', ''];
      }
      setHeroBannerUrls(urls);

      setContactWhatsapp(settings.contact_whatsapp || '');
      setContactEmail(settings.contact_email || '');
      setContactPhone(settings.contact_phone || '');
      setContactAddress(settings.contact_address || '');
      setCataloguePdf(settings.catalogue_pdf || '');
      
      setShowHero(settings.show_hero_section !== false);
      setShowFeatured(settings.show_featured_section !== false);
      setShowWhyChooseUs(settings.show_why_choose_us !== false);
      setShowFounder(settings.show_founder_section !== false);
      setShowOverview(settings.show_overview_section !== false);
      setShowCertificatesPage(settings.show_certificates_page !== false);

      setAboutOverview(settings.about_overview || '');
      setAboutMission(settings.about_mission || '');
      setAboutMissionIcon(settings.about_mission_icon || 'Target');
      setAboutVision(settings.about_vision || '');
      setAboutVisionIcon(settings.about_vision_icon || 'Compass');
      setCoreValuesText(Array.isArray(settings.about_core_values) ? settings.about_core_values.join('\n') : (settings.about_core_values || ''));
      setQualityCommitment(settings.about_quality_commitment || '');

      setWhyChooseUsItems(settings.why_choose_us_items && settings.why_choose_us_items.length === 4 
        ? settings.why_choose_us_items 
        : [
            { icon: "ShieldCheck", title: "Strict Quality Audits", description: "Every batch undergoes moisture level checks and heat-pressed sterilization to ensure zero mold or structural cracking." },
            { icon: "Globe", title: "Global B2B Logistics", description: "Smooth container booking, ocean freight coordination, and customs clearance documents compiled under one roof." },
            { icon: "Award", title: "Moisture-Proof Storage", description: "Our raw leaf sorting and finished product inventories are stored in temperature-controlled warehouses prior to shipment." },
            { icon: "Leaf", title: "Chemical-Free Process", description: "100% biodegradable plates heat-pressed solely from naturally shed Areca palm leaves without adhesives, plastics, or toxins." }
          ]
      );

      setTestimonials(settings.testimonials || []);
      setConsignments(settings.consignments || []);
      setFaqs(settings.faqs || []);

      setShowTermsPage(settings.show_terms_page !== false);
      setTermsEffectiveDate(settings.terms_effective_date || '');
      setTermsNotice(settings.terms_notice || '');
      setTermsContent(settings.terms_content || '');

      setSocials(settings.socials && settings.socials.length > 0 
        ? settings.socials 
        : [
            { platform: "Globe", url: "" },
            { platform: "Linkedin", url: "" },
            { platform: "Facebook", url: "" }
          ]
      );
    }
  }, [settings]);

  // Sync founder local state to context data when loaded
  React.useEffect(() => {
    if (founder) {
      setFounderName(founder.name || '');
      setFounderDesignation(founder.designation || '');
      setFounderPhotoUrl(founder.photo_url || '');
      setFounderMessage(founder.message || '');
      setFounderIsVisible(founder.is_visible !== false);
    }
  }, [founder]);

  // Save Terms & Conditions Settings
  const handleSaveTerms = async (e) => {
    e.preventDefault();
    setIsSavingTerms(true);
    try {
      const updated = {
        ...settings,
        show_terms_page: showTermsPage,
        terms_effective_date: termsEffectiveDate,
        terms_notice: termsNotice,
        terms_content: termsContent
      };
      await saveSettings(updated);
      setIsSavedTerms(true);
      triggerToast('Terms & Conditions settings updated.');
      setTimeout(() => setIsSavedTerms(false), 2000);
    } catch (err) {
      console.error(err);
      triggerToast(`Error: ${err.message || err}`);
    } finally {
      setIsSavingTerms(false);
    }
  };

  // Save General & Contact Settings
  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    setIsSavingGeneral(true);
    try {
      const updated = {
        ...settings,
        company_name: companyName,
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_banner_url: JSON.stringify(heroBannerUrls),
        logo_url: logoUrl,
        hero_slide_delay: heroSlideDelay,
        contact_whatsapp: contactWhatsapp,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        contact_address: contactAddress,
        catalogue_pdf: cataloguePdf,
        show_hero_section: showHero,
        show_featured_section: showFeatured,
        show_why_choose_us: showWhyChooseUs,
        show_founder_section: showFounder,
        show_overview_section: showOverview,
        show_certificates_page: showCertificatesPage,
        why_choose_us_items: whyChooseUsItems,
        socials: socials
      };
      await saveSettings(updated);
      setIsSavedGeneral(true);
      triggerToast('General and contact configurations saved.');
      setTimeout(() => setIsSavedGeneral(false), 2000);
    } catch (err) {
      console.error(err);
      triggerToast(`Error: ${err.message || err}`);
    } finally {
      setIsSavingGeneral(false);
    }
  };

  // Save About Details
  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setIsSavingAbout(true);
    try {
      const valuesArray = coreValuesText
        .split('\n')
        .map(v => v.trim())
        .filter(v => v.length > 0);

      const updated = {
        ...settings,
        about_overview: aboutOverview,
        about_mission: aboutMission,
        about_mission_icon: aboutMissionIcon,
        about_vision: aboutVision,
        about_vision_icon: aboutVisionIcon,
        about_core_values: valuesArray,
        about_quality_commitment: qualityCommitment
      };
      await saveSettings(updated);
      setIsSavedAbout(true);
      triggerToast('About Us sections saved successfully.');
      setTimeout(() => setIsSavedAbout(false), 2000);
    } catch (err) {
      console.error(err);
      triggerToast('Error saving About Us info.');
    } finally {
      setIsSavingAbout(false);
    }
  };

  // Save Founder info
  const handleSaveFounder = async (e) => {
    e.preventDefault();
    setIsSavingFounder(true);
    try {
      const updated = {
        ...founder,
        name: founderName,
        designation: founderDesignation,
        photo_url: founderPhotoUrl,
        message: founderMessage,
        is_visible: founderIsVisible
      };
      await saveFounder(updated);
      setIsSavedFounder(true);
      triggerToast('Founder details saved successfully.');
      setTimeout(() => setIsSavedFounder(false), 2000);
    } catch (err) {
      console.error(err);
      triggerToast('Error saving founder details.');
    } finally {
      setIsSavingFounder(false);
    }
  };

  // --- Testimonial Actions ---
  const handleSaveTestimonialItem = async (e) => {
    e.preventDefault();
    let updatedList = [...testimonials];
    const newItem = {
      name: editingTestimonial.name,
      role: editingTestimonial.role,
      company: editingTestimonial.company,
      location: editingTestimonial.location,
      rating: Number(editingTestimonial.rating),
      port: editingTestimonial.port,
      volume: editingTestimonial.volume,
      text: editingTestimonial.text
    };

    if (editingTestimonial.idx !== undefined) {
      updatedList[editingTestimonial.idx] = newItem;
    } else {
      updatedList.push(newItem);
    }

    try {
      const updated = {
        ...settings,
        testimonials: updatedList
      };
      await saveSettings(updated);
      setTestimonials(updatedList);
      setEditingTestimonial(null);
      triggerToast('Testimonials updated.');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to update testimonials.');
    }
  };

  const handleDeleteTestimonial = async (idx) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    const updatedList = testimonials.filter((_, i) => i !== idx);
    try {
      const updated = {
        ...settings,
        testimonials: updatedList
      };
      await saveSettings(updated);
      setTestimonials(updatedList);
      triggerToast('Testimonial deleted.');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to delete testimonial.');
    }
  };

  // --- Consignment Actions ---
  const handleSaveConsignmentItem = async (e) => {
    e.preventDefault();
    let updatedList = [...consignments];
    const newItem = {
      id: editingConsignment.id || Date.now(),
      title: editingConsignment.title,
      cargo: editingConsignment.cargo,
      destination: editingConsignment.destination,
      transitTime: editingConsignment.transitTime,
      inspection: editingConsignment.inspection,
      image: editingConsignment.image,
      description: editingConsignment.description,
      is_visible: editingConsignment.is_visible !== false
    };

    if (editingConsignment.idx !== undefined) {
      updatedList[editingConsignment.idx] = newItem;
    } else {
      updatedList.push(newItem);
    }

    try {
      const updated = {
        ...settings,
        consignments: updatedList
      };
      await saveSettings(updated);
      setConsignments(updatedList);
      setEditingConsignment(null);
      triggerToast('Consignment portfolio updated.');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to update consignments.');
    }
  };

  const handleDeleteConsignment = async (idx) => {
    if (!confirm('Are you sure you want to delete this consignment?')) return;
    const updatedList = consignments.filter((_, i) => i !== idx);
    try {
      const updated = {
        ...settings,
        consignments: updatedList
      };
      await saveSettings(updated);
      setConsignments(updatedList);
      triggerToast('Consignment deleted.');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to delete consignment.');
    }
  };

  const handleSaveFaqItem = async (e) => {
    e.preventDefault();
    let updatedList = [...faqs];
    const newItem = {
      question: editingFaq.question,
      answer: editingFaq.answer
    };

    if (editingFaq.idx !== undefined) {
      updatedList[editingFaq.idx] = newItem;
    } else {
      updatedList.push(newItem);
    }

    try {
      const updated = {
        ...settings,
        faqs: updatedList
      };
      await saveSettings(updated);
      setFaqs(updatedList);
      setEditingFaq(null);
      triggerToast('FAQ list updated.');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to update FAQ.');
    }
  };

  const handleDeleteFaq = async (idx) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    const updatedList = faqs.filter((_, i) => i !== idx);
    try {
      const updated = {
        ...settings,
        faqs: updatedList
      };
      await saveSettings(updated);
      setFaqs(updatedList);
      triggerToast('FAQ deleted successfully.');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to delete FAQ.');
    }
  };

  if (!settings) {
    return <div className="text-center py-8 text-xs font-semibold text-gray-500 animate-pulse">Loading website settings context...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Sub-tabs Navigation */}
      <div className="flex flex-wrap gap-2 bg-white border border-neutral-border p-3 rounded-large shadow-sm">
        {[
          { id: 'general', label: 'General & Contact' },
          { id: 'about', label: 'About Us Sections' },
          { id: 'founder', label: 'Founder Profile' },
          { id: 'testimonials', label: 'Client Reviews' },
          { id: 'consignments', label: 'Shipping Portfolio' },
          { id: 'faqs', label: 'FAQ Q&As' },
          { id: 'terms', label: 'Terms & Conditions' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSubTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-large border transition-all cursor-pointer ${
              subTab === tab.id 
                ? 'bg-secondary border-secondary text-white shadow-sm' 
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {subTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-white border border-neutral-border p-6 sm:p-8 rounded-xlarge shadow-premium space-y-6">
          <h3 className="font-sans font-bold text-sm text-primary border-b pb-2 uppercase tracking-wider">General Configurations & Lead Anchors</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Hero Title Banner Heading</label>
              <input
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Website Logo Image URL</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary mb-2"
              />
              <ImageUploader
                label="Or Upload Website Logo"
                value={logoUrl}
                onChange={(val) => setLogoUrl(val)}
                aspect="free"
                disableCrop={true}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Slideshow Speed / Switch Delay (in seconds)</label>
              <select
                value={heroSlideDelay}
                onChange={(e) => setHeroSlideDelay(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white rounded border focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="3">3 seconds (Fast)</option>
                <option value="5">5 seconds (Standard)</option>
                <option value="7">7 seconds (Relaxed)</option>
                <option value="10">10 seconds (Slow)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Hero Subtitle Paragraph</label>
            <textarea
              rows="2"
              required
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-gray-700">Hero Banner Images (Slideshow - up to 8)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
                <ImageUploader
                  key={idx}
                  label={`Hero Slide Image ${idx + 1}`}
                  value={heroBannerUrls[idx] || ''}
                  onChange={(val) => {
                    const next = [...heroBannerUrls];
                    next[idx] = val;
                    setHeroBannerUrls(next);
                  }}
                  aspect="16:9"
                  disableCrop={true}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Trade Phone (with country code, e.g. +919876543210)</label>
              <input
                type="text"
                value={contactWhatsapp}
                onChange={(e) => setContactWhatsapp(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded border focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Corporate Enquiry Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded border focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Public Display Phone Number</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded border focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Headquarters Address</label>
            <textarea
              rows="2"
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded border focus:outline-none"
            />
          </div>

          <div className="space-y-2 border-t pt-4 border-gray-100 font-sans">
            <label className="block text-xs font-bold text-gray-700">Company B2B Product Catalogue (PDF)</label>
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="file"
                accept="application/pdf"
                id="catalogue-pdf-uploader"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (file.size > 5 * 1024 * 1024) {
                    alert("PDF file size must be less than 5MB");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setCataloguePdf(event.target.result);
                    triggerToast("B2B Product Catalogue PDF uploaded successfully.");
                  };
                  reader.readAsDataURL(file);
                }}
              />
              <label
                htmlFor="catalogue-pdf-uploader"
                className="bg-primary hover:bg-secondary text-white text-[10px] font-bold py-2 px-4 rounded-large cursor-pointer flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <Upload size={12} className="text-accent" />
                <span>Upload B2B Catalogue PDF</span>
              </label>
              
              {cataloguePdf ? (
                <div className="flex items-center space-x-2 text-xs font-semibold text-green-600 bg-green-50 py-1.5 px-3 rounded-large border border-green-200 animate-fade-in">
                  <CheckCircle size={14} />
                  <span>Catalogue PDF Configured</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCataloguePdf('');
                      triggerToast("Catalogue PDF removed.");
                    }}
                    className="text-red-500 hover:text-red-700 font-bold ml-2 focus:outline-none"
                    title="Remove PDF"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <span className="text-[10px] text-gray-400 font-medium italic">No PDF uploaded. Fallback printable catalogue will be active.</span>
              )}
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <span className="block text-xs font-bold text-primary uppercase tracking-wider">Why Choose Us Differentiators (4 Grid Cards)</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whyChooseUsItems.map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded border border-gray-200 space-y-3">
                  <span className="block text-xs font-bold text-secondary">Card {idx + 1}</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">Card Title</label>
                      <input
                        type="text"
                        required
                        value={item.title || ''}
                        onChange={(e) => {
                          const next = [...whyChooseUsItems];
                          next[idx] = { ...next[idx], title: e.target.value };
                          setWhyChooseUsItems(next);
                        }}
                        className="w-full text-xs px-2.5 py-1.5 rounded border focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">Card Icon</label>
                      <select
                        value={item.icon || 'Leaf'}
                        onChange={(e) => {
                          const next = [...whyChooseUsItems];
                          next[idx] = { ...next[idx], icon: e.target.value };
                          setWhyChooseUsItems(next);
                        }}
                        className="w-full text-xs px-2.5 py-1.5 bg-white rounded border focus:outline-none"
                      >
                        {["ShieldCheck", "Globe", "Award", "Leaf", "Target", "Eye", "Compass", "Heart", "Activity", "Sparkles", "TrendingUp", "Users"].map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1">Card Description</label>
                    <textarea
                      rows="2"
                      required
                      value={item.description || ''}
                      onChange={(e) => {
                        const next = [...whyChooseUsItems];
                        next[idx] = { ...next[idx], description: e.target.value };
                        setWhyChooseUsItems(next);
                      }}
                      className="w-full text-xs px-2.5 py-1.5 rounded border focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="block text-xs font-bold text-primary uppercase tracking-wider">Social Media Links</span>
              <button
                type="button"
                onClick={() => setSocials(prev => [...prev, { platform: "Globe", url: "" }])}
                className="bg-primary hover:bg-secondary text-white text-[10px] font-bold py-1.5 px-3 rounded-large cursor-pointer flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <Plus size={10} className="text-accent" />
                <span>Add Social Link</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socials.map((soc, idx) => (
                <div key={idx} className="space-y-2 bg-gray-50 p-3 rounded border border-gray-100 relative group">
                  <button
                    type="button"
                    onClick={() => setSocials(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold focus:outline-none"
                    title="Remove Link"
                  >
                    Remove
                  </button>
                  <label className="block text-[10px] font-bold text-gray-700">Link #{idx + 1}</label>
                  <div className="flex space-x-2 pt-1">
                    <select
                      value={soc.platform}
                      onChange={(e) => {
                        const next = [...socials];
                        next[idx] = { ...next[idx], platform: e.target.value };
                        setSocials(next);
                      }}
                      className="w-1/3 text-xs px-2 py-1.5 bg-white rounded border focus:outline-none"
                    >
                      {["Facebook", "Twitter", "Linkedin", "Instagram", "Youtube", "WhatsApp", "Pinterest", "TikTok", "Globe"].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={soc.url || ''}
                      onChange={(e) => {
                        const next = [...socials];
                        next[idx] = { ...next[idx], url: e.target.value };
                        setSocials(next);
                      }}
                      className="w-2/3 text-xs px-3 py-1.5 bg-white rounded border focus:outline-none"
                    />
                  </div>
                </div>
              ))}
              {socials.length === 0 && (
                <div className="md:col-span-2 text-center py-4 text-xs text-gray-400 font-medium italic">
                  No social media links added. Click "Add Social Link" to create one.
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Frontend Sections Visibility Toggles</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHero}
                  onChange={(e) => setShowHero(e.target.checked)}
                  className="rounded text-primary focus:ring-0"
                />
                <span>Hero Slide</span>
              </label>
              <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOverview}
                  onChange={(e) => setShowOverview(e.target.checked)}
                  className="rounded text-primary focus:ring-0"
                />
                <span>Overview Card</span>
              </label>
              <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFeatured}
                  onChange={(e) => setShowFeatured(e.target.checked)}
                  className="rounded text-primary focus:ring-0"
                />
                <span>Featured Prod</span>
              </label>
              <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showWhyChooseUs}
                  onChange={(e) => setShowWhyChooseUs(e.target.checked)}
                  className="rounded text-primary focus:ring-0"
                />
                <span>Why Us Grid</span>
              </label>
              <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFounder}
                  onChange={(e) => setShowFounder(e.target.checked)}
                  className="rounded text-primary focus:ring-0"
                />
                <span>Founder Quote</span>
              </label>
              <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCertificatesPage}
                  onChange={(e) => setShowCertificatesPage(e.target.checked)}
                  className="rounded text-primary focus:ring-0"
                />
                <span>Certificates Pg</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={isSavingGeneral || isSavedGeneral}
              className="flex items-center space-x-1.5 bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-2.5 px-6 rounded-large shadow transition-all cursor-pointer disabled:opacity-80"
            >
              {isSavingGeneral ? (
                <>
                  <RefreshCw className="animate-spin" size={14} />
                  <span>Saving...</span>
                </>
              ) : isSavedGeneral ? (
                <>
                  <Check className="text-green-400" size={14} />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save General Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {subTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="bg-white border border-neutral-border p-6 sm:p-8 rounded-xlarge shadow-premium space-y-6">
          <h3 className="font-sans font-bold text-sm text-primary border-b pb-2 uppercase tracking-wider">About Us Corporate Details</h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Company Overview (About Page)</label>
            <textarea
              rows="3"
              required
              value={aboutOverview}
              onChange={(e) => setAboutOverview(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Corporate Mission</label>
              <textarea
                rows="3"
                required
                value={aboutMission}
                onChange={(e) => setAboutMission(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1"
              />
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Mission Card Icon</label>
                <select
                  value={aboutMissionIcon}
                  onChange={(e) => setAboutMissionIcon(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-white rounded border focus:outline-none"
                >
                  {["ShieldCheck", "Globe", "Award", "Leaf", "Target", "Eye", "Compass", "Heart", "Activity", "Sparkles", "TrendingUp", "Users"].map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Corporate Vision</label>
              <textarea
                rows="3"
                required
                value={aboutVision}
                onChange={(e) => setAboutVision(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1"
              />
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Vision Card Icon</label>
                <select
                  value={aboutVisionIcon}
                  onChange={(e) => setAboutVisionIcon(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-white rounded border focus:outline-none"
                >
                  {["ShieldCheck", "Globe", "Award", "Leaf", "Target", "Eye", "Compass", "Heart", "Activity", "Sparkles", "TrendingUp", "Users"].map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Core Values (Type each value on a new line)</label>
            <textarea
              rows="5"
              required
              value={coreValuesText}
              onChange={(e) => setCoreValuesText(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded border font-sans focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Uncompromising Quality Assurance&#10;Eco-Friendly & Sustainable Focus&#10;Absolute Integrity & Transparency"
            />
            <p className="text-[10px] text-gray-400 mt-1 italic">Each line will represent one value block displayed on the About Us page.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Quality Assurance & Auditing Policy Statement</label>
            <textarea
              rows="3"
              required
              value={qualityCommitment}
              onChange={(e) => setQualityCommitment(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded border focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={isSavingAbout || isSavedAbout}
              className="flex items-center space-x-1.5 bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-2.5 px-6 rounded-large shadow transition-all cursor-pointer disabled:opacity-80"
            >
              {isSavingAbout ? (
                <>
                  <RefreshCw className="animate-spin" size={14} />
                  <span>Saving...</span>
                </>
              ) : isSavedAbout ? (
                <>
                  <Check className="text-green-400" size={14} />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save About Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {subTab === 'founder' && (
        <form onSubmit={handleSaveFounder} className="bg-white border border-neutral-border p-6 sm:p-8 rounded-xlarge shadow-premium space-y-6">
          <h3 className="font-sans font-bold text-sm text-primary border-b pb-2 uppercase tracking-wider">Founder / MD Leadership Profile</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Founder Name</label>
              <input
                type="text"
                required
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Founder Designation</label>
              <input
                type="text"
                required
                value={founderDesignation}
                onChange={(e) => setFounderDesignation(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <ImageUploader
              label="Founder Photo"
              value={founderPhotoUrl}
              onChange={(val) => setFounderPhotoUrl(val)}
              aspect="1:1"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Founder Message</label>
            <textarea
              rows="4"
              required
              value={founderMessage}
              onChange={(e) => setFounderMessage(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="founder_visible"
              checked={founderIsVisible}
              onChange={(e) => setFounderIsVisible(e.target.checked)}
              className="rounded text-primary focus:ring-0"
            />
            <label htmlFor="founder_visible" className="text-xs font-semibold text-gray-700 cursor-pointer">Display founder details publicly on website</label>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={isSavingFounder || isSavedFounder}
              className="flex items-center space-x-1.5 bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-2.5 px-6 rounded-large shadow transition-all cursor-pointer disabled:opacity-80"
            >
              {isSavingFounder ? (
                <>
                  <RefreshCw className="animate-spin" size={14} />
                  <span>Saving...</span>
                </>
              ) : isSavedFounder ? (
                <>
                  <Check className="text-green-400" size={14} />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Founder Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {subTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-bold text-sm text-primary uppercase tracking-wider">Importer Testimonials & Reviews</h3>
            {!editingTestimonial && (
              <button
                type="button"
                onClick={() => setEditingTestimonial({ name: '', role: '', company: '', location: '', rating: 5, port: '', volume: '', text: '' })}
                className="flex items-center space-x-1.5 bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-2 px-4 rounded-large transition-colors shadow cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Testimonial</span>
              </button>
            )}
          </div>

          {editingTestimonial ? (
            <form onSubmit={handleSaveTestimonialItem} className="bg-white border border-neutral-border p-6 rounded-xlarge shadow-premium space-y-4">
              <h4 className="font-bold text-xs text-primary border-b pb-2">
                {editingTestimonial.idx !== undefined ? 'Edit Testimonial' : 'Create Testimonial'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 rounded border"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">Client Designation / Role</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.role}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 rounded border"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">Client Company</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.company}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 rounded border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.location}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, location: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 rounded border"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">Destination Port</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.port}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, port: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 rounded border"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">Volume Imported Per Year</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.volume}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, volume: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 rounded border"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">Rating</label>
                  <select
                    value={editingTestimonial.rating}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-1.5 bg-white rounded border"
                  >
                    {[5, 4, 3, 2, 1].map(r => (
                      <option key={r} value={r}>{r} Stars</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-1">Review Statement Text</label>
                <textarea
                  rows="3"
                  required
                  value={editingTestimonial.text}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 rounded border"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="px-3 py-1.5 border text-xs font-bold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-secondary text-white text-xs font-bold rounded"
                >
                  Save Review
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white border border-neutral-border rounded-xlarge overflow-hidden shadow-premium">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                    <th className="p-4">Importer</th>
                    <th className="p-4">Company & Port</th>
                    <th className="p-4">Volume</th>
                    <th className="p-4">Review Preview</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-600">
                  {testimonials.map((t, idx) => (
                    <tr key={idx}>
                      <td className="p-4">
                        <span className="font-bold text-primary block">{t.clientName || t.name}</span>
                        <span className="text-[10px] text-gray-400">{t.designation || t.role} • {t.location}</span>
                      </td>
                      <td className="p-4 font-semibold text-secondary-dark">
                        <span>{t.company}</span>
                        <span className="text-[10px] text-gray-400 block">{t.port}</span>
                      </td>
                      <td className="p-4">{t.volume}</td>
                      <td className="p-4 max-w-xs truncate" title={t.text}>{t.text}</td>
                      <td className="p-4 flex items-center space-x-3 mt-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingTestimonial({
                            idx,
                            name: t.clientName || t.name || '',
                            role: t.designation || t.role || '',
                            company: t.company || '',
                            location: t.location || '',
                            rating: t.rating || 5,
                            port: t.port || '',
                            volume: t.volume || '',
                            text: t.text || ''
                          })}
                          className="text-primary hover:text-accent"
                          title="Edit review"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTestimonial(idx)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete review"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {testimonials.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-gray-400 font-semibold italic">
                        No testimonials configured yet. Click Add Testimonial to create.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {subTab === 'consignments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-bold text-sm text-primary uppercase tracking-wider">Export Shipping Consignments Portfolio</h3>
            {!editingConsignment && (
              <button
                type="button"
                onClick={() => setEditingConsignment({ title: '', cargo: '', destination: '', transitTime: '', inspection: '', image: '', description: '', is_visible: true })}
                className="flex items-center space-x-1.5 bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-2 px-4 rounded-large transition-colors shadow cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Consignment</span>
              </button>
            )}
          </div>

          {editingConsignment ? (
            <form onSubmit={handleSaveConsignmentItem} className="bg-white border border-neutral-border p-6 rounded-xlarge shadow-premium space-y-4">
              <h4 className="font-bold text-xs text-primary border-b pb-2">
                {editingConsignment.idx !== undefined ? 'Edit Consignment Details' : 'Create Consignment Entry'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">Dispatch Title</label>
                  <input
                    type="text"
                    required
                    value={editingConsignment.title}
                    onChange={(e) => setEditingConsignment({ ...editingConsignment, title: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 rounded border"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">Cargo Details (e.g. 85,000 Plates)</label>
                  <input
                    type="text"
                    required
                    value={editingConsignment.cargo}
                    onChange={(e) => setEditingConsignment({ ...editingConsignment, cargo: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 rounded border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">Destination Port / Region</label>
                  <input
                    type="text"
                    required
                    value={editingConsignment.destination}
                    onChange={(e) => setEditingConsignment({ ...editingConsignment, destination: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 rounded border"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">Transit Time</label>
                  <input
                    type="text"
                    required
                    value={editingConsignment.transitTime}
                    onChange={(e) => setEditingConsignment({ ...editingConsignment, transitTime: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 rounded border"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">Inspection Status / Certificates</label>
                  <input
                    type="text"
                    required
                    value={editingConsignment.inspection}
                    onChange={(e) => setEditingConsignment({ ...editingConsignment, inspection: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 rounded border"
                  />
                </div>
                <div>
                  <ImageUploader
                    label="Cargo Showcase Image"
                    value={editingConsignment.image || ""}
                    onChange={(val) => setEditingConsignment({ ...editingConsignment, image: val })}
                    aspect="16:9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-1">Consignment Summary & Shipping Details</label>
                <textarea
                  rows="3"
                  required
                  value={editingConsignment.description}
                  onChange={(e) => setEditingConsignment({ ...editingConsignment, description: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 rounded border"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="is_visible"
                  checked={editingConsignment.is_visible !== false}
                  onChange={(e) => setEditingConsignment({ ...editingConsignment, is_visible: e.target.checked })}
                  className="rounded text-primary focus:ring-0"
                />
                <label htmlFor="is_visible" className="text-xs font-semibold text-gray-700">Display Consignment publicly on site</label>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingConsignment(null)}
                  className="px-3 py-1.5 border text-xs font-bold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-secondary text-white text-xs font-bold rounded"
                >
                  Save Dispatch
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white border border-neutral-border rounded-xlarge overflow-hidden shadow-premium">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                    <th className="p-4">Showcase</th>
                    <th className="p-4">Cargo & Port</th>
                    <th className="p-4">Transit & Audits</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Visibility</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-600">
                  {consignments.map((c, idx) => (
                    <tr key={idx}>
                      <td className="p-4 w-20">
                        <img src={c.image} alt="" className="w-12 h-8 object-cover rounded border" />
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-primary block">{c.title}</span>
                        <span className="text-[10px] text-gray-400">Cargo: {c.cargo} • Destination: {c.destination}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold block">{c.transitTime}</span>
                        <span className="text-[10px] text-gray-400 block max-w-xs truncate" title={c.inspection}>{c.inspection}</span>
                      </td>
                      <td className="p-4 max-w-xs truncate" title={c.description}>{c.description}</td>
                      <td className="p-4">
                        {c.is_visible !== false ? (
                          <span className="text-green-600 font-bold">Public</span>
                        ) : (
                          <span className="text-gray-400 font-semibold">Hidden</span>
                        )}
                      </td>
                      <td className="p-4 flex items-center space-x-3 mt-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingConsignment({
                            idx,
                            id: c.id,
                            title: c.title || '',
                            cargo: c.cargo || '',
                            destination: c.destination || '',
                            transitTime: c.transitTime || '',
                            inspection: c.inspection || '',
                            image: c.image || '',
                            description: c.description || '',
                            is_visible: c.is_visible !== false
                          })}
                          className="text-primary hover:text-accent"
                          title="Edit consignment"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteConsignment(idx)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete consignment"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {consignments.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-gray-400 font-semibold italic">
                        No consignments configured yet. Click Add Consignment to create.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {subTab === 'faqs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-bold text-sm text-primary uppercase tracking-wider">Frequently Asked Trade Questions (FAQs)</h3>
            {!editingFaq && (
              <button
                type="button"
                onClick={() => setEditingFaq({ question: '', answer: '' })}
                className="flex items-center space-x-1.5 bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-2 px-4 rounded-large transition-colors shadow cursor-pointer"
              >
                <Plus size={14} />
                <span>Add FAQ</span>
              </button>
            )}
          </div>

          {editingFaq ? (
            <form onSubmit={handleSaveFaqItem} className="bg-white border border-neutral-border p-6 rounded-xlarge shadow-premium space-y-4">
              <h4 className="font-bold text-xs text-primary border-b pb-2">
                {editingFaq.idx !== undefined ? 'Edit FAQ Item' : 'Create FAQ Item'}
              </h4>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-1">Question Description</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 rounded border"
                  placeholder="e.g., What is the standard packaging container size?"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-1">Answer Description</label>
                <textarea
                  rows="4"
                  required
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 rounded border"
                  placeholder="Provide a detailed professional B2B answer..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="px-3 py-1.5 border text-xs font-bold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-secondary text-white text-xs font-bold rounded"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white border border-neutral-border rounded-xlarge overflow-hidden shadow-premium">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                    <th className="p-4">FAQ Question</th>
                    <th className="p-4">FAQ Answer Preview</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-600">
                  {faqs.map((f, idx) => (
                    <tr key={idx}>
                      <td className="p-4 font-bold text-primary max-w-sm">{f.question}</td>
                      <td className="p-4 max-w-md truncate text-gray-400" title={f.answer}>{f.answer}</td>
                      <td className="p-4 flex items-center space-x-3 mt-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingFaq({ idx, question: f.question, answer: f.answer })}
                          className="text-primary hover:text-accent"
                          title="Edit FAQ"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFaq(idx)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete FAQ"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {faqs.length === 0 && (
                    <tr>
                      <td colSpan="3" className="p-6 text-center text-gray-400 font-semibold italic">
                        No FAQs configured yet. Click Add FAQ to create.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {subTab === 'terms' && (
        <form onSubmit={handleSaveTerms} className="bg-white border border-neutral-border p-6 sm:p-8 rounded-xlarge shadow-premium space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-sans font-bold text-sm text-primary uppercase tracking-wider">Terms & Conditions of Export Page Config</h3>
            <label className="flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showTermsPage}
                onChange={(e) => setShowTermsPage(e.target.checked)}
                className="rounded text-primary focus:ring-0"
              />
              <span className="text-secondary-dark">Show Terms & Conditions Page on Website</span>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Effective Date / Trade Terms version</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. June 21, 2026"
                  value={termsEffectiveDate}
                  onChange={(e) => setTermsEffectiveDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Notice Banner (Optional alert text shown at top)</label>
                <input
                  type="text"
                  placeholder="e.g. All shipping transactions and contract orders are bound by these export conditions."
                  value={termsNotice}
                  onChange={(e) => setTermsNotice(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Terms & Conditions Body Content (Supports multi-line text)</label>
              <textarea
                rows="15"
                required
                placeholder="Write standard Incoterms, payment conditions, claims policies, inspection clauses, etc..."
                value={termsContent}
                onChange={(e) => setTermsContent(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary font-mono leading-relaxed"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSavingTerms || isSavedTerms}
              className="flex items-center space-x-1.5 bg-primary hover:bg-secondary text-white font-bold text-xs py-2 px-6 rounded-large shadow transition-all cursor-pointer disabled:opacity-80"
            >
              {isSavingTerms ? (
                <>
                  <RefreshCw className="animate-spin" size={14} />
                  <span>Saving...</span>
                </>
              ) : isSavedTerms ? (
                <>
                  <Check className="text-green-400" size={14} />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Terms Configurations</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function ImageUploader({ label, value, onChange, aspect = '4:3', isCompact = false, disableCrop = false }) {
  const [preview, setPreview] = React.useState(value || '');
  const [rawImage, setRawImage] = React.useState(null);
  const [showCropper, setShowCropper] = React.useState(false);

  React.useEffect(() => {
    setPreview(value || '');
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxLimit = disableCrop ? 8 * 1024 * 1024 : 2 * 1024 * 1024;
    if (file.size > maxLimit) {
      alert(`File is too large! Please choose an image smaller than ${disableCrop ? '8MB' : '2MB'}.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (disableCrop) {
        onChange(reader.result);
      } else {
        setRawImage(reader.result);
        setShowCropper(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview('');
    onChange('');
  };

  if (isCompact) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-2 text-center text-gray-500 hover:text-primary transition-all">
          <Upload size={18} className="text-gray-400 mb-1" />
          <span className="text-[10px] font-bold">Add Image</span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
            onClick={(e) => { e.target.value = null; }}
          />
        </label>
        {showCropper && (
          <ImageCropperModal
            src={rawImage}
            aspect={aspect}
            onCrop={(croppedData) => {
              onChange(croppedData);
              setShowCropper(false);
              setRawImage(null);
            }}
            onClose={() => {
              setShowCropper(false);
              setRawImage(null);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-gray-700">{label}</label>
      <div className="flex items-center space-x-3 bg-gray-50 p-2.5 rounded border border-gray-200">
        {preview ? (
          <div className="relative w-12 h-12 border rounded overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleClear}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors w-4 h-4 flex items-center justify-center text-[10px]"
              title="Remove image"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="w-12 h-12 border border-dashed rounded flex items-center justify-center bg-white text-gray-400 flex-shrink-0">
            <Upload size={16} className="text-gray-300" />
          </div>
        )}
        <div className="flex-grow">
          <label className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded shadow-sm text-[11px] font-bold text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
            <span>Choose Image</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
              onClick={(e) => { e.target.value = null; }}
            />
          </label>
          <span className="text-[9px] text-gray-400 block mt-0.5">PNG, JPG, JPEG up to 2MB</span>
        </div>
      </div>
      {showCropper && (
        <ImageCropperModal
          src={rawImage}
          aspect={aspect}
          onCrop={(croppedData) => {
            setPreview(croppedData);
            onChange(croppedData);
            setShowCropper(false);
            setRawImage(null);
          }}
          onClose={() => {
            setShowCropper(false);
            setRawImage(null);
          }}
        />
      )}
    </div>
  );
}

function ImageCropperModal({ src, aspect, onCrop, onClose }) {
  const [zoom, setZoom] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = React.useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = React.useState({ width: 0, height: 0 });
  
  const containerRef = React.useRef(null);
  const imgRef = React.useRef(null);

  const aspectRatios = {
    '1:1': { width: 280, height: 280, label: '1:1 Square' },
    '4:3': { width: 320, height: 240, label: '4:3 Standard' },
    '16:9': { width: 360, height: 202, label: '16:9 Wide' }
  };

  const currentAspect = aspectRatios[aspect] || aspectRatios['4:3'];

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setNaturalSize({ width: naturalWidth, height: naturalHeight });
    
    const container = containerRef.current;
    if (!container) return;
    const containerWidth = container.clientWidth || 400;
    const containerHeight = container.clientHeight || 320;
    
    const maxW = containerWidth * 0.9;
    const maxH = containerHeight * 0.9;
    
    const scale = Math.min(maxW / naturalWidth, maxH / naturalHeight);
    
    setDisplaySize({
      width: naturalWidth * scale,
      height: naturalHeight * scale
    });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleApply = () => {
    if (!naturalSize.width || !displaySize.width) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;
    const container = containerRef.current;
    if (!img || !container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    const cropWidth = currentAspect.width;
    const cropHeight = currentAspect.height;

    const renderedWidth = displaySize.width * zoom;
    const renderedHeight = displaySize.height * zoom;

    const imageLeft = (containerWidth - renderedWidth) / 2 + offset.x;
    const imageTop = (containerHeight - renderedHeight) / 2 + offset.y;

    const frameLeft = (containerWidth - cropWidth) / 2;
    const frameTop = (containerHeight - cropHeight) / 2;

    const xInImage = frameLeft - imageLeft;
    const yInImage = frameTop - imageTop;

    const sourceX = xInImage * (naturalSize.width / renderedWidth);
    const sourceY = yInImage * (naturalSize.height / renderedHeight);
    const sourceWidth = cropWidth * (naturalSize.width / renderedWidth);
    const sourceHeight = cropHeight * (naturalSize.height / renderedHeight);

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    try {
      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
      
      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.95);
      onCrop(croppedBase64);
    } catch (err) {
      console.error("Cropping failed:", err);
      onCrop(src);
    }
  };

  return (
    <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xlarge border border-neutral-border shadow-premium max-w-lg w-full overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h4 className="font-sans font-bold text-sm text-primary uppercase tracking-wider">Crop Image</h4>
          <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded font-extrabold">{currentAspect.label}</span>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center text-[10px] text-gray-400 font-semibold mb-2">
            Drag the image to position, use the slider below to zoom.
          </div>

          <div 
            ref={containerRef}
            className="relative h-[320px] bg-neutral-darkBg rounded border overflow-hidden flex items-center justify-center cursor-move select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            <img
              ref={imgRef}
              src={src}
              alt="Crop Source"
              onLoad={handleImageLoad}
              style={{
                width: displaySize.width ? `${displaySize.width}px` : 'auto',
                height: displaySize.height ? `${displaySize.height}px` : 'auto',
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                position: 'absolute',
                maxWidth: displaySize.width ? 'none' : '90%',
                maxHeight: displaySize.height ? 'none' : '90%',
                objectFit: displaySize.width ? 'fill' : 'contain',
                opacity: displaySize.width ? 1 : 0,
                pointerEvents: 'none'
              }}
              draggable="false"
            />

            <div 
              className="absolute pointer-events-none border-2 border-accent shadow-[0_0_0_9999px_rgba(13,44,84,0.6)]"
              style={{
                width: `${currentAspect.width}px`,
                height: `${currentAspect.height}px`,
                borderRadius: '4px'
              }}
            >
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-accent-dark"></div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-accent-dark"></div>
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-accent-dark"></div>
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-accent-dark"></div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-gray-500 font-bold">
              <span>Zoom Scale</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end space-x-2 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border text-xs font-bold rounded hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded hover:bg-secondary-light transition-colors"
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}
