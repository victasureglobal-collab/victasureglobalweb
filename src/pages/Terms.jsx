import React from 'react';
import { ShieldCheck, Scale, FileText, AlertCircle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-neutral-lightBg space-y-12">
      <div className="max-w-4xl mx-auto space-y-8 bg-white border border-neutral-border p-6 sm:p-10 rounded-xlarge shadow-premium">
        
        {/* Header Title */}
        <div className="text-center border-b pb-6 space-y-2">
          <span className="text-xs font-bold uppercase text-accent tracking-widest bg-primary/10 px-3.5 py-1 rounded-full inline-block">
            Legal Framework
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-primary font-sans">
            Terms & Conditions of Export
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            Effective Date: June 21, 2026 • Trade Agreement Agreement
          </p>
        </div>

        {/* Introduction note */}
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-large flex items-start space-x-3 text-xs leading-relaxed">
          <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
          <div>
            <strong>Important Notice for International Buyers:</strong> All shipping transactions, wholesale purchases, and custom contract manufacturing orders executed with VictaSure Global are bound by the trade terms detailed below. Unless specified in a signed bilateral contract, these terms govern the agreement.
          </div>
        </div>

        {/* Content list */}
        <div className="space-y-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
          
          <section className="space-y-2">
            <h3 className="font-bold text-primary flex items-center space-x-1.5 text-sm sm:text-base">
              <Scale size={16} className="text-accent" />
              <span>1. Standard Trade & Delivery Terms (Incoterms 2020)</span>
            </h3>
            <p className="pl-6">
              Unless explicitly agreed otherwise in the sales invoice or proforma contract, all international shipments are conducted under <strong>FOB (Free on Board)</strong> terms at the port of origin in India (e.g., Port of Chennai or Tuticorin Port). Responsibility for cargo, insurance, and sea freight costs transfers to the buyer once the container successfully crosses the ship rail at the loading port.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-primary flex items-center space-x-1.5 text-sm sm:text-base">
              <ShieldCheck size={16} className="text-secondary" />
              <span>2. Product Specifications & Quality Certification</span>
            </h3>
            <p className="pl-6">
              VictaSure Global guarantees that Areca Leaf dinnerware meets strict biobased and EN 13432 biodegradability requirements. Products are shipped at moisture levels maintained between 10% and 12% to prevent mold formation during ocean transit. The buyer has the right to appoint third-party inspection firms (e.g., SGS, Intertek) to audit the container load at our production units prior to dispatch.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-primary flex items-center space-x-1.5 text-sm sm:text-base">
              <FileText size={16} className="text-primary-light" />
              <span>3. Payment Terms</span>
            </h3>
            <p className="pl-6">
              Standard B2B export payment channels accepted:
            </p>
            <ul className="list-disc pl-12 space-y-1">
              <li><strong>Telegraphic Transfer (T/T):</strong> 30% advanced deposit upon contract sign, and 70% balance paid upon presentation of the scanned Bill of Lading (B/L) copy.</li>
              <li><strong>Letter of Credit (L/C):</strong> 100% Irrevocable Letter of Credit at sight, issued by a prime international bank, confirmed by our corporate banking desk in India.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-primary flex items-center space-x-1.5 text-sm sm:text-base">
              <AlertCircle size={16} className="text-red-500" />
              <span>4. Customs Inspections, Claims & Quarantine</span>
            </h3>
            <p className="pl-6">
              Phytosanitary and fumigation credentials are provided with every shipment. The importer is responsible for providing all correct documentation needed for customs entry at the port of destination. Any quality claims (such as moisture damage or count discrepancies) must be submitted in writing within fourteen (14) calendar days of cargo discharge at the destination port, supported by official surveyor inspection reports and photos.
            </p>
          </section>

        </div>

        {/* Footer contact */}
        <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          For legal inquiries or draft reviews, please contact the Trade Compliance Desk: <a href="mailto:export@victasure.com" className="text-accent hover:underline font-semibold">export@victasure.com</a>
        </div>

      </div>
    </div>
  );
}
