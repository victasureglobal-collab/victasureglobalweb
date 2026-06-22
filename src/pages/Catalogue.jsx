import React, { useState } from 'react';
import { BookOpen, Download, ShieldCheck, CheckCircle2, ChevronRight, Award, Globe, Sparkles, Filter, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Catalogue({ onOpenDownloadModal }) {
  const { products, categories, settings } = useApp();
  const [selectedCat, setSelectedCat] = useState("all");

  const companyName = settings?.company_name || "VictaSure Global";

  // Filter products by selected category
  const filteredProducts = products.filter(p => {
    if (p.status !== 'published') return false;
    if (selectedCat === "all") return true;
    return p.category_id === selectedCat;
  });

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
                Eco-Conscious <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-light to-white">
                  Tableware Collection
                </span>
              </h1>
              <p className="text-xs sm:text-base text-gray-300 leading-relaxed font-sans">
                Browse our premium, export-compliant, certified biodegradable dinnerware crafted from naturally fallen areca leaves. Zero chemicals, 100% bio-based.
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
                <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                  Includes full dimension specifications, container load capacities, moisture-compliance details, and standard FOB price matrices.
                </p>
              </div>

              <button
                onClick={onOpenDownloadModal}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-gold hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] text-primary-dark font-extrabold text-xs py-3 rounded-large transition-all shadow-gold-glow cursor-pointer"
              >
                <Download size={14} className="stroke-[2.5]" />
                <span>Get B2B PDF Copy</span>
              </button>
            </div>

          </div>
        </div>

        {/* Global Certifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Compostable & Eco", desc: "100% naturally biodegradable palm leaves", icon: Leaf, border: "border-emerald-100 bg-emerald-50/20 text-emerald-700" },
            { title: "USDA Bio-Based", desc: "Certified chemical-free, food-safe grade", icon: ShieldCheck, border: "border-blue-100 bg-blue-50/20 text-blue-700" },
            { title: "Quality Accreditations", desc: "ISO 9001:2015 audited facility", icon: Award, border: "border-yellow-100 bg-yellow-50/20 text-yellow-700" },
            { title: "Integrated Logistics", desc: "Standardized bulk packaging & fast shipping", icon: Globe, border: "border-purple-100 bg-purple-50/20 text-purple-700" }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={`border p-6 rounded-xlarge shadow-sm flex items-start space-x-4 bg-white hover:shadow-md transition-shadow duration-200`}>
                <div className={`p-3 rounded-large ${item.border.split(' ')[1]} ${item.border.split(' ')[2]} flex-shrink-0`}>
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
            <button
              onClick={() => setSelectedCat("all")}
              className={`px-4 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                selectedCat === "all"
                  ? 'bg-primary border-primary text-white shadow'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Items ({products.filter(p => p.status === 'published').length})
            </button>
            {categories.map((c) => {
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
          </div>
        </div>

        {/* Products Showcase Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((p) => {
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
                  <h3 className="font-extrabold text-sm text-primary tracking-wide leading-tight group-hover:text-secondary transition-colors font-sans">
                    {p.name}
                  </h3>
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
                      <span className="text-sm font-extrabold text-secondary-dark mt-1 leading-none">
                        ₹{p.price_inr} <span className="text-[10px] text-gray-400 font-semibold">/ ${p.price_usd}</span>
                      </span>
                    </div>
                    <button
                      onClick={onOpenDownloadModal}
                      className="bg-primary hover:bg-secondary text-white text-[10px] font-extrabold py-2 px-3.5 rounded-large flex items-center space-x-1 cursor-pointer transition-all shadow-sm group-hover:shadow"
                    >
                      <span>Inquire Specs</span>
                      <ChevronRight size={10} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Beautiful bottom banner card */}
        <div className="relative overflow-hidden bg-gradient-navy-green text-white rounded-3xl shadow-xl p-8 sm:p-12 text-center border border-white/5 space-y-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <span className="bg-accent/20 text-accent-light text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full inline-block">
              Corporate & Wholesale
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-wide uppercase font-sans">
              Custom Molding & Molding Mockups
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              Need custom shapes, sizes, logo-embossed plates, or direct distribution arrangements? Download our full specifications catalogue to see guidelines and contact our wholesale trade team.
            </p>
          </div>

          <div className="relative z-10 pt-2">
            <button
              onClick={onOpenDownloadModal}
              className="inline-flex items-center space-x-2 bg-gradient-gold hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] text-primary-dark font-extrabold text-xs px-8 py-3.5 rounded-large shadow-gold-glow transition-all cursor-pointer"
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
