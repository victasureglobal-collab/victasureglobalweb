import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, Phone, MapPin, Globe, Award, ShieldAlert, ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

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

const SocialIconMap = {
  Facebook: FacebookIcon,
  Twitter: TwitterIcon,
  Linkedin: LinkedinIcon,
  Instagram: InstagramIcon,
  Youtube: YoutubeIcon,
  Globe: Globe
};

export default function Footer() {
  const { settings } = useApp();

  const companyName = settings?.company_name || "VictaSure Global";
  const email = settings?.contact_email || "export@victasure.com";
  const phone = settings?.contact_phone || "+91 98765 43210";
  const address = settings?.contact_address || "123 Global Trade Centre, Bangalore, India 560001";

  return (
    <footer className="bg-[#F9FAFB] border-t border-gray-200 text-gray-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Column: Brand description & Socials */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 bg-primary text-white rounded font-bold flex items-center justify-center text-xs shadow-sm">
              VS
            </span>
            <span className="text-primary font-extrabold text-sm tracking-wide">{companyName}</span>
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
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Company</h4>
          <ul className="space-y-2.5 text-xs text-gray-500">
            <li><a href="/about" className="hover:text-primary transition-all">About Us</a></li>
            <li><span className="hover:text-primary transition-all cursor-pointer">Privacy Policy</span></li>
            <li><Link to="/terms" className="hover:text-primary transition-all">Terms & Conditions</Link></li>
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
          &copy; 2024 {companyName}. All rights reserved. Built for Excellence.
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
