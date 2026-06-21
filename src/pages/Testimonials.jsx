import React from 'react';
import { Star, Quote, ShieldCheck, MapPin, Ship } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Testimonials() {
  const { settings } = useApp();

  const rawReviews = settings && settings.testimonials && settings.testimonials.length > 0
    ? settings.testimonials
    : [
        {
          id: 1,
          clientName: "Markus Vance",
          designation: "Director of Operations",
          company: "EcoTableware Distribution GmbH",
          location: "Hamburg, Germany",
          rating: 5,
          port: "Port of Hamburg",
          volume: "12 Containers / Year",
          text: "VictaSure Global has been our primary supplier of Areca Leaf plates for three years. Their strict moisture control audits are second to none—we have never had a single instance of mold or cracking upon customs clearance. Absolute professionals in B2B scheduling."
        },
        {
          id: 2,
          clientName: "Sarah Jenkins",
          designation: "Lead Procurement Manager",
          company: "GreenLife Catering Network",
          location: "Chicago, USA",
          rating: 5,
          port: "Port of New York / Newark",
          volume: "8 Containers / Year",
          text: "The custom private-label solutions provided by VictaSure allowed us to launch our branded eco-tableware line ahead of schedule. Their packaging is ocean-worthy, ensuring plates arrive pristine without moisture absorption during transit."
        },
        {
          id: 3,
          clientName: "Akira Tanaka",
          designation: "Senior Importer",
          company: "Organic Foods Japan Co.",
          location: "Tokyo, Japan",
          rating: 5,
          port: "Port of Tokyo",
          volume: "60 Metric Tons / Year",
          text: "We import organic palm leaf tableware and birchwood cutlery packs from VictaSure. Their USDA Organic equivalent and biobased certificates are always fully compliant. The tableware is incredibly sturdy, and cargo clears Tokyo customs swiftly."
        },
        {
          id: 4,
          clientName: "Alastair Ross",
          designation: "Founder",
          company: "Boreal Green Goods",
          location: "Toronto, Canada",
          rating: 5,
          port: "Port of Montreal",
          volume: "5 Containers / Year",
          text: "FOB pricing quotes from VictaSure are highly transparent. They coordinate directly with our freight forwarders, handling container inspections and bill of lading documents smoothly. High recommendation for B2B wholesale buyers."
        }
      ];

  const reviews = rawReviews.map((rev, idx) => ({
    id: rev.id || idx,
    clientName: rev.clientName || rev.name || "",
    designation: rev.designation || rev.role || "",
    company: rev.company || "",
    location: rev.location || "",
    rating: rev.rating || 5,
    port: rev.port || "International Port",
    volume: rev.volume || "FCL Shipment",
    text: rev.text || ""
  }));

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-neutral-lightBg space-y-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-5 pt-8 pb-4">
          <span className="text-xs font-bold uppercase text-accent tracking-widest bg-primary/10 px-4 py-1.5 rounded-full inline-block mb-1">
            Client Success
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-primary tracking-tight leading-tight">
            Distributor Testimonials
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xl mx-auto">
            Discover why global importers and retail networks trust VictaSure Global for sustainable supply chains.
          </p>
        </div>

        {/* Client Success Metrics */}
        <div className="bg-primary text-white p-6 sm:p-8 rounded-xlarge grid grid-cols-2 md:grid-cols-4 gap-6 text-center border shadow-premium">
          <div className="space-y-1">
            <span className="text-xl sm:text-3xl font-extrabold text-accent">99.4%</span>
            <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider">Quality Approval Rating</p>
          </div>
          <div className="space-y-1">
            <span className="text-xl sm:text-3xl font-extrabold text-[#8CE48C]">24 Hrs</span>
            <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider">FOB Quote Turnaround</p>
          </div>
          <div className="space-y-1">
            <span className="text-xl sm:text-3xl font-extrabold text-white">100%</span>
            <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider">Mold-Free Guarantee</p>
          </div>
          <div className="space-y-1">
            <span className="text-xl sm:text-3xl font-extrabold text-accent">4.9 / 5</span>
            <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider">Average Buyer Rating</p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev) => (
            <div 
              key={rev.id} 
              className="bg-white border border-neutral-border p-6 sm:p-8 rounded-xlarge shadow-premium flex flex-col justify-between hover-lift relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 text-gray-100">
                <Quote size={56} className="transform rotate-180" />
              </div>
              
              <div className="space-y-4 relative z-10">
                {/* Stars */}
                <div className="flex space-x-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-accent fill-accent" />
                  ))}
                </div>

                <blockquote className="text-xs sm:text-sm text-gray-600 italic leading-relaxed">
                  "{rev.text}"
                </blockquote>
              </div>

              {/* Client Info metadata */}
              <div className="border-t border-gray-100 pt-5 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
                <div>
                  <h4 className="font-bold text-primary">{rev.clientName}</h4>
                  <p className="text-[10px] text-gray-400 font-medium">{rev.designation}</p>
                  <p className="text-[10px] text-accent font-bold">{rev.company}</p>
                </div>
                
                <div className="bg-gray-50 border p-2.5 rounded-large text-[10px] space-y-1 text-gray-500">
                  <div className="flex items-center space-x-1.5">
                    <MapPin size={12} className="text-primary-light" />
                    <span>{rev.location}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Ship size={12} className="text-secondary" />
                    <span>Port: {rev.port}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
