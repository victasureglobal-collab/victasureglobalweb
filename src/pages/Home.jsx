import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, Download, Globe, Leaf, Award, Share2, PhoneCall, 
  MessageSquare, Compass, ShieldCheck, Check, BookOpen,
  Target, Eye, Heart, Activity, Sparkles, TrendingUp, Users, ShoppingBag
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const IconMap = {
  ShieldCheck,
  Globe,
  Award,
  Leaf,
  Target,
  Eye,
  Compass,
  Heart,
  Activity,
  Sparkles,
  TrendingUp,
  Users
};

export default function Home({ onOpenDownloadModal, setSelectedProduct }) {
  const { products, categories, settings, addToCart } = useApp();
  const navigate = useNavigate();
  const [addedProdId, setAddedProdId] = useState(null);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  // Filter products by is_featured and fallback if none marked
  const featuredProducts = React.useMemo(() => {
    const activeProducts = products.filter(p => {
      if (p.status !== 'published') return false;
      const cat = categories.find(c => c.id === p.category_id);
      if (cat && cat.is_visible === false) return false;
      return true;
    })
    .sort((a, b) => {
      const orderA = Number(a.display_order) || 0;
      const orderB = Number(b.display_order) || 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });

    const featured = activeProducts.filter(p => p.is_featured === true);
    return featured.length > 0 ? featured.slice(0, 4) : activeProducts.slice(0, 4);
  }, [products, categories]);

  // Parse hero banner images
  const heroImages = React.useMemo(() => {
    const val = settings?.hero_banner_url || '';
    if (val.startsWith('[') && val.endsWith(']')) {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(url => url && url.trim().length > 0);
          return filtered.length > 0 ? filtered : ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600'];
        }
      } catch (e) {
        console.error("Failed to parse hero_banner_url", e);
      }
    }
    return [val || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600'];
  }, [settings?.hero_banner_url]);

  // Slideshow interval
  const slideDelayMs = React.useMemo(() => {
    if (!settings?.hero_slide_delay) return 5000;
    const numeric = parseInt(settings.hero_slide_delay, 10);
    if (isNaN(numeric)) return 5000;
    if (numeric < 100) return numeric * 1000;
    return numeric;
  }, [settings?.hero_slide_delay]);

  React.useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIdx(prev => (prev + 1) % heroImages.length);
    }, slideDelayMs);
    return () => clearInterval(interval);
  }, [heroImages, slideDelayMs]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedProdId(product.id);
    setTimeout(() => setAddedProdId(null), 2000);
  };

  const testimonials = settings && settings.testimonials && settings.testimonials.length > 0
    ? settings.testimonials
    : [
        {
          name: "Markus Vance",
          role: "Director of Operations",
          company: "EcoTableware Distribution GmbH",
          location: "Hamburg, Germany",
          text: "VictaSure Global has been our primary supplier of Areca Leaf plates for three years. Their strict moisture control audits are second to none—we have never had a single instance of mold or cracking upon customs clearance. Absolute professionals in B2B scheduling."
        },
        {
          name: "Sarah Jenkins",
          role: "Lead Procurement Manager",
          company: "GreenLife Catering Network",
          location: "Chicago, USA",
          text: "The custom private-label solutions provided by VictaSure allowed us to launch our branded eco-tableware line ahead of schedule. Their packaging is ocean-worthy, ensuring plates arrive pristine without moisture absorption during transit."
        },
        {
          name: "Akira Tanaka",
          role: "Senior Importer",
          company: "Organic Foods Japan Co.",
          location: "Tokyo, Japan",
          text: "We import organic palm leaf tableware and birchwood cutlery packs from VictaSure. Their USDA Organic equivalent and biobased certificates are always fully compliant. The tableware is incredibly sturdy, and cargo clears Tokyo customs swiftly."
        },
        {
          name: "Alastair Ross",
          role: "Founder",
          company: "Boreal Green Goods",
          location: "Toronto, Canada",
          text: "FOB pricing quotes from VictaSure are highly transparent. They coordinate directly with our freight forwarders, handling container inspections and bill of lading documents smoothly. High recommendation for B2B wholesale buyers."
        }
      ];

  if (!settings) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Handle WhatsApp click
  const handleWhatsApp = (productName = "") => {
    const whatsapp = settings.contact_whatsapp || "+918390900120";
    const msg = productName 
      ? `Hi VictaSure Global, I am interested in placing an order for "${productName}". Please share FOB quotes.`
      : "Hello VictaSure Global, I want to enquire about importing sustainable products.";
    window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleShareProduct = (e, productId) => {
    e.stopPropagation();
    const url = `${window.location.origin}/products?id=${productId}`;
    if (navigator.share) {
      navigator.share({
        title: "VictaSure Global Product",
        url: url
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(url);
      alert("Product link copied to clipboard!");
    }
  };

  const features = [
    {
      icon: <Globe className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-50 border border-blue-100",
      title: "Global Reach",
      description: "Extensive network spanning across continents, ensuring seamless B2B trade and timely logistics."
    },
    {
      icon: <Leaf className="w-5 h-5 text-green-600" />,
      iconBg: "bg-green-50 border border-green-100",
      title: "Sustainability",
      description: "Prioritizing 100% natural products like areca plates, bowls, trays, and compostable cutlery for a greener future."
    },
    {
      icon: <Award className="w-5 h-5 text-amber-600" />,
      iconBg: "bg-amber-50 border border-amber-100",
      title: "Quality Assurance",
      description: "Strict adherence to international standards and certificates, guaranteeing excellence in every shipment."
    }
  ];

  return (
    <div className="flex-grow">
      
      {/* 1. HERO SECTION */}
      {settings.show_hero_section && (
        <section className="relative min-h-[600px] flex items-center justify-center text-white overflow-hidden">
          
          {/* Background Images Layers for Slideshow */}
          {heroImages.map((imgUrl, idx) => (
            <div
              key={idx}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
              style={{
                backgroundImage: `url(${imgUrl})`,
                opacity: currentSlideIdx === idx ? 1 : 0,
                zIndex: 0
              }}
            />
          ))}

          {/* Dark Navy Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/85" style={{ zIndex: 1 }}></div>
          
          <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 z-[2] space-y-6">
            
            {/* Split Title Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-sans text-white leading-tight tracking-tight max-w-4xl">
              {settings.hero_title ? (
                settings.hero_title.split('.').map((part, idx, arr) => {
                  const cleaned = part.trim();
                  if (!cleaned) return null;
                  return (
                    <React.Fragment key={idx}>
                      {idx === 1 ? (
                        <span className="text-[#8CE48C]">{cleaned}.</span>
                      ) : (
                        <span>{cleaned}.</span>
                      )}
                      {idx < arr.length - 1 && <br />}
                    </React.Fragment>
                  );
                })
              ) : (
                <>
                  Trusted Alliances.<br />
                  <span className="text-[#8CE48C]">Assured Quality.</span><br />
                  Global Reach.
                </>
              )}
            </h1>
            
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl font-light leading-relaxed">
              {settings.hero_subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onOpenDownloadModal}
                className="bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-3.5 px-6 rounded-large shadow-lg flex items-center space-x-2 transition-all"
              >
                <Download size={14} />
                <span>Download Catalogue</span>
              </button>

              <button
                onClick={() => navigate('/contact')}
                className="bg-transparent hover:bg-white/10 border border-white text-white font-bold text-xs py-3.5 px-6 rounded-large transition-all"
              >
                <span>Enquire Now</span>
              </button>
            </div>

          </div>
        </section>
      )}

      {/* 2. THREE FEATURE CARDS */}
      {settings.show_why_choose_us && (
        <section className="bg-white py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feat, index) => (
                <div 
                  key={index} 
                  className="bg-[#F9FAFB] border border-gray-100 p-6 rounded-xlarge space-y-4 hover:shadow-premium transition-all duration-300"
                >
                  <div className={`p-3 rounded-large inline-block ${feat.iconBg}`}>
                    {feat.icon}
                  </div>
                  <h3 className="font-bold text-sm text-primary font-sans">{feat.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2.5 HOMEPAGE ABOUT SECTION */}
      {settings.about_overview && (
        <section className="bg-[#F9FAFB] py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column: Text Content */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[#2E7D32] font-bold text-[10px] tracking-widest uppercase block">
                    ABOUT VICTASURE GLOBAL
                  </span>
                  <h2 className="text-3xl font-extrabold text-primary font-sans leading-tight">
                    Pioneering Sustainable Tableware for Global B2B Alliances
                  </h2>
                </div>
                
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {settings.about_overview}
                </p>

                {/* Mission & Vision split badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  {settings.about_mission && (
                    <div className="bg-white p-5 rounded-large border border-gray-100 shadow-sm space-y-2">
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const IconComp = IconMap[settings.about_mission_icon] || Target;
                          return <IconComp className="w-4 h-4 text-accent" />;
                        })()}
                        <span className="text-xs font-bold text-accent uppercase tracking-wider block">Our Mission</span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed">{settings.about_mission}</p>
                    </div>
                  )}
                  {settings.about_vision && (
                    <div className="bg-white p-5 rounded-large border border-gray-100 shadow-sm space-y-2">
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const IconComp = IconMap[settings.about_vision_icon] || Compass;
                          return <IconComp className="w-4 h-4 text-accent" />;
                        })()}
                        <span className="text-xs font-bold text-accent uppercase tracking-wider block">Our Vision</span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed">{settings.about_vision}</p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Link 
                    to="/about"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-secondary hover:text-secondary-dark transition-colors"
                  >
                    <span>Read Our Complete Profile</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Showcase */}
              <div className="relative">
                <div className="aspect-[4/3] rounded-xlarge overflow-hidden shadow-premium border bg-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600" 
                    alt="Eco-friendly Palm Leaf dinnerware production" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Float Badge */}
                <div className="absolute -bottom-6 -left-6 bg-primary text-white p-5 rounded-large shadow-lg hidden sm:block border border-primary-light max-w-[200px]">
                  <span className="text-xl font-extrabold text-accent block">100%</span>
                  <span className="text-[10px] font-bold text-gray-300 block mt-1 leading-normal">Natural & Fully Compostable Areca Palm dinnerware exports</span>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 3. OUR COLLECTIONS SECTION */}
      {settings.show_featured_section && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            
            {/* Header bar */}
            <div className="flex justify-between items-end border-b border-gray-100 pb-4">
              <div className="space-y-1">
                <span className="text-[#2E7D32] font-bold text-[10px] tracking-widest uppercase block">
                  OUR COLLECTIONS
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-primary font-sans">
                  Premium Sustainable Goods
                </h2>
              </div>
              <Link 
                to="/products" 
                className="text-xs font-bold text-gray-500 hover:text-primary transition-colors flex items-center space-x-1"
              >
                <span>View All Products</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Collections Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-xlarge overflow-hidden border border-gray-200 hover:shadow-premium transition-shadow flex flex-col justify-between"
                >
                  {/* Card Thumbnail */}
                  <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden border-b border-gray-100">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Floating Share */}
                    <button
                      onClick={(e) => handleShareProduct(e, product.id)}
                      className="absolute top-3 right-3 p-1.5 bg-white/95 text-primary hover:text-accent rounded-full shadow-sm hover:scale-105 transition-transform"
                      title="Share link"
                    >
                      <Share2 size={13} />
                    </button>
                  </div>

                  {/* Info details */}
                  <div className="p-4 space-y-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <h3 className="font-bold text-sm text-primary font-sans truncate pr-2">
                            {product.name}
                          </h3>
                          {product.product_code && (
                            <span className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">{product.product_code}</span>
                          )}
                        </div>
                        {product.show_price !== false ? (
                          <div className="text-right flex-shrink-0 flex flex-col items-end leading-none mt-0.5">
                            <span className="text-xs font-extrabold text-accent font-sans">₹{product.price_inr || 400}</span>
                            <span className="text-[9px] font-bold text-gray-400 mt-1 font-sans">${product.price_usd || 5}</span>
                          </div>
                        ) : (
                          <div className="text-right flex-shrink-0 flex flex-col items-end mt-0.5">
                            <span className="text-[9px] font-extrabold text-accent uppercase bg-accent/10 px-1.5 py-0.5 rounded select-none">Inquire</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed line-clamp-3">
                        {product.short_description}
                      </p>
                    </div>

                    {/* Bottom buttons */}
                    <div className="w-full pt-2 flex flex-col gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          navigate(`/products?id=${product.id}`);
                        }}
                        className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-[10px] py-2 px-3 rounded-large transition-colors text-center block"
                      >
                        Enquire / Request Quote
                      </button>
                      {settings?.enable_cart && (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-secondary hover:bg-secondary-light text-white font-bold text-[10px] py-2 px-3 rounded-large transition-colors flex items-center justify-center space-x-1.5"
                        >
                          {addedProdId === product.id ? <Check size={12} /> : <ShoppingBag size={12} />}
                          <span>{addedProdId === product.id ? 'Added!' : 'Add to Cart'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* 3.5 WHY CHOOSE US SECTION */}
      {settings.show_why_choose_us && (
        <section className="bg-neutral-lightBg py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-[#2E7D32] font-bold text-[10px] tracking-widest uppercase block">
                WHY CHOOSE VICTASURE
              </span>
              <h2 className="text-3xl font-extrabold text-primary font-sans leading-tight">
                Uncompromising Standards in Eco-Tableware Exportation
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xl mx-auto">
                We bridge the gap between rural Indian manufacturing quality and strict international compliance guidelines.
              </p>
            </div>

            {/* Grid Differentiators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(settings.why_choose_us_items && settings.why_choose_us_items.length > 0
                ? settings.why_choose_us_items
                : [
                    { icon: "ShieldCheck", title: "Strict Quality Audits", description: "Every batch undergoes moisture level checks and heat-pressed sterilization to ensure zero mold or structural cracking." },
                    { icon: "Globe", title: "Global B2B Logistics", description: "Smooth container booking, ocean freight coordination, and customs clearance documents compiled under one roof." },
                    { icon: "Award", title: "Moisture-Proof Storage", description: "Our raw leaf sorting and finished product inventories are stored in temperature-controlled warehouses prior to shipment." },
                    { icon: "Leaf", title: "Chemical-Free Process", description: "100% biodegradable plates heat-pressed solely from naturally shed Areca palm leaves without adhesives, plastics, or toxins." }
                  ]
              ).map((item, idx) => {
                const IconComp = IconMap[item.icon] || Leaf;
                const colors = [
                  { bg: "bg-green-50", text: "text-secondary" },
                  { bg: "bg-blue-50", text: "text-blue-600" },
                  { bg: "bg-amber-50", text: "text-amber-600" },
                  { bg: "bg-purple-50", text: "text-purple-600" }
                ];
                const color = colors[idx % colors.length];
                return (
                  <div key={idx} className="bg-white p-6 rounded-xlarge border border-neutral-border hover:shadow-premium transition-all duration-300 space-y-4">
                    <div className={`w-10 h-10 ${color.bg} rounded-large flex items-center justify-center ${color.text}`}>
                      <IconComp size={20} />
                    </div>
                    <h3 className="font-bold text-sm text-primary font-sans">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* 4. SCROLLING TESTIMONIALS SECTION */}
      <section className="bg-white py-12 overflow-hidden border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <span className="text-[#2E7D32] font-bold text-[10px] tracking-widest uppercase block mb-1">
            CLIENT FEEDBACK
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-primary font-sans">
            Global Partners Review Our Quality
          </h2>
        </div>
        
        {/* Seamless scrolling marquee container */}
        <div className="marquee-parent relative flex overflow-x-hidden w-full gap-6">
          <div className="animate-marquee flex gap-6 shrink-0 py-4">
            {testimonials.map((rev, idx) => (
              <div 
                key={idx} 
                className="w-80 sm:w-96 flex-shrink-0 bg-[#F9FAFB] border border-gray-100 p-6 rounded-xlarge flex flex-col justify-between whitespace-normal shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-accent text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-500 italic leading-relaxed">
                    "{rev.text}"
                  </p>
                </div>
                <div className="border-t border-gray-200/60 pt-4 mt-4 flex items-center justify-between text-[10px]">
                  <div>
                    <h4 className="font-bold text-primary">{rev.name}</h4>
                    <p className="text-gray-400">{rev.role} at {rev.company}</p>
                  </div>
                  <span className="bg-primary/5 text-primary font-bold px-2 py-0.5 rounded border border-primary/10">
                    {rev.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Repeated for seamless loop */}
          <div className="animate-marquee flex gap-6 shrink-0 py-4" aria-hidden="true">
            {testimonials.map((rev, idx) => (
              <div 
                key={`dup-${idx}`} 
                className="w-80 sm:w-96 flex-shrink-0 bg-[#F9FAFB] border border-gray-100 p-6 rounded-xlarge flex flex-col justify-between whitespace-normal shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-accent text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-500 italic leading-relaxed">
                    "{rev.text}"
                  </p>
                </div>
                <div className="border-t border-gray-200/60 pt-4 mt-4 flex items-center justify-between text-[10px]">
                  <div>
                    <h4 className="font-bold text-primary">{rev.name}</h4>
                    <p className="text-gray-400">{rev.role} at {rev.company}</p>
                  </div>
                  <span className="bg-primary/5 text-primary font-bold px-2 py-0.5 rounded border border-primary/10">
                    {rev.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. READY TO SCALE INVENTORY CTA SECTION */}
      {settings.show_overview_section && (
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary text-white p-8 sm:p-12 rounded-xlarge relative overflow-hidden shadow-premium flex flex-col lg:flex-row items-center justify-between gap-8">
              
              {/* Left Column: Slogans */}
              <div className="space-y-4 max-w-xl z-10 text-center lg:text-left">
                <h2 className="text-xl sm:text-3xl font-extrabold text-white font-sans leading-tight">
                  Ready to scale your inventory?
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                  Download our full product catalogue for detailed specifications, pricing tiers, and international shipping options.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <button
                    onClick={onOpenDownloadModal}
                    className="bg-secondary hover:bg-secondary-light text-white font-bold text-xs py-3 px-6 rounded-large shadow flex items-center space-x-2 transition-transform hover:scale-105"
                  >
                    <Download size={14} className="text-accent" />
                    <span>Get Digital Catalogue</span>
                  </button>
                  <button
                    onClick={() => navigate('/contact')}
                    className="border border-white/30 hover:bg-white/10 text-white font-bold text-xs py-3 px-6 rounded-large transition-colors"
                  >
                    <span>Request a Call Back</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Floating book mock */}
              <div className="relative z-10 hidden lg:block pr-6">
                <div className="w-28 h-36 bg-white border border-gray-100 rounded-large shadow-2xl flex items-center justify-center transform rotate-12 hover:rotate-6 transition-transform duration-300">
                  <div className="flex flex-col items-center space-y-2">
                    <BookOpen className="text-primary w-8 h-8" />
                    <div className="w-12 h-1 bg-accent rounded"></div>
                    <div className="w-8 h-1 bg-gray-200 rounded"></div>
                    <span className="text-[9px] font-bold text-primary tracking-widest uppercase">Catalog</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

    </div>
  );
}
