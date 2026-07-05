import React, { useState } from 'react';
import { BookOpen, Download, ShieldCheck, CheckCircle2, ChevronRight, Award, Globe, Sparkles, Filter, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TabsSkeleton, ProductGridSkeleton } from '../components/Skeletons';

export default function Catalogue({ onOpenDownloadModal }) {
  const { products, categories, settings, loading } = useApp();
  const [selectedCat, setSelectedCat] = useState("all");

  const companyName = settings?.company_name || "VictaSure Global";
  const isLoading = loading || !settings;

  // Filter products by selected category
  const filteredProducts = products.filter(p => {
    if (p.status !== 'published') return false;
    const cat = categories.find(c => c.id === p.category_id || c.name === p.category_id);
    if (cat && cat.is_visible === false) return false;
    if (selectedCat === "all") return true;
    return p.category_id === selectedCat || (cat && cat.id === selectedCat);
  })
  .sort((a, b) => {
    const orderA = Number(a.display_order) || 0;
    const orderB = Number(b.display_order) || 0;
    if (orderA !== orderB) return orderA - orderB;
    return a.name.localeCompare(b.name);
  });

  const getGroupedByCategories = (productList) => {
    const sortedCategories = [...categories]
      .filter(cat => cat.is_visible !== false)
      .sort((a, b) => {
        const orderA = Number(a.display_order) || 0;
        const orderB = Number(b.display_order) || 0;
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      });

    const groups = [];
    sortedCategories.forEach(cat => {
      const catProducts = productList.filter(p => p.category_id === cat.id || p.category_id === cat.name);
      if (catProducts.length > 0) {
        groups.push({
          categoryName: cat.name,
          products: catProducts
        });
      }
    });

    const orphanedProducts = productList.filter(p => !categories.some(cat => (cat.id === p.category_id || cat.name === p.category_id) && cat.is_visible !== false));
    if (orphanedProducts.length > 0) {
      groups.push({
        categoryName: "Other Products",
        products: orphanedProducts
      });
    }

    return groups;
  };

  return (
    <div className="flex-grow bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Editorial Premium Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-light to-[#133e70] text-white rounded-3xl shadow-2xl border border-primary-light/40">
          
          {/* Subtle eco background decoration */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 p-8 sm:p-14 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Header Text */}
            <div className="space-y-6 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent-light px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
                <Sparkles size={12} className="animate-pulse" />
                <span>B2B Global Trade Catalog • 2026</span>
              </div>
              <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight leading-tight font-sans text-white">
                Explore Our <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-light to-white">
                  Eco-conscious Products
                </span>
              </h1>
              <p className="text-xs sm:text-base text-gray-300 leading-relaxed font-sans">
                Browse our premium, export-compliant and high quality value added products.
              </p>
            </div>

            {/* Catalog Mockup / CTA Cover */}
            <div className="w-full sm:w-80 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between space-y-6 relative group hover:border-accent/40 transition-all duration-300">
              <div className="absolute top-3 right-3 bg-secondary text-white font-extrabold text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                <Leaf size={8} />
                <span>Green Grade</span>
              </div>
              
              <div className="space-y-3 pt-2">
                <span className="text-accent text-[9px] font-extrabold uppercase tracking-widest block">{companyName}</span>
                <h3 className="text-white font-extrabold text-lg leading-tight tracking-wide font-sans">
                  Print-Ready <br/>Brochure Specification Sheets
                </h3>
                <p className="text-[10px] text-slate-200 leading-relaxed font-sans font-medium">
                  Includes full dimension specifications, container load capacities, moisture-compliance details, and standard FOB price matrices.
                </p>
              </div>

              <button
                onClick={onOpenDownloadModal}
                className="w-full flex items-center justify-center space-x-2 bg-white text-primary hover:bg-slate-50 font-bold text-xs py-3 rounded-large transition-all shadow cursor-pointer"
              >
                <Download size={14} className="stroke-[2.5]" />
                <span>Download Brochure</span>
              </button>
            </div>

          </div>
        </div>

        {/* Global Certifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(settings?.catalogue_badges && settings.catalogue_badges.length === 4
            ? settings.catalogue_badges
            : [
                { title: "Compostable & Eco", desc: "100% naturally biodegradable palm leaves", icon: "Leaf" },
                { title: "USDA Bio-Based", desc: "Certified chemical-free, food-safe grade", icon: "ShieldCheck" },
                { title: "Quality Accreditations", desc: "ISO 9001:2015 audited facility", icon: "Award" },
                { title: "Integrated Logistics", desc: "Standardized bulk packaging & fast shipping", icon: "Globe" }
              ]
          ).map((item, idx) => {
            const LucideIconMap = { Leaf, ShieldCheck, Award, Globe, Sparkles, Filter, BookOpen };
            const Icon = LucideIconMap[item.icon] || Leaf;
            
            const getBadgeStyles = (iconName) => {
              switch (iconName) {
                case "Leaf": return "border-emerald-100 bg-emerald-50/20 text-emerald-700";
                case "ShieldCheck": return "border-blue-100 bg-blue-50/20 text-blue-700";
                case "Award": return "border-yellow-100 bg-yellow-50/20 text-yellow-700";
                case "Globe": return "border-purple-100 bg-purple-50/20 text-purple-700";
                default: return "border-slate-100 bg-slate-50/20 text-slate-700";
              }
            };
            const borderStyle = getBadgeStyles(item.icon);

            return (
              <div key={idx} className={`border p-6 rounded-xlarge shadow-sm flex items-start space-x-4 bg-white hover:shadow-md transition-shadow duration-200`}>
                <div className={`p-3 rounded-large ${borderStyle.split(' ')[1]} ${borderStyle.split(' ')[2]} flex-shrink-0`}>
                  <Icon size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-primary tracking-wide uppercase">{item.title}</h3>
                  <p className="text-[11px] text-gray-500 leading-snug">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Categories Navigation Filter */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <Filter size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Filter Category Taxonomy</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {isLoading ? (
              <TabsSkeleton />
            ) : (
              <>
                <button
                  onClick={() => setSelectedCat("all")}
                  className={`px-4 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                    selectedCat === "all"
                      ? 'bg-primary border-primary text-white shadow'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Items ({products.filter(p => {
                    if (p.status !== 'published') return false;
                    const cat = categories.find(c => c.id === p.category_id);
                    return !cat || cat.is_visible !== false;
                  }).length})
                </button>
                {categories.filter(c => c.is_visible !== false).map((c) => {
                  const count = products.filter(p => p.category_id === c.id && p.status === 'published').length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCat(c.id)}
                      className={`px-4 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                        selectedCat === c.id
                          ? 'bg-primary border-primary text-white shadow'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {c.name} ({count})
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Products Showcase Layout */}
        {isLoading ? (
          <ProductGridSkeleton count={8} gridClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" />
        ) : (
          <div className="space-y-12">
            {getGroupedByCategories(filteredProducts).map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-6">
                <div className="flex items-center space-x-3 pt-4 pb-1 border-b border-gray-100">
                  <div className="h-6 w-1 bg-primary rounded-full"></div>
                  <h3 className="text-xs font-extrabold text-primary tracking-wider uppercase bg-primary/5 px-3 py-1.5 rounded-large border border-primary-light/10">
                    {group.categoryName}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {group.products.map((p) => {
                    const catName = categories.find(c => c.id === p.category_id)?.name || "Tableware";
                    return (
                      <div key={p.id} className="bg-white border border-neutral-border rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between relative group">
                        
                        {/* Image Section */}
                        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden border-b border-gray-100 flex items-center justify-center">
                          {p.images && p.images[0] ? (
                            <img 
                              src={p.images[0]} 
                              alt={p.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                          ) : (
                            <div className="text-gray-300">
                              <BookOpen size={32} />
                            </div>
                          )}
                          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-[8px] font-extrabold uppercase px-2 py-0.5 rounded border border-gray-100 shadow-sm font-sans tracking-wide">
                            {catName}
                          </span>
                          
                          {/* Small eco pill */}
                          <span className="absolute bottom-3 right-3 bg-secondary text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center space-x-0.5 shadow-sm">
                            <Leaf size={8} />
                            <span>Bio-fallen</span>
                          </span>
                        </div>

                        {/* Info Text */}
                        <div className="p-6 space-y-3.5 flex-grow">
                          <div className="flex flex-col">
                            <h3 className="font-extrabold text-sm text-primary tracking-wide leading-tight group-hover:text-secondary transition-colors font-sans">
                              {p.name}
                            </h3>
                            {p.product_code && (
                              <span className="text-[9px] text-gray-400 font-semibold uppercase mt-0.5">{p.product_code}</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                            {p.short_description}
                          </p>

                          {/* Specifications details list */}
                          <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-y-2 gap-x-1 text-[10px] text-gray-600 font-sans">
                            <div>Material: <strong className="text-primary font-bold">{p.material || 'Palm Leaf'}</strong></div>
                            <div>Dimensions: <strong className="text-primary font-bold">{p.dimensions || 'Custom'}</strong></div>
                            <div>MOQ: <strong className="text-primary font-bold">{p.moq || '5,000 Pcs'}</strong></div>
                            <div>Availability: <strong className="text-primary font-bold">Global</strong></div>
                          </div>
                        </div>

                        {/* Action CTA Bar */}
                        <div className="p-6 pt-0 mt-auto">
                          <div className="bg-slate-50 border border-gray-100 p-3 rounded-xlarge flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest leading-none">FOB Rate</span>
                              {p.show_price !== false ? (
                                <span className="text-sm font-extrabold text-secondary-dark mt-1 leading-none">
                                  ₹{p.price_inr} <span className="text-[10px] text-gray-400 font-semibold">/ ${p.price_usd}</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-extrabold text-accent mt-1 uppercase leading-none bg-accent/10 px-1.5 py-0.5 rounded select-none">Inquire</span>
                              )}
                            </div>
                            <button
                              onClick={() => onOpenDownloadModal(p)}
                              className="bg-primary hover:bg-secondary text-white text-[10px] font-extrabold py-2 px-3.5 rounded-large flex items-center space-x-1 cursor-pointer transition-all shadow-sm group-hover:shadow"
                            >
                              <span>Download Catalogue</span>
                              <ChevronRight size={10} />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) }

        {/* Beautiful bottom banner card */}
        <div className="relative overflow-hidden gradient-navy-green text-white rounded-3xl shadow-xl p-8 sm:p-12 text-center border border-white/5 space-y-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <span className="bg-accent/20 text-accent-light text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full inline-block">
              Corporate & Wholesale
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-wide uppercase font-sans">
              Custom Molding & Molding Mockups
            </h2>
            <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
              Need custom shapes, sizes, logo-embossed plates, or direct distribution arrangements? Download our full specifications catalogue to see guidelines and contact our wholesale trade team.
            </p>
          </div>

          <div className="relative z-10 pt-2">
            <button
              onClick={onOpenDownloadModal}
              className="inline-flex items-center space-x-2 bg-white text-primary hover:bg-slate-50 font-bold text-xs px-8 py-3.5 rounded-large shadow transition-all cursor-pointer"
            >
              <Download size={14} className="stroke-[2.5]" />
              <span>Generate Printable Catalogue PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
