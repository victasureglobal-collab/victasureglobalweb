import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, PackageCheck, ShieldCheck, RefreshCw, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Checkout() {
  const { cart, placeOrder, currentUser } = useApp();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isPlacedOrder, setIsPlacedOrder] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: currentUser ? {
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      company_name: currentUser.company || '',
      country: currentUser.country || '',
      state: currentUser.state || '',
      address: currentUser.address || '',
      pincode: currentUser.pincode || '',
    } : {}
  });

  const countryDialCodes = {
    "Australia": "+61",
    "Austria": "+43",
    "Bahrain": "+973",
    "Bangladesh": "+880",
    "Belgium": "+32",
    "Brazil": "+55",
    "Canada": "+1",
    "Denmark": "+45",
    "Egypt": "+20",
    "France": "+33",
    "Germany": "+49",
    "India": "+91",
    "Indonesia": "+62",
    "Ireland": "+353",
    "Italy": "+39",
    "Japan": "+81",
    "Kuwait": "+965",
    "Malaysia": "+60",
    "Mexico": "+52",
    "Netherlands": "+31",
    "New Zealand": "+64",
    "Oman": "+968",
    "Philippines": "+63",
    "Poland": "+48",
    "Qatar": "+974",
    "Saudi Arabia": "+966",
    "Singapore": "+65",
    "South Africa": "+27",
    "South Korea": "+82",
    "Spain": "+34",
    "Sweden": "+46",
    "Switzerland": "+41",
    "Thailand": "+66",
    "Turkey": "+90",
    "United Arab Emirates": "+971",
    "United Kingdom": "+44",
    "United States": "+1",
    "Vietnam": "+84"
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const dialCode = countryDialCodes[selectedCountry];
    if (dialCode) {
      const currentPhone = watch("phone") || "";
      if (!currentPhone || currentPhone.trim() === "" || Object.values(countryDialCodes).some(code => currentPhone.trim() === code)) {
        setValue("phone", dialCode + " ");
      } else {
        const matchingPrevCode = Object.values(countryDialCodes).find(code => currentPhone.startsWith(code));
        if (matchingPrevCode) {
          setValue("phone", currentPhone.replace(matchingPrevCode, dialCode));
        } else if (!currentPhone.startsWith("+")) {
          setValue("phone", dialCode + " " + currentPhone);
        }
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] py-12 px-4 bg-neutral-lightBg flex flex-col justify-center items-center text-center">
        <div className="space-y-4 max-w-sm bg-white border border-neutral-border p-8 rounded-xlarge shadow-premium">
          <ShieldCheck size={48} className="mx-auto text-accent animate-pulse" />
          <h2 className="text-xl font-bold text-primary">B2B Account Required</h2>
          <p className="text-xs text-gray-500">Importers must log in or create a B2B trade account to request cargo purchase orders.</p>
          <div className="flex flex-col space-y-2 pt-2">
            <Link to="/login?redirect=/checkout" className="inline-block bg-primary hover:bg-secondary text-white text-xs font-bold py-2.5 px-6 rounded-large transition-all cursor-pointer">
              Login / Create Account
            </Link>
            <Link to="/cart" className="text-xs text-gray-500 font-semibold hover:underline">
              Back to Shopping Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculations
  const totalINR = cart.reduce((total, item) => total + (item.product.price_inr || 400) * item.quantity, 0);
  const totalUSD = cart.reduce((total, item) => total + (item.product.price_usd || 5) * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="flex-grow py-12 px-4 bg-neutral-lightBg flex flex-col justify-center items-center text-center">
        <div className="space-y-4 max-w-sm">
          <h2 className="text-xl font-bold text-primary">No Items to Check Out</h2>
          <p className="text-xs text-gray-500">Your cart is empty. Please add some products before checking out.</p>
          <Link to="/products" className="inline-block bg-primary text-white text-xs font-bold py-2.5 px-6 rounded-large">
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      const orderItems = cart.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price_inr: item.product.price_inr || 400,
        price_usd: item.product.price_usd || 5
      }));

      const orderData = {
        user_id: currentUser?.id || null,
        customer_name: data.name,
        email: data.email,
        phone: data.phone,
        company_name: data.company_name,
        country: data.country,
        state: data.state,
        address: data.address,
        pincode: data.pincode,
        delivery_port: data.delivery_port,
        notes: data.notes,
        items: orderItems,
        total_inr: totalINR,
        total_usd: totalUSD
      };

      setIsPlacingOrder(true);
      const placed = await placeOrder(orderData);
      setIsPlacedOrder(true);
      setTimeout(() => {
        navigate(`/order-success/${placed.id}`);
      }, 1200);
    } catch (err) {
      console.error(err);
      alert("Failed to place your order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-neutral-lightBg space-y-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="space-y-5 pt-8 pb-4">
          <Link to="/cart" className="inline-flex items-center space-x-1.5 text-xs text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft size={14} />
            <span>Back to Cart</span>
          </Link>
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-accent tracking-widest bg-primary/10 px-4 py-1.5 rounded-full inline-block mb-1">
              Checkout
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-primary tracking-tight leading-tight">
              Shipping & B2B Logistics
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Checkout Details Form */}
          <div className="lg:col-span-2 bg-white border border-neutral-border rounded-xlarge p-6 sm:p-8 shadow-premium space-y-6">
            <h3 className="font-sans font-bold text-primary text-base border-b border-gray-100 pb-3">
              Shipping Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="John Miller"
                  className={`w-full text-sm px-4 py-2.5 rounded-large border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.name.message}</span>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Business Email *</label>
                <input
                  type="email"
                  placeholder="miller@company.com"
                  className={`w-full text-sm px-4 py-2.5 rounded-large border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                  {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                />
                {errors.email && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.email.message}</span>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+49 170 1234567"
                  className={`w-full text-sm px-4 py-2.5 rounded-large border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                  {...register("phone", { required: "Phone is required" })}
                />
                {errors.phone && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.phone.message}</span>}
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  placeholder="EcoTableware GmbH"
                  className={`w-full text-sm px-4 py-2.5 rounded-large border ${errors.company_name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                  {...register("company_name", { required: "Company name is required" })}
                />
                {errors.company_name && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.company_name.message}</span>}
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Country *</label>
                <select
                  className={`w-full text-sm px-4 py-2.5 rounded-large border bg-white ${errors.country ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                  {...register("country", { 
                    required: "Country is required",
                    onChange: handleCountryChange
                  })}
                >
                  <option value="">Select country...</option>
                  {["Australia", "Austria", "Bahrain", "Bangladesh", "Belgium", "Brazil", "Canada", "Denmark", "Egypt", "France", "Germany", "India", "Indonesia", "Ireland", "Italy", "Japan", "Kuwait", "Malaysia", "Mexico", "Netherlands", "New Zealand", "Oman", "Philippines", "Poland", "Qatar", "Saudi Arabia", "Singapore", "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", "Thailand", "Turkey", "United Arab Emirates", "United Kingdom", "United States", "Vietnam", "Other"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.country && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.country.message}</span>}
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">State / Region *</label>
                <input
                  type="text"
                  placeholder="Bavaria"
                  className={`w-full text-sm px-4 py-2.5 rounded-large border ${errors.state ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                  {...register("state", { required: "State is required" })}
                />
                {errors.state && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.state.message}</span>}
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode / ZIP Code *</label>
                <input
                  type="text"
                  placeholder="81541"
                  className={`w-full text-sm px-4 py-2.5 rounded-large border ${errors.pincode ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                  {...register("pincode", { required: "Pincode is required" })}
                />
                {errors.pincode && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.pincode.message}</span>}
              </div>

              {/* Delivery Port */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Target Delivery Port *</label>
                <input
                  type="text"
                  placeholder="Port of Hamburg"
                  className={`w-full text-sm px-4 py-2.5 rounded-large border ${errors.delivery_port ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                  {...register("delivery_port", { required: "Delivery port is required" })}
                />
                {errors.delivery_port && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.delivery_port.message}</span>}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Shipping Address *</label>
              <textarea
                rows="3"
                placeholder="Street address, building, floor details..."
                className={`w-full text-sm px-4 py-2.5 rounded-large border ${errors.address ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                {...register("address", { required: "Address is required" })}
              ></textarea>
              {errors.address && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.address.message}</span>}
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Custom Packaging Notes / Comments</label>
              <textarea
                rows="2"
                placeholder="Embossed branding, specific moisture level verification requests..."
                className="w-full text-sm px-4 py-2.5 rounded-large border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register("notes")}
              ></textarea>
            </div>

          </div>

          {/* Checkout Right Side Panel */}
          <div className="space-y-6">
            
            {/* Order Review List */}
            <div className="bg-white border border-neutral-border rounded-xlarge p-6 shadow-premium space-y-4">
              <h3 className="font-sans font-bold text-primary text-sm border-b border-gray-100 pb-2">
                Order Items ({cart.length})
              </h3>
              
              <div className="space-y-3 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center text-xs gap-3">
                    <div className="truncate">
                      <div className="font-bold text-primary truncate">{item.product.name}</div>
                      <div className="text-[10px] text-gray-400">Qty: {item.quantity} units</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-bold text-primary">₹{((item.product.price_inr || 400) * item.quantity).toLocaleString()}</span>
                      <span className="block text-[9px] text-gray-400">${((item.product.price_usd || 5) * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary totals */}
              <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Subtotal (INR)</span>
                  <span className="font-semibold text-primary">₹{totalINR.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>Subtotal (USD)</span>
                  <span className="font-semibold text-primary">${totalUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="font-bold text-primary">Order Total</span>
                  <div className="text-right">
                    <span className="font-extrabold text-accent block">₹{totalINR.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-gray-400">${totalUSD.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* B2B Trust Badge */}
            <div className="bg-[#F9FAFB] border border-neutral-border rounded-xlarge p-6 shadow-premium space-y-4">
              <div className="flex items-center space-x-2 text-secondary font-bold text-xs">
                <ShieldCheck size={16} />
                <span>VictaSure Trade Assurance</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                By clicking "Place Purchase Order", your B2B order will be logged directly into our system. Our logistics team will inspect moisture levels and coordinate containers with custom certificates.
              </p>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isPlacingOrder || isPlacedOrder}
                className="w-full flex items-center justify-center space-x-2 bg-secondary hover:bg-secondary-light text-white font-bold text-sm py-3 rounded-large transition-all shadow-md mt-2 disabled:opacity-75 cursor-pointer"
              >
                {isPlacingOrder ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    <span>Placing Order...</span>
                  </>
                ) : isPlacedOrder ? (
                  <>
                    <Check className="text-green-400" size={16} />
                    <span>Order Placed!</span>
                  </>
                ) : (
                  <>
                    <PackageCheck size={16} />
                    <span>Place Purchase Order</span>
                  </>
                )}
              </button>

              {/* Pay terms description */}
              <div className="flex items-center justify-center space-x-1.5 text-[9px] text-gray-400">
                <CreditCard size={12} />
                <span>Pay Terms: FOB 30/70 Letter of Credit / TT</span>
              </div>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
