import React from 'react';
import { BookOpen, Download, ShieldCheck, CheckCircle2, ChevronRight, Award, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Catalogue({ onOpenDownloadModal }) {
  const { products, categories, settings } = useApp();

  // Group products by category
  const getProductsByCategory = (catId) => {
    return products.filter(p => p.category_id === catId && p.status === 'published');
  };

  return (
    <div className="flex-grow bg-neutral-lightBg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-primary text-white rounded-2xl border border-primary-light shadow-xl p-8 sm:p-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-bold uppercase text-accent tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full inline-block">
              Export Brochure 2026
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              B2B Product Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Explore our premium assortment of eco-friendly, organic areca leaf tableware, customized designs, and export-compliant biodegradable solutions.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={onOpenDownloadModal}
              className="flex items-center space-x-2 bg-secondary hover:bg-secondary-light hover:scale-105 active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-large transition-all shadow-md cursor-pointer"
            >
              <Download size={16} className="text-accent stroke-[2.5]" />
              <span>Download PDF Catalogue</span>
            </button>
          </div>
        </div>

        {/* Global Certifications / Selling Points */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "USDA Organic", desc: "100% bio-based palm leaf dinnerware", icon: ShieldCheck },
            { title: "ISO 9001:2015", desc: "Certified quality management standard", icon: Award },
            { title: "Global Shipping", desc: "Fast ocean freight & container logistics", icon: Globe },
            { title: "Eco Friendly", desc: "Compostable & naturally biodegradable", icon: CheckCircle2 }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white border border-neutral-border p-5 rounded-xlarge shadow-sm flex items-start space-x-3">
                <div className="bg-primary/5 p-2 rounded-large text-primary flex-shrink-0">
                  <Icon size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-primary">{item.title}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Categories Section */}
        <div className="space-y-12">
          {categories.map((cat) => {
            const catProducts = getProductsByCategory(cat.id);
            if (catProducts.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-6">
                
                {/* Category Header */}
                <div className="border-b border-gray-200 pb-3 flex justify-between items-baseline">
                  <div>
                    <h2 className="text-lg font-bold text-primary tracking-wide uppercase">{cat.name}</h2>
                    {cat.description && (
                      <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                    {catProducts.length} Products
                  </span>
                </div>

                {/* Category Products Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {catProducts.map((p) => (
                    <div key={p.id} className="bg-white border border-neutral-border rounded-xlarge overflow-hidden shadow-premium hover-lift flex flex-col justify-between">
                      <div>
                        {/* Image */}
                        <div className="relative aspect-[4/3] bg-gray-100 border-b border-gray-100 overflow-hidden">
                          {p.images && p.images[0] ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <BookOpen size={28} />
                            </div>
                          )}
                          <span className="absolute top-2 left-2 bg-primary/80 text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide font-sans">
                            {p.material || 'Areca Leaf'}
                          </span>
                        </div>

                        {/* Title & description */}
                        <div className="p-5 space-y-2">
                          <h3 className="font-bold text-sm text-primary tracking-wide leading-tight">{p.name}</h3>
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{p.short_description}</p>
                        </div>
                      </div>

                      {/* Details & Action */}
                      <div className="p-5 pt-0 space-y-3.5 border-t border-gray-50 mt-auto">
                        <div className="flex justify-between items-center text-xs text-gray-600 font-sans pt-3">
                          <span>MOQ: <strong>{p.moq || '10,000 Pcs'}</strong></span>
                          <span>Dimensions: <strong>{p.dimensions || 'Standard'}</strong></span>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50/50 p-2.5 rounded-large border border-gray-100">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">FOB Price</span>
                            <span className="text-sm font-extrabold text-secondary-dark mt-1 leading-none">₹{p.price_inr} <span className="text-[10px] text-gray-500 font-medium">/ ${p.price_usd}</span></span>
                          </div>
                          <button
                            onClick={onOpenDownloadModal}
                            className="bg-primary hover:bg-primary-light text-white text-[10px] font-bold py-1.5 px-3 rounded flex items-center space-x-1 cursor-pointer transition-all shadow-sm"
                          >
                            <span>Request Spec</span>
                            <ChevronRight size={10} />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer Brochure Request CTA */}
        <div className="bg-white border border-neutral-border rounded-2xl shadow-premium p-8 sm:p-10 text-center space-y-6">
          <BookOpen size={40} className="mx-auto text-accent stroke-[1.5]" />
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary uppercase">Request Custom Catalogue</h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Need custom branding, logos, special packaging, or custom shapes for your eco-friendly B2B supply? Download our full catalogue and get in touch with our designs team.
            </p>
          </div>
          <button
            onClick={onOpenDownloadModal}
            className="inline-flex items-center space-x-2 bg-secondary hover:bg-secondary-light hover:scale-105 active:scale-95 text-white font-bold text-xs px-6 py-3 rounded-large shadow transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Generate & Download Printable PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}
