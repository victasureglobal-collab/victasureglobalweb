import React from 'react';
import { Ship, FileCheck, Anchor, Users, CheckCircle, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PreviousWork() {
  const { settings } = useApp();

  const projects = settings && settings.consignments && settings.consignments.length > 0
    ? settings.consignments
    : [
        {
          id: 1,
          title: "FCL Areca Tableware Dispatch to Rotterdam",
          cargo: "85,000 Units (Plates & Bowls)",
          destination: "Hamburg / Rotterdam Port, Europe",
          transitTime: "24 Days (Port-to-Port)",
          inspection: "Phytosanitary & EN 13432 Compostability Audited",
          image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=600",
          description: "Successfully packed, fumigated, and exported a Full Container Load (FCL) of mixed Areca Leaf tableware for a German catering distributor. Humidity levels were stabilized at 11% to survive ocean temperature swings."
        },
        {
          id: 2,
          title: "FCL Areca Bowls Consignment to Tokyo",
          cargo: "60,000 Units (Square & Round Bowls)",
          destination: "Port of Tokyo, Japan",
          transitTime: "18 Days (Port-to-Port)",
          inspection: "USDA Biobased & Customs Cleared",
          image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80&w=600",
          description: "Coordinated a high-volume areca leaf bowl consignment for a premium restaurant chain in Tokyo. Bowls were customized with heat-embossed brand markings, meeting Japanese food safety standards."
        },
        {
          id: 3,
          title: "Mixed Areca Dinnerware & Cutlery to Chicago",
          cargo: "120,000 Units (Cutlery, Trays & Plates)",
          destination: "Port of Chicago, USA",
          transitTime: "28 Days",
          inspection: "EN 13432 & FDA Food-Contact Compliant",
          image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600",
          description: "Custom white-label sustainable dining packs (containing Areca plates, bowls, and birchwood forks/spoons) prepared for a major US eco-retail brand. Shipped in ocean-worthy moisture-sealed pallets."
        },
        {
          id: 4,
          title: "Areca Serving Trays Wholesale to Sydney",
          cargo: "40,000 Units (Rectangular Trays)",
          destination: "Port of Sydney, Australia",
          transitTime: "16 Days",
          inspection: "AQIS Custom Quarantine Cleared",
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
          description: "Supplied heavy-duty biodegradable areca leaf serving platters for an eco-conscious festival consortium in New South Wales. Consignment successfully cleared Australian biosecurity screening on arrival."
        }
      ];

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-neutral-lightBg space-y-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-5 pt-8 pb-4">
          <span className="text-xs font-bold uppercase text-accent tracking-widest bg-primary/10 px-4 py-1.5 rounded-full inline-block mb-1">
            Shipping Portfolio
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-primary tracking-tight leading-tight">
            Export Consignments & Dispatches
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xl mx-auto">
            Review our latest container load operations, custom packaging projects, and successful B2B shipments cleared at international ports.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj) => (
            <div 
              key={proj.id} 
              className="bg-white border border-neutral-border rounded-xlarge overflow-hidden shadow-premium hover:shadow-premium-hover hover-lift flex flex-col justify-between group"
            >
              {/* Photo */}
              <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/20"></div>
                <div className="absolute top-3 left-3 bg-secondary text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-large flex items-center space-x-1">
                  <CheckCircle size={12} />
                  <span>Customs Cleared</span>
                </div>
              </div>

              {/* Info details */}
              <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="font-sans font-bold text-primary text-base sm:text-lg leading-snug group-hover:text-accent transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                {/* Shipping metadata lists */}
                <div className="bg-neutral-lightBg border border-neutral-border p-4 rounded-large space-y-2 text-[11px] sm:text-xs">
                  <div className="grid grid-cols-3 py-1 border-b border-gray-200">
                    <span className="font-semibold text-gray-500 flex items-center"><Package size={12} className="mr-1 text-primary-light" /> Cargo:</span>
                    <span className="col-span-2 text-primary font-bold">{proj.cargo}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-gray-200">
                    <span className="font-semibold text-gray-500 flex items-center"><Anchor size={12} className="mr-1 text-primary-light" /> Destination:</span>
                    <span className="col-span-2 text-primary font-bold">{proj.destination}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-gray-200">
                    <span className="font-semibold text-gray-500 flex items-center"><Ship size={12} className="mr-1 text-secondary" /> Transit Time:</span>
                    <span className="col-span-2 text-primary font-bold">{proj.transitTime}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1">
                    <span className="font-semibold text-gray-500 flex items-center"><FileCheck size={12} className="mr-1 text-accent" /> Auditing:</span>
                    <span className="col-span-2 text-primary font-bold">{proj.inspection}</span>
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
