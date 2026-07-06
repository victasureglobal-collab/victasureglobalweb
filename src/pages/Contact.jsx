import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, AlertCircle, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const WhatsappIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.008c6.56 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const PinterestIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.41 7.61 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.715-.359-1.774c0-1.66 1.054-2.9 2.146-2.9 1.01 0 1.498.758 1.498 1.668 0 1.014-.647 2.533-.98 3.94-.279 1.179.605 2.141 1.767 2.141 2.122 0 3.754-2.24 3.754-5.474 0-2.862-2.057-4.864-4.996-4.864-3.403 0-5.4 2.553-5.4 5.19 0 1.026.395 2.13 1.01 2.876.111.135.127.253.084.426-.093.387-.3.12-.4-.486-.33-1.36-.612-2.127-.612-3.42 0-3.136 2.278-6.015 6.568-6.015 3.456 0 6.143 2.463 6.143 5.758 0 3.434-2.165 6.198-5.17 6.198-1.009 0-1.959-.524-2.283-1.144l-.622 2.373c-.225.864-.833 1.948-1.24 2.607a12.008 12.008 0 003.743.593C18.622 24 24 18.631 24 12.012 24 5.39 18.622 0 12.017 0z"/>
  </svg>
);

const TiktokIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.52-4.06-1.37-.28-.2-.55-.41-.8-.65-.01 2.92.01 5.84-.02 8.76-.18 3.59-2.43 6.84-5.94 7.74-3.71.95-8.03-1.02-9.45-4.57-1.42-3.56.09-8.15 3.66-9.74 1.7-.76 3.73-.79 5.43-.07v4.09c-1.08-.47-2.34-.39-3.32.22-1.12.69-1.74 2-1.57 3.32.18 1.44 1.4 2.58 2.84 2.52 1.48-.06 2.62-1.31 2.62-2.8V0z"/>
  </svg>
);

const SocialIconMap = {
  Facebook: FacebookIcon,
  Twitter: TwitterIcon,
  Linkedin: LinkedinIcon,
  Instagram: InstagramIcon,
  Youtube: YoutubeIcon,
  WhatsApp: WhatsappIcon,
  Pinterest: PinterestIcon,
  TikTok: TiktokIcon,
  Globe: Globe
};

const countryDialCodes = {
  "Australia": "+61 ",
  "Austria": "+43 ",
  "Bahrain": "+973 ",
  "Bangladesh": "+880 ",
  "Belgium": "+32 ",
  "Brazil": "+55 ",
  "Canada": "+1 ",
  "Denmark": "+45 ",
  "Egypt": "+20 ",
  "France": "+33 ",
  "Germany": "+49 ",
  "India": "+91 ",
  "Indonesia": "+62 ",
  "Ireland": "+353 ",
  "Italy": "+39 ",
  "Japan": "+81 ",
  "Kuwait": "+965 ",
  "Malaysia": "+60 ",
  "Mexico": "+52 ",
  "Netherlands": "+31 ",
  "New Zealand": "+64 ",
  "Oman": "+968 ",
  "Philippines": "+63 ",
  "Poland": "+48 ",
  "Qatar": "+974 ",
  "Saudi Arabia": "+966 ",
  "Singapore": "+65 ",
  "South Africa": "+27 ",
  "South Korea": "+82 ",
  "Spain": "+34 ",
  "Sweden": "+46 ",
  "Switzerland": "+41 ",
  "Thailand": "+66 ",
  "Turkey": "+90 ",
  "United Arab Emirates": "+971 ",
  "United Kingdom": "+44 ",
  "United States": "+1 ",
  "Vietnam": "+84 ",
  "Other": "+"
};

export default function Contact({ enquiryProduct, setEnquiryProduct }) {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      product_interested: enquiryProduct ? enquiryProduct.name : ""
    }
  });

  const { submitEnquiry, settings, products } = useApp();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const selectedCountry = watch("country");
  const selectedProduct = watch("product_interested");
  const matchingProduct = products?.find(p => p.name === selectedProduct);
  const qtyUnit = matchingProduct?.qty_unit || "";

  React.useEffect(() => {
    if (selectedCountry) {
      const dialCode = countryDialCodes[selectedCountry] || "";
      if (dialCode) {
        setValue("phone", dialCode);
      }
    }
  }, [selectedCountry, setValue]);

  if (!settings) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      setSuccess(false);
      setErrorMsg("");
      await submitEnquiry(data);
      setSuccess(true);
      setEnquiryProduct(null); // Clear interest state
      reset();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to submit enquiry. Please verify connections and try again.");
    }
  };

  const handleWhatsApp = () => {
    const whatsapp = settings.contact_whatsapp || "+918390900120";
    const text = encodeURIComponent("Hello Victasure Trade Desk, I want to submit an enquiry for bulk order.");
    window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-neutral-lightBg">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5 pt-8 pb-4">
          <span className="text-xs font-bold uppercase text-accent tracking-widest bg-primary/10 px-4 py-1.5 rounded-full inline-block mb-1">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-primary tracking-tight leading-tight">
            Import Enquiry Desk
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xl mx-auto">
            Reach out directly for quotation requests, custom designs, container logistics schedules, and product specification sheets.
          </p>
        </div>

        {/* Form and info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Info Cards */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Quick Card */}
            <div className="bg-white border border-neutral-border p-6 rounded-xlarge shadow-premium space-y-4">
              <h3 className="font-bold text-lg text-primary">Trading Office</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-xs text-gray-600">
                  <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <span>{settings.contact_address}</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-gray-600">
                  <Phone size={16} className="text-accent flex-shrink-0" />
                  <span>{settings.contact_phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-gray-600">
                  <Mail size={16} className="text-accent flex-shrink-0" />
                  <a href={`mailto:${settings.contact_email}`} className="hover:underline">{settings.contact_email}</a>
                </div>
              </div>

              {/* Social media connections */}
              {settings.socials && settings.socials.length > 0 && (
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Connect With Us</span>
                  <div className="flex space-x-3">
                    {settings.socials.map((soc, idx) => {
                      const Icon = SocialIconMap[soc.platform] || Globe;
                      return (
                        <a
                          key={idx}
                          href={soc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-sm"
                          title={soc.platform}
                        >
                          <Icon size={14} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp support card */}
            <div className="bg-primary text-white p-6 rounded-xlarge shadow-premium space-y-4 border border-primary-light">
              <span className="text-accent font-bold text-xs uppercase tracking-widest block">Instant Support</span>
              <h3 className="font-bold text-lg text-white">Direct Trade Chat</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Connect with our managers on WhatsApp for rapid response regarding logistics status and ocean freight costs.
              </p>
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center space-x-2 bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-2.5 px-4 rounded-large transition-colors shadow"
              >
                <MessageSquare size={14} />
                <span>Open WhatsApp Desk</span>
              </button>
            </div>

          </div>

          {/* Form Card */}
          <div className="bg-white border border-neutral-border/80 p-6 sm:p-10 rounded-xlarge shadow-premium lg:col-span-2 space-y-6">
            <div className="space-y-1.5 pb-4 border-b border-gray-100">
              <h3 className="font-bold text-2xl text-primary tracking-tight font-sans">Request Quotation</h3>
              <p className="text-[11px] text-gray-400 font-sans">Provide your packaging, volume, and target port specifications to receive quotations.</p>
            </div>
            
            {success && (
              <div className="bg-secondary/10 border border-secondary text-secondary p-4 rounded-large flex items-start space-x-3">
                <CheckCircle2 className="flex-shrink-0 mt-0.5" size={18} />
                <div className="text-xs">
                  <span className="font-bold block">Enquiry Submitted Successfully!</span>
                  <span>Our trade managers will review your request and get back to you with specification sheets and quotations within 24 hours.</span>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-500 text-red-700 p-4 rounded-large flex items-start space-x-3">
                <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                <span className="text-xs font-semibold">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-sans">Company Contact Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className={`w-full text-xs px-4 py-3 rounded-large border bg-neutral-lightBg/20 font-sans font-medium transition-all duration-300 focus:bg-white ${
                      errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-accent/20 focus:border-accent'
                    } focus:outline-none focus:ring-2`}
                    {...register("name", { required: "Name is required", minLength: { value: 3, message: "Min 3 characters" } })}
                  />
                  {errors.name && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.name.message}</span>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-sans">Work Email Address *</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className={`w-full text-xs px-4 py-3 rounded-large border bg-neutral-lightBg/20 font-sans font-medium transition-all duration-300 focus:bg-white ${
                      errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-accent/20 focus:border-accent'
                    } focus:outline-none focus:ring-2`}
                    {...register("email", { 
                      required: "Email is required", 
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email format" }
                    })}
                  />
                  {errors.email && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.email.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Country */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-sans">Country *</label>
                  <select
                    className={`w-full text-xs px-4 py-3 rounded-large border bg-neutral-lightBg/20 font-sans font-medium transition-all duration-300 focus:bg-white cursor-pointer ${
                      errors.country ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-accent/20 focus:border-accent'
                    } focus:outline-none focus:ring-2`}
                    {...register("country", { required: "Country is required" })}
                  >
                    <option value="" className="text-gray-400">Select country...</option>
                    {["Australia", "Austria", "Bahrain", "Bangladesh", "Belgium", "Brazil", "Canada", "Denmark", "Egypt", "France", "Germany", "India", "Indonesia", "Ireland", "Italy", "Japan", "Kuwait", "Malaysia", "Mexico", "Netherlands", "New Zealand", "Oman", "Philippines", "Poland", "Qatar", "Saudi Arabia", "Singapore", "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", "Thailand", "Turkey", "United Arab Emirates", "United Kingdom", "United States", "Vietnam", "Other"].map(c => (
                      <option key={c} value={c} className="text-primary">{c}</option>
                    ))}
                  </select>
                  {errors.country && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.country.message}</span>}
                </div>

                {/* State */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-sans">State / Province *</label>
                  <input
                    type="text"
                    placeholder="e.g. California"
                    className={`w-full text-xs px-4 py-3 rounded-large border bg-neutral-lightBg/20 font-sans font-medium transition-all duration-300 focus:bg-white ${
                      errors.state ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-accent/20 focus:border-accent'
                    } focus:outline-none focus:ring-2`}
                    {...register("state", { required: "State is required" })}
                  />
                  {errors.state && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.state.message}</span>}
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-sans">ZIP / Postal Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 90210"
                    className={`w-full text-xs px-4 py-3 rounded-large border bg-neutral-lightBg/20 font-sans font-medium transition-all duration-300 focus:bg-white ${
                      errors.pincode ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-accent/20 focus:border-accent'
                    } focus:outline-none focus:ring-2`}
                    {...register("pincode", { 
                      pattern: { value: /^[0-9]+$/, message: "Numbers only" } 
                    })}
                  />
                  {errors.pincode && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.pincode.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-sans">Contact Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="Enter phone with country code"
                    className={`w-full text-xs px-4 py-3 rounded-large border bg-neutral-lightBg/20 font-sans font-medium transition-all duration-300 focus:bg-white ${
                      errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-accent/20 focus:border-accent'
                    } focus:outline-none focus:ring-2`}
                    {...register("phone", { 
                      required: "Phone is required", 
                      minLength: { value: 8, message: "Min 8 digits required" } 
                    })}
                  />
                  {errors.phone && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.phone.message}</span>}
                </div>

                {/* Interested Product */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-sans">Product Interested *</label>
                  <select
                    className={`w-full text-xs px-4 py-3 rounded-large bg-neutral-lightBg/20 border cursor-pointer font-sans font-medium transition-all duration-300 focus:bg-white ${
                      errors.product_interested ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-accent/20 focus:border-accent'
                    } focus:outline-none focus:ring-2`}
                    {...register("product_interested", { required: "Please select an interested product" })}
                  >
                    <option value="" className="text-gray-400">Select a product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.name} className="text-primary">{p.name}</option>
                    ))}
                    <option value="General Enquiry" className="text-primary">General Export Query</option>
                  </select>
                  {errors.product_interested && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.product_interested.message}</span>}
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-sans">
                    Quantity {qtyUnit ? `(in ${qtyUnit})` : ""} *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1000 KGs, 10 MT, 5000 Pcs"
                    className={`w-full text-xs px-4 py-3 rounded-large border bg-neutral-lightBg/20 font-sans font-medium transition-all duration-300 focus:bg-white ${
                      errors.quantity ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-accent/20 focus:border-accent'
                    } focus:outline-none focus:ring-2`}
                    {...register("quantity", { 
                      required: "Quantity description is required"
                    })}
                  />
                  {errors.quantity && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.quantity.message}</span>}
                </div>
              </div>

              {/* Destination Port & Preferred INCOTERM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-sans">
                    Destination Port
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Port of Rotterdam, Hamburg"
                    className="w-full text-xs px-4 py-3 rounded-large border bg-neutral-lightBg/20 font-sans font-medium transition-all duration-300 focus:bg-white border-gray-200 focus:ring-accent/20 focus:border-accent focus:outline-none focus:ring-2"
                    {...register("destination_port")}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-sans">
                    Preferred INCOTERM
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FOB, CIF, EXW"
                    className="w-full text-xs px-4 py-3 rounded-large border bg-neutral-lightBg/20 font-sans font-medium transition-all duration-300 focus:bg-white border-gray-200 focus:ring-accent/20 focus:border-accent focus:outline-none focus:ring-2"
                    {...register("preferred_incoterm")}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 font-sans">Requirement Description *</label>
                <textarea
                  rows="4"
                  placeholder="Describe your wholesale/B2B specifications here..."
                  className={`w-full text-xs px-4 py-3 rounded-large border bg-neutral-lightBg/20 font-sans font-medium transition-all duration-300 focus:bg-white resize-y ${
                    errors.message ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-accent/20 focus:border-accent'
                  } focus:outline-none focus:ring-2`}
                  {...register("message", { 
                    required: "Message description is required", 
                    maxLength: { value: 1000, message: "Max 1000 characters allowed" } 
                  })}
                ></textarea>
                <span className="text-[9px] text-gray-400 block mt-1 leading-normal">
                  Please enter the requirements details such as volume, tentative frequency per month, preferred packaging and shipping ports.
                </span>
                {errors.message && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.message.message}</span>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-3.5 px-6 rounded-large shadow-premium hover:shadow-premium-hover transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer mt-6 font-sans"
              >
                <Send size={13} className="text-accent" />
                <span>Submit Quotation Request</span>
              </button>

            </form>

          </div>

        </div>

        {/* Map Location Section */}
        <div className="bg-white border border-neutral-border p-4 rounded-xlarge shadow-premium overflow-hidden">
          <iframe 
            src="https://maps.google.com/maps?q=Vasai-Virar,%20Maharashtra&t=&z=13&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="320" 
            style={{ border: 0, borderRadius: '8px' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Trading Office Map Location"
          ></iframe>
        </div>

        {/* FAQs Section */}
        {settings.faqs && settings.faqs.length > 0 && (
          <div className="bg-white border border-neutral-border p-6 sm:p-8 rounded-xlarge shadow-premium space-y-6">
            <h3 className="font-sans font-bold text-lg text-primary border-b pb-4 uppercase tracking-wider">
              Frequently Asked Trade Questions (FAQs)
            </h3>
            <div className="divide-y divide-gray-100">
              {settings.faqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={idx} className="py-4">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center text-left font-bold text-xs sm:text-sm text-primary hover:text-secondary transition-colors focus:outline-none"
                    >
                      <span>{faq.question}</span>
                      <span className="text-secondary text-base sm:text-lg ml-2">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs text-gray-500 leading-relaxed pl-1 transition-all duration-300">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
