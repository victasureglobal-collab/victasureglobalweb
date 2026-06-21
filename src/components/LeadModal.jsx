import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Download, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LeadModal({ isOpen, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { submitDownload, products, settings } = useApp();

  if (!isOpen) return null;

  const triggerCatalogDownload = () => {
    // If admin uploaded a custom PDF, download it directly
    if (settings?.catalogue_pdf) {
      const link = document.createElement("a");
      link.href = settings.catalogue_pdf;
      link.download = `${(settings.company_name || 'VictaSure_Global').replace(/\s+/g, '_')}_B2B_Catalogue.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Fallback: Generate a beautiful, print-ready document containing logo, company details, and product specs
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print/download the B2B catalogue.");
      return;
    }

    const companyName = settings?.company_name || 'VictaSure Global';
    const logoHtml = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 25px; border-bottom: 2px solid #0D2C54; padding-bottom: 15px;">
        <div style="width: 48px; height: 48px; background-color: #0D2C54; color: white; border-radius: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 20px; font-family: 'Poppins', sans-serif;">VS</div>
        <div style="font-family: 'Poppins', sans-serif;">
          <h1 style="margin: 0; color: #0D2C54; font-size: 22px; font-weight: 700; line-height: 1.2;">${companyName}</h1>
          <p style="margin: 2px 0 0 0; color: #C89B3C; font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Global Sustainable Exporter</p>
        </div>
      </div>
    `;

    const contactHtml = `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; font-family: 'Poppins', sans-serif; font-size: 11px; color: #4B5563; margin-bottom: 30px; line-height: 1.6; border: 1px solid #E5E7EB; padding: 15px; border-radius: 12px;">
        <div><strong>Headquarters:</strong><br/>${settings?.contact_address || 'Bengaluru, India'}</div>
        <div>
          <strong>Phone / WhatsApp:</strong> ${settings?.contact_whatsapp || settings?.contact_phone || 'N/A'}<br/>
          <strong>Email:</strong> ${settings?.contact_email || 'info@victasure.com'}<br/>
          <strong>Website:</strong> ${window.location.origin}
        </div>
      </div>
    `;

    const productsHtml = (products || []).map(p => `
      <div style="border: 1px solid #E5E7EB; border-radius: 12px; padding: 15px; page-break-inside: avoid; display: flex; flex-direction: column; justify-content: space-between; background-color: #FAFAFA; font-family: 'Poppins', sans-serif;">
        <div>
          ${p.images && p.images[0] ? `<img src="${p.images[0]}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; border: 1px solid #E5E7EB;" />` : ''}
          <h3 style="margin: 0 0 4px 0; color: #0D2C54; font-size: 13px; font-weight: 700;">${p.name}</h3>
          <p style="margin: 0 0 12px 0; color: #6B7280; font-size: 10px; line-height: 1.4;">${p.short_description || ''}</p>
        </div>
        <div style="border-top: 1px solid #E5E7EB; padding-top: 10px; font-size: 10px; color: #4B5563; line-height: 1.6;">
          <div><strong>Material:</strong> ${p.material || 'Natural Areca Leaf'}</div>
          <div><strong>Dimensions:</strong> ${p.dimensions || 'Standard Size'}</div>
          <div><strong>MOQ:</strong> ${p.moq || '10,000 units'}</div>
          <div style="margin-top: 8px; font-weight: 800; color: #2E7D32; font-size: 12px; display: flex; justify-content: space-between;">
            <span>FOB Price:</span>
            <span>₹${p.price_inr || 0} / $${p.price_usd || 0} USD</span>
          </div>
        </div>
      </div>
    `).join("");

    const fullHtml = `
      <html>
        <head>
          <title>${companyName} - B2B Product Catalogue</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
            @media print {
              body { margin: 1cm; padding: 0; }
              .no-print { display: none !important; }
            }
            body { font-family: 'Poppins', sans-serif; color: #1F2937; margin: 40px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
            .btn-bar { display: flex; gap: 10px; margin-bottom: 25px; }
            .print-btn { background-color: #2E7D32; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 12px; transition: background 0.2s; }
            .print-btn:hover { background-color: #1e5221; }
            .close-btn { background-color: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="btn-bar no-print">
            <button class="print-btn" onclick="window.print()">Download / Save PDF Catalogue</button>
            <button class="close-btn" onclick="window.close()">Close Window</button>
          </div>
          ${logoHtml}
          ${contactHtml}
          <h2 style="font-family: 'Poppins', sans-serif; color: #0D2C54; font-size: 16px; font-weight: 700; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px; margin-bottom: 20px; uppercase; letter-spacing: 0.5px;">Premium Eco-Friendly Dinnerware Catalogue</h2>
          <div class="grid">
            ${productsHtml}
          </div>
          <div style="margin-top: 50px; text-align: center; font-size: 9px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 15px; font-family: 'Poppins', sans-serif;">
            Certified Biodegradable Tableware • ISO 9001:2015 Audited Quality • Made in India
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(fullHtml);
    printWindow.document.close();
  };

  const onSubmit = async (data) => {
    try {
      await submitDownload(data);
      triggerCatalogDownload();
      reset();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xlarge shadow-premium w-full max-w-lg border border-neutral-border relative overflow-hidden">
        
        {/* Header decoration */}
        <div className="h-2 bg-gradient-gold"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <span className="inline-flex p-3 bg-secondary/10 rounded-full text-secondary mb-2">
              <Download size={24} />
            </span>
            <h2 className="text-xl font-bold text-primary font-sans">Download Catalogue</h2>
            <p className="text-xs text-gray-500 mt-1">
              Please fill in your business details to download our export product catalogue.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="John Doe"
                className={`w-full text-sm px-4 py-2.5 rounded-large border ${
                  errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary/20'
                } focus:outline-none focus:ring-2 focus:border-primary`}
                {...register("name", { required: "Name is required", minLength: { value: 3, message: "Min 3 characters required" } })}
              />
              {errors.name && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.name.message}</span>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Work Email *</label>
              <input
                type="email"
                placeholder="john@company.com"
                className={`w-full text-sm px-4 py-2.5 rounded-large border ${
                  errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary/20'
                } focus:outline-none focus:ring-2 focus:border-primary`}
                {...register("email", { 
                  required: "Email is required", 
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email format" } 
                })}
              />
              {errors.email && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.email.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Country */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Country *</label>
                <select
                  className={`w-full text-sm px-4 py-2.5 rounded-large border bg-white ${
                    errors.country ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary/20'
                  } focus:outline-none focus:ring-2 focus:border-primary`}
                  {...register("country", { required: "Country is required" })}
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
                  className={`w-full text-sm px-4 py-2.5 rounded-large border ${
                    errors.state ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary/20'
                  } focus:outline-none focus:ring-2 focus:border-primary`}
                  {...register("state", { required: "State is required" })}
                />
                {errors.state && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.state.message}</span>}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                placeholder="+49 170 1234567"
                className={`w-full text-sm px-4 py-2.5 rounded-large border ${
                  errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary/20'
                } focus:outline-none focus:ring-2 focus:border-primary`}
                {...register("phone", { 
                  required: "Phone is required", 
                  minLength: { value: 8, message: "Min 8 digits required" } 
                })}
              />
              {errors.phone && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.phone.message}</span>}
            </div>

            {/* Product Interest */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Product Segment of Interest *</label>
              <select
                className={`w-full text-sm px-4 py-2.5 rounded-large bg-white border ${
                  errors.product_interest ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary/20'
                } focus:outline-none focus:ring-2 focus:border-primary`}
                {...register("product_interest", { required: "Product interest is required" })}
              >
                <option value="">Select segment...</option>
                <option value="Areca Leaf Plates">Areca Leaf Plates</option>
                <option value="Areca Bowls">Areca Bowls</option>
                <option value="Areca Trays">Areca Trays</option>
                <option value="Areca Cutlery">Areca Cutlery</option>
                <option value="All Categories">All Export Categories</option>
              </select>
              {errors.product_interest && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.product_interest.message}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-secondary hover:bg-secondary-light text-white font-bold text-sm py-3 rounded-large transition-all shadow-md mt-6"
            >
              <Download size={16} />
              <span>Verify & Download Catalogue</span>
            </button>

          </form>

          {/* Privacy note */}
          <div className="flex items-center justify-center space-x-1.5 mt-4 text-[10px] text-gray-400">
            <ShieldCheck size={14} className="text-secondary" />
            <span>GDPR Compliant. We never share your data.</span>
          </div>

        </div>
      </div>
    </div>
  );
}
