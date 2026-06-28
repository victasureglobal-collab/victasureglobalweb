import React from 'react';
import { Download, Award, ShieldCheck, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Certificates() {
  const { certificates, settings } = useApp();

  if (settings && settings.show_certificates_page === false) {
    return (
      <div className="flex-grow py-24 px-4 bg-neutral-lightBg flex flex-col items-center justify-center text-center">
        <div className="max-w-md bg-white border border-neutral-border p-8 rounded-xlarge shadow-premium space-y-4">
          <Award size={48} className="mx-auto text-gray-300 stroke-[1.5]" />
          <h2 className="text-xl font-bold text-primary">Certificates Page Offline</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            The certifications and compliance credentials page is temporarily offline or being updated by the trade team. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  const handleDownload = (cert) => {
    // Dynamically download a text audit document as mock
    const content = `========================================================\n` +
                    `          VICTASURE GLOBAL QUALITY CERTIFICATE\n` +
                    `========================================================\n\n` +
                    `Certificate: ${cert.title}\n` +
                    `Audit Status: COMPLIANT & ACTIVE\n` +
                    `Issuer: Global Standards Auditing Body\n` +
                    `Fumigation & Moisture Compliance: Approved\n` +
                    `Verification Key: VS-${cert.id}-${Math.floor(1000 + Math.random()*9000)}\n\n` +
                    `VictaSure Global assures that exports meet the requisite health, regulatory,\n` +
                    `and bio-degradability standards. For queries, contact info@victasure.com\n`;
                    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `VictaSure_Certificate_${cert.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const visibleCerts = certificates.filter(c => c.is_visible);

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-neutral-lightBg space-y-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-5 pt-8 pb-4">
          <span className="text-xs font-bold uppercase text-accent tracking-widest bg-primary/10 px-4 py-1.5 rounded-full inline-block mb-1">
            Compliance & Quality
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-primary tracking-tight leading-tight">
            Export Certifications
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xl mx-auto">
            We adhere to rigorous international biological, food grade, and trade standards. Access our verification reports below.
          </p>
        </div>

        {/* Certificates Grid */}
        {visibleCerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleCerts.map((cert) => (
              <div key={cert.id} className="bg-white rounded-xlarge overflow-hidden border border-neutral-border shadow-premium hover:shadow-premium-hover hover-lift flex flex-col justify-between">
                
                {/* Visual Image */}
                <div className="relative aspect-video w-full bg-gray-50 overflow-hidden">
                  <img
                    src={cert.image_url || "https://images.unsplash.com/photo-1589330694653-ded6df53f7ec?auto=format&fit=crop&q=80&w=400"}
                    alt={cert.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary/20"></div>
                  <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1 rounded-large flex items-center space-x-1 shadow-sm">
                    <CheckCircle size={12} className="text-secondary" />
                    <span className="text-[9px] font-extrabold text-primary uppercase tracking-widest">Active Standard</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-sans font-bold text-primary text-sm sm:text-base leading-snug">
                      {cert.title}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Standard Compliance Verification Report for custom clearance.
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload(cert)}
                    className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-secondary text-white font-bold text-xs py-2.5 px-4 rounded-large transition-colors"
                  >
                    <Download size={14} className="text-accent" />
                    <span>Download Certificate PDF</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white border border-neutral-border rounded-xlarge py-16 px-4 space-y-2">
            <Award size={36} className="mx-auto text-gray-300 mb-2 stroke-[1.5]" />
            <h3 className="font-bold text-lg text-primary">No Certificates Available</h3>
            <p className="text-xs text-gray-400">Certificates are currently being updated by the trade team.</p>
          </div>
        )}

        {/* Quality Banner Details */}
        <section className="bg-primary text-white rounded-xlarge border p-8 sm:p-12 relative overflow-hidden shadow-premium">
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Award size={200} className="text-accent" />
          </div>

          <div className="max-w-2xl space-y-4">
            <span className="text-accent font-bold text-xs uppercase tracking-widest">Auditing Information</span>
            <h3 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
              Regulatory Customs Cleared Tableware
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Every container load exported undergoes chemical testing (pesticides, heavy metals, E. Coli) and humidity conditioning (maintained between 10-12% moisture level) to avoid fungal contamination during sea freight routes. Reports are attached to bill of lading documents.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <span className="flex items-center space-x-1.5 text-xs text-accent font-semibold">
                <ShieldCheck size={16} />
                <span>Customs Cleared</span>
              </span>
              <span className="flex items-center space-x-1.5 text-xs text-secondary-light font-semibold">
                <ShieldCheck size={16} />
                <span>Biodegradability (EN 13432)</span>
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
