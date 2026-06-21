import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Cart() {
  const { cart, updateCartQuantity, removeFromCart } = useApp();
  const navigate = useNavigate();

  // Calculations
  const totalINR = cart.reduce((total, item) => total + (item.product.price_inr || 400) * item.quantity, 0);
  const totalUSD = cart.reduce((total, item) => total + (item.product.price_usd || 5) * item.quantity, 0);

  const handleQtyChange = (productId, currentQty, amount) => {
    updateCartQuantity(productId, currentQty + amount);
  };

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-neutral-lightBg space-y-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="space-y-5 pt-8 pb-4">
          <span className="text-xs font-bold uppercase text-accent tracking-widest bg-primary/10 px-4 py-1.5 rounded-full inline-block mb-1">
            Shopping Cart
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-primary tracking-tight leading-tight">
            Review Your Order
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xl">
            Configure your B2B consignment items and quantities before moving to secure checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white border border-neutral-border rounded-xlarge p-12 text-center space-y-6 shadow-premium max-w-xl mx-auto">
            <div className="p-4 bg-gray-50 rounded-full text-gray-400 w-16 h-16 flex items-center justify-center mx-auto">
              <ShoppingBag size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="font-sans font-bold text-primary text-lg">Your Cart is Empty</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                Browse our collections of fall-resistant, 100% biodegradable Areca Leaf plates, bowls, trays, and cutlery.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-light text-white font-bold text-xs py-3 px-6 rounded-large shadow transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const product = item.product;
                const itemTotalINR = (product.price_inr || 400) * item.quantity;
                const itemTotalUSD = (product.price_usd || 5) * item.quantity;

                return (
                  <div 
                    key={product.id}
                    className="bg-white border border-neutral-border p-4 sm:p-6 rounded-xlarge shadow-premium flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Product Image & Info */}
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 border border-gray-100 rounded-large overflow-hidden flex-shrink-0">
                        <img 
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-sans font-bold text-primary text-sm sm:text-base leading-tight">
                          {product.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">
                          MOQ: {product.moq || '10,000 Units'}
                        </p>
                        <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500 pt-0.5">
                          <span>Unit Price:</span>
                          <span className="text-accent">₹{product.price_inr || 400}</span>
                          <span className="text-gray-300">/</span>
                          <span className="text-gray-400">${product.price_usd || 5}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls & Totals */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:gap-8">
                      {/* Plus/Minus */}
                      <div className="flex items-center border border-gray-200 rounded-large bg-gray-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(product.id, item.quantity, -1)}
                          className="p-2 text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors focus:outline-none"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-xs font-bold text-primary w-8 text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(product.id, item.quantity, 1)}
                          className="p-2 text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors focus:outline-none"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Item Subtotals */}
                      <div className="text-right min-w-[70px] sm:min-w-[90px]">
                        <div className="text-sm font-extrabold text-primary">₹{itemTotalINR.toLocaleString()}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-0.5">${itemTotalUSD.toLocaleString()}</div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors focus:outline-none hover:bg-red-50/50 rounded-full"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Order Summary Sidebar */}
            <div className="bg-white border border-neutral-border rounded-xlarge p-6 shadow-premium space-y-6">
              <h3 className="font-sans font-bold text-primary text-base border-b border-gray-100 pb-3">
                Order Summary
              </h3>

              <div className="space-y-3.5 text-xs text-gray-500">
                <div className="flex justify-between items-center">
                  <span>Subtotal (Rupees)</span>
                  <span className="font-bold text-primary">₹{totalINR.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Subtotal (Dollars)</span>
                  <span className="font-bold text-primary">${totalUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-start pt-1.5 border-t border-gray-100">
                  <div>
                    <span>Shipping Charges</span>
                    <span className="block text-[10px] text-gray-400">Estimated FOB Ocean Freight</span>
                  </div>
                  <span className="font-extrabold text-secondary">Free Shipping</span>
                </div>
              </div>

              {/* Total display box */}
              <div className="bg-primary text-white p-4 rounded-large space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-gray-300">Total Price (INR)</span>
                  <span className="text-base font-extrabold text-accent">₹{totalINR.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-1.5 mt-1.5">
                  <span className="text-[10px] uppercase font-bold text-gray-300">Total Price (USD)</span>
                  <span className="text-sm font-extrabold text-white">${totalUSD.toLocaleString()}</span>
                </div>
              </div>

              {/* B2B Logistics Note */}
              <div className="bg-amber-50/60 border border-amber-100 p-3.5 rounded-large text-[10px] text-amber-800 leading-relaxed">
                <strong>B2B Logistics Note:</strong> Customs clearance audits, fumigation, phytosanitary certifications, and bill of lading documents will be generated dynamically upon checking out.
              </div>

              {/* Proceed Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center space-x-2 bg-secondary hover:bg-secondary-light text-white font-bold text-sm py-3 rounded-large transition-all shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>

              {/* Continue shopping link */}
              <div className="text-center">
                <Link 
                  to="/products" 
                  className="text-xs font-bold text-gray-500 hover:text-primary transition-colors underline"
                >
                  Continue Shopping
                </Link>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
