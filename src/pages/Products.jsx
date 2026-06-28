import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, X, Send, Share2, Check, ArrowRight, ShoppingBag, Plus, Minus, Box } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function Products({ selectedProduct, setSelectedProduct, setEnquiryProduct }) {
  const { products, categories, settings, addToCart } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalAdded, setModalAdded] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCatSlug, setSelectedCatSlug] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  
  const itemsPerPage = 8;

  // Deep linking logic for category filter and product details modal
  useEffect(() => {
    const catQuery = searchParams.get('category');
    if (catQuery) {
      setSelectedCatSlug(catQuery);
    } else {
      setSelectedCatSlug("all");
    }

    const prodIdQuery = searchParams.get('id');
    if (prodIdQuery && products.length > 0) {
      const target = products.find(p => p.id === prodIdQuery);
      if (target) {
        setSelectedProduct(target);
        setActiveImgIdx(0);
      }
    }
  }, [searchParams, products]);

  if (!settings) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Filter and sort items
  const filteredProducts = products
    .filter(p => p.status === 'published')
    .filter(p => {
      const cat = categories.find(c => c.id === p.category_id);
      if (cat && cat.is_visible === false) return false;

      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.material.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (selectedCatSlug === "all") {
        return matchSearch;
      } else {
        return matchSearch && p.category_id === cat?.id;
      }
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleCategorySelect = (slug) => {
    setSelectedCatSlug(slug);
    setCurrentPage(1);
    const params = {};
    if (slug !== "all") params.category = slug;
    setSearchParams(params);
  };

  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
    setModalAdded(false);
    setActiveImgIdx(0);
    setSearchParams({ id: product.id });
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
    const catQuery = searchParams.get('category');
    const params = {};
    if (catQuery) params.category = catQuery;
    setSearchParams(params);
  };

  const handleRequestQuote = (product) => {
    setEnquiryProduct(product);
    handleCloseProduct();
    navigate('/contact');
  };

  const handleModalAddToCart = () => {
    addToCart(selectedProduct, modalQuantity);
    setModalAdded(true);
    setTimeout(() => setModalAdded(false), 2000);
  };

  const handleShareProduct = (product) => {
    const url = `${window.location.origin}/products?id=${product.id}`;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.short_description,
        url: url
      }).catch(err => console.log('Share failed:', err));
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Related products logic for modal
  const getRelatedProducts = (activeProd) => {
    return products
      .filter(p => p.category_id === activeProd.category_id && p.id !== activeProd.id && p.status === 'published')
      .slice(0, 4);
  };

  const renderVideoPlayer = (url) => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
    if (ytMatch && ytMatch[1]) {
      const embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
      return (
        <div className="space-y-2 mt-4 border-t pt-4">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-primary">Product Video Walkthrough</span>
          <div className="aspect-video w-full rounded-xlarge overflow-hidden border shadow-sm bg-black">
            <iframe
              src={embedUrl}
              title="Product Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-2 mt-4 border-t pt-4">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-primary">Product Video Walkthrough</span>
        <div className="aspect-video w-full rounded-xlarge overflow-hidden border shadow-sm bg-black">
          <video 
            src={url} 
            controls 
            preload="metadata"
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-neutral-lightBg">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-5 pt-8 pb-4">
          <span className="text-xs font-bold uppercase text-accent tracking-widest bg-primary/10 px-4 py-1.5 rounded-full inline-block mb-1">
            Export Catalogue
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-primary tracking-tight leading-tight">
            Export Product Lineup
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xl mx-auto">
            All premium exports are eco-certified, moisture-controlled, and fumigated before sea freight delivery.
          </p>
        </div>

        {/* Filter controls */}
        <div className="bg-white border border-neutral-border p-5 rounded-xlarge shadow-premium space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            
            {/* Search Bar */}
            <div className="relative w-full md:flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by title, dimensions or material..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-11 pr-4 py-2.5 rounded-large border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full md:w-60 flex items-center space-x-2 border border-gray-300 rounded-large px-3 py-2 bg-white text-sm">
              <ArrowUpDown size={16} className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-700 font-semibold"
              >
                <option value="latest">Sort: Latest</option>
                <option value="alphabetical">Sort: Alphabetical</option>
              </select>
            </div>

          </div>

          {/* Categories Tab Filters */}
          <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-2">
            <button
              onClick={() => handleCategorySelect("all")}
              className={`px-4 py-2 text-xs font-bold rounded-large transition-all ${
                selectedCatSlug === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Categories
            </button>
            {categories.filter(cat => cat.is_visible !== false).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-4 py-2 text-xs font-bold rounded-large transition-all ${
                  selectedCatSlug === cat.slug
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <div key={product.id}>
                <ProductCard
                  product={product}
                  onViewDetails={handleOpenProduct}
                  onRequestQuote={handleRequestQuote}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white border border-neutral-border rounded-xlarge py-16 px-4 space-y-2">
            <Box size={36} className="mx-auto text-gray-300 mb-2 stroke-[1.5]" />
            <h3 className="font-bold text-lg text-primary">No products found</h3>
            <p className="text-xs text-gray-400">Try adjusting your filters or search keyword.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-3 pt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-large hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-bold text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-large hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>

      {/* --- PRODUCT DETAILS OVERLAY MODAL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-primary/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xlarge shadow-premium w-full max-w-4xl border border-neutral-border relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Close Button */}
            <button
              onClick={handleCloseProduct}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full text-gray-400 hover:text-gray-600 shadow-md border"
            >
              <X size={18} />
            </button>

            <div className="p-6 sm:p-10 space-y-8">
              
              {/* Product Info Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Images Gallery */}
                <div className="space-y-4">
                  <div className="aspect-[4/3] rounded-xlarge overflow-hidden bg-gray-100 border relative group">
                    <img
                      src={selectedProduct.images?.[activeImgIdx] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600"}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                    
                    {/* Navigation Arrows */}
                    {selectedProduct.images?.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setActiveImgIdx(prev => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-primary p-1.5 rounded-full shadow hover:scale-105 transition-all"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveImgIdx(prev => (prev + 1) % selectedProduct.images.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-primary p-1.5 rounded-full shadow hover:scale-105 transition-all"
                        >
                          <ChevronRight size={16} />
                        </button>
                        
                        {/* Slide Indicator Dots */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 bg-black/35 px-2.5 py-1 rounded-full">
                          {selectedProduct.images.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveImgIdx(idx)}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${
                                activeImgIdx === idx ? 'bg-white scale-125' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Small alternate thumbs */}
                  {selectedProduct.images?.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {selectedProduct.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImgIdx(idx)}
                          className={`aspect-square rounded-large overflow-hidden border-2 bg-gray-50 transition-all ${
                            activeImgIdx === idx ? 'border-accent shadow-md scale-95' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedProduct.video_url && renderVideoPlayer(selectedProduct.video_url)}
                </div>

                {/* Info details */}
                <div className="space-y-6">
                  <div>
                    <span className="bg-secondary/15 text-secondary text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-large">
                      {categories.find(c => c.id === selectedProduct.category_id)?.name || "Exporter Product"}
                    </span>
                    <div className="flex justify-between items-start mt-2">
                      <div className="flex flex-col">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary">
                          {selectedProduct.name}
                        </h2>
                        {selectedProduct.product_code && (
                          <span className="text-xs text-gray-400 font-bold uppercase mt-1">Product Code: {selectedProduct.product_code}</span>
                        )}
                      </div>
                      {selectedProduct.show_price !== false ? (
                        <div className="text-right">
                          <span className="text-lg font-bold text-accent block font-sans">₹{selectedProduct.price_inr || 400}</span>
                          <span className="text-xs font-semibold text-gray-400 block font-sans">${selectedProduct.price_usd || 5} USD</span>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="text-xs font-bold text-accent block uppercase bg-accent/10 px-2.5 py-1 rounded select-none">Pricing: Inquire</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {selectedProduct.detailed_description || selectedProduct.short_description}
                  </p>

                  {/* Core specifications grid */}
                  <div className="bg-neutral-lightBg border border-neutral-border p-4 rounded-large space-y-2 text-xs">
                    <div className="grid grid-cols-3 py-1 border-b border-gray-200">
                      <span className="font-semibold text-gray-500">Dimensions:</span>
                      <span className="col-span-2 text-primary font-bold">{selectedProduct.dimensions || "Standard"}</span>
                    </div>
                    <div className="grid grid-cols-3 py-1 border-b border-gray-200">
                      <span className="font-semibold text-gray-500">Material:</span>
                      <span className="col-span-2 text-primary font-bold">{selectedProduct.material || "Natural"}</span>
                    </div>
                    <div className="grid grid-cols-3 py-1 border-b border-gray-200">
                      <span className="font-semibold text-gray-500">Minimum Order (MOQ):</span>
                      <span className="col-span-2 text-primary font-bold">{selectedProduct.moq || "Contact Desk"}</span>
                    </div>
                    <div className="grid grid-cols-3 py-1">
                      <span className="font-semibold text-gray-500">Available In:</span>
                      <span className="col-span-2 text-primary font-bold">
                        {selectedProduct.country_availability?.join(", ") || "Global Ports"}
                      </span>
                    </div>
                  </div>

                  {/* Quote Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    
                    <button
                      onClick={() => handleRequestQuote(selectedProduct)}
                      className="flex-grow flex items-center justify-center space-x-2 bg-primary hover:bg-primary-light text-white font-bold text-xs py-3 px-6 rounded-large shadow-md transition-colors"
                    >
                      <Send size={14} />
                      <span>Request FOB Quotation</span>
                    </button>

                    <button
                      onClick={() => handleShareProduct(selectedProduct)}
                      className="p-3 border border-gray-300 rounded-large hover:bg-gray-100 hover:text-accent flex items-center justify-center"
                      title="Share link"
                    >
                      {copied ? <Check size={16} className="text-secondary" /> : <Share2 size={16} />}
                    </button>

                  </div>

                </div>

              </div>

              {/* Technical Specifications specifications JSON block */}
              {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <h3 className="font-bold text-base text-primary">Technical & Compliance Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {Object.entries(selectedProduct.specifications).map(([key, val]) => (
                      <div key={key} className="bg-gray-50 border p-3.5 rounded-large flex flex-col justify-between">
                        <span className="font-semibold text-gray-400 uppercase text-[10px] tracking-wider">{key}</span>
                        <span className="font-bold text-primary mt-1">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Products Section */}
              <div className="border-t border-gray-200 pt-8 space-y-4">
                <h3 className="font-bold text-lg text-primary">Related Export Products</h3>
                
                {getRelatedProducts(selectedProduct).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {getRelatedProducts(selectedProduct).map(rp => (
                      <div key={rp.id} className="scale-95 hover:scale-100 transition-all duration-300 border border-gray-200 bg-white p-3 rounded-xlarge">
                        <img src={rp.images?.[0]} alt="" className="aspect-video w-full object-cover rounded-large" />
                        <h4 className="font-bold text-primary mt-2 text-xs truncate">{rp.name}</h4>
                        <button
                          onClick={() => handleOpenProduct(rp)}
                          className="text-[10px] text-accent font-bold mt-1 flex items-center space-x-1 hover:underline"
                        >
                          <span>Quick View</span>
                          <ArrowRight size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No related products in this category.</p>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
