import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, Phone, MapPin, Globe, Award, ShieldAlert, ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import logoImg from '../assets/logo/VictaSure_Final.png';

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const WhatsappIcon = (props) => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.008c6.56 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const PinterestIcon = (props) => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" {...props}>
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.41 7.61 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.715-.359-1.774c0-1.66 1.054-2.9 2.146-2.9 1.01 0 1.498.758 1.498 1.668 0 1.014-.647 2.533-.98 3.94-.279 1.179.605 2.141 1.767 2.141 2.122 0 3.754-2.24 3.754-5.474 0-2.862-2.057-4.864-4.996-4.864-3.403 0-5.4 2.553-5.4 5.19 0 1.026.395 2.13 1.01 2.876.111.135.127.253.084.426-.093.387-.3.12-.4-.486-.33-1.36-.612-2.127-.612-3.42 0-3.136 2.278-6.015 6.568-6.015 3.456 0 6.143 2.463 6.143 5.758 0 3.434-2.165 6.198-5.17 6.198-1.009 0-1.959-.524-2.283-1.144l-.622 2.373c-.225.864-.833 1.948-1.24 2.607a12.008 12.008 0 003.743.593C18.622 24 24 18.631 24 12.012 24 5.39 18.622 0 12.017 0z"/>
  </svg>
);

const TiktokIcon = (props) => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" {...props}>
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

export default function Footer() {
  const { settings, loading } = useApp();

  const companyName = settings?.company_name || (!loading ? "" : "VictaSure Global");
  const email = settings?.contact_email || (!loading ? "" : "export@victasure.com");
  const phone = settings?.contact_phone || (!loading ? "" : "+91 83909 00120");
  const address = settings?.contact_address || (!loading ? "" : "123 Global Trade Centre, Bangalore, India 560001");

  return (
    <footer className="bg-[#F9FAFB] border-t border-gray-200 text-gray-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Column: Brand description & Socials */}
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="relative">
              <img src={settings?.logo_url || logoImg} alt={companyName} className="h-8 w-auto object-contain max-w-[150px]" />
              <span className="absolute -top-1 -right-3 text-[6px] font-extrabold text-primary select-none font-sans">TM</span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-gray-500 max-w-xs">
            Connecting premium eco-friendly manufacturers with international retailers through excellence.
          </p>
          {/* Simple Dynamic Social Icons */}
          <div className="flex space-x-3 pt-2">
            {(settings?.socials && settings.socials.length > 0
              ? settings.socials
              : [
                  { platform: "Globe", url: "#" },
                  { platform: "Linkedin", url: "#" },
                  { platform: "Facebook", url: "#" }
                ]
            ).map((soc, idx) => {
              const IconComp = SocialIconMap[soc.platform] || Globe;
              return (
                <a 
                  key={idx} 
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 bg-gray-200/60 rounded-full flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer text-gray-400"
                >
                  <IconComp size={12} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <a href="/products?category=areca-leaf-plates" className="hover:text-primary hover:font-semibold transition-all">
                Areca Plates
              </a>
            </li>
            <li>
              <a href="/products?category=areca-leaf-bowls" className="hover:text-primary hover:font-semibold transition-all">
                Areca Bowls
              </a>
            </li>
            <li>
              <a href="/products?category=areca-leaf-trays" className="hover:text-primary hover:font-semibold transition-all">
                Areca Trays
              </a>
            </li>
            <li>
              <a href="/products?category=areca-cutlery" className="hover:text-primary hover:font-semibold transition-all">
                Areca Cutlery
              </a>
            </li>
            <li>
              <a href="/certificates" className="hover:text-primary hover:font-semibold transition-all">
                Quality Assurance
              </a>
            </li>
            {settings?.enable_cart && (
              <li>
                <Link to="/cart" className="hover:text-primary hover:font-semibold transition-all">
                  Shopping Cart
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Company</h4>
          <ul className="space-y-2.5 text-xs text-gray-500">
            <li><a href="/about" className="hover:text-primary transition-all">About Us</a></li>
            <li><span className="hover:text-primary transition-all cursor-pointer">Privacy Policy</span></li>
            {settings?.show_terms_page !== false && (
              <li><Link to="/terms" className="hover:text-primary transition-all">Terms & Conditions</Link></li>
            )}
            {settings?.enable_client_login && (
              <li><Link to="/login" className="hover:text-primary transition-all">Client Login / Profile</Link></li>
            )}
            <li><span className="hover:text-primary transition-all cursor-pointer">Sustainability Report</span></li>
          </ul>
        </div>

        {/* Contact Us Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Contact Us</h4>
          
          <div className="flex items-start space-x-2 text-xs">
            <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <span className="text-gray-500 leading-relaxed">{address}</span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <Mail size={14} className="text-gray-400 flex-shrink-0" />
            <a href={`mailto:${email}`} className="text-gray-500 hover:text-primary transition-colors">{email}</a>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <Phone size={14} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-500">{phone}</span>
          </div>
        </div>

      </div>

      {/* Bottom Row: Copyright & Badges */}
      <div className="max-w-7xl mx-auto border-t border-gray-200/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
        <p className="text-[11px] text-gray-400">
          &copy; 2026 {companyName}. All rights reserved. Built for Excellence.
        </p>
        
        {/* Mock Certification badges on right */}
        <div className="flex items-center space-x-2.5 text-gray-300 text-[10px] font-bold">
          <span className="border border-gray-300 rounded px-1.5 py-0.5 text-gray-400">ISO 9001</span>
          <span className="border border-gray-300 rounded px-1.5 py-0.5 text-gray-400">USDA ORGANIC</span>
        </div>
      </div>

    </footer>
  );
}
