import React, { useState } from 'react';
import { Eye, Send, Share2, Check, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProductCard({ product, onViewDetails, onRequestQuote }) {
  const { categories, settings, addToCart } = useApp();
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);

  const categoryName = categories.find(c => c.id === product.category_id)?.name || "Product";
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = (e) => {
    e.stopPropagation();
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

  return (
    <div className="bg-white rounded-xlarge overflow-hidden border border-neutral-border shadow-premium hover:shadow-premium-hover hover-lift flex flex-col h-full group">
      
      {/* Product Image Container */}
      <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
        <img
          src={product.images?.[0] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Category Label */}
        <span className="absolute top-3 left-3 bg-primary text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-large shadow-sm">
          {categoryName}
        </span>

        {/* Share Button (floating) */}
        <button
          onClick={handleShare}
          className="absolute top-3 right-3 p-2 bg-white/95 text-primary hover:text-accent rounded-full shadow-md hover:scale-110 transition-transform"
          title="Copy Link / Share Product"
        >
          {copied ? <Check size={14} className="text-secondary" /> : <Share2 size={14} />}
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <div className="flex flex-col">
              <h3 className="font-sans font-bold text-primary text-sm sm:text-base group-hover:text-secondary transition-colors line-clamp-1 pr-2">
                {product.name}
              </h3>
              {product.product_code && (
                <span className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">{product.product_code}</span>
              )}
            </div>
            {product.show_price !== false && product.price_inr ? (
              <div className="text-right flex-shrink-0 flex flex-col items-end leading-none mt-0.5">
                <span className="text-xs font-extrabold text-accent">₹{product.price_inr}</span>
                {product.price_usd && <span className="text-[9px] font-bold text-gray-400 mt-1">${product.price_usd}</span>}
              </div>
            ) : (
              <div className="text-right flex-shrink-0 flex flex-col items-end mt-0.5">
                <span className="text-[9px] font-extrabold text-accent uppercase bg-accent/10 px-1.5 py-0.5 rounded select-none">Inquire</span>
              </div>
            )}
          </div>
          
          {/* Specifications short list */}
          <div className="text-[11px] text-accent font-semibold mb-2 flex flex-wrap gap-x-2">
            {product.material && <span>• {product.material}</span>}
            {product.moq && <span>• MOQ: {product.moq}</span>}
          </div>

          <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-4">
            {product.short_description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          
          <button
            onClick={() => onViewDetails(product)}
            className="w-full flex items-center justify-center space-x-1.5 border border-primary hover:bg-primary-light text-primary hover:text-white font-semibold text-xs py-2 px-3 rounded-large transition-colors"
          >
            <Eye size={14} />
            <span>View Product Details</span>
          </button>

          <div className={settings?.enable_cart ? "grid grid-cols-2 gap-2" : "w-full"}>
            <button
              onClick={() => onRequestQuote(product)}
              className="w-full flex items-center justify-center space-x-1.5 bg-primary hover:bg-primary-light text-white font-semibold text-xs py-2 px-3 rounded-large transition-all"
            >
              <Send size={14} />
              <span>Submit Quotation Enquiry</span>
            </button>
            {settings?.enable_cart && (
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center space-x-1.5 bg-secondary hover:bg-secondary-light text-white font-semibold text-xs py-2 px-3 rounded-large transition-all"
              >
                {added ? <Check size={14} /> : <ShoppingBag size={14} />}
                <span>{added ? 'Added!' : 'Add to Cart'}</span>
              </button>
            )}
          </div>

        </div>
      </div>
      
    </div>
  );
}
