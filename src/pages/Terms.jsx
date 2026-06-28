import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, FileText, AlertCircle, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Terms() {
  const { settings } = useApp();

  if (!settings) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  // If terms page is disabled/hidden by the admin
  if (settings.show_terms_page === false) {
    return (
      <div className="min-h-[70vh] py-16 px-4 bg-neutral-lightBg flex flex-col justify-center items-center text-center">
        <div className="space-y-4 max-w-md bg-white border border-neutral-border p-8 rounded-xlarge shadow-premium">
          <ShieldAlert size={48} className="mx-auto text-red-500 animate-bounce" />
          <h2 className="text-xl font-bold text-primary">Page Unavailable</h2>
          <p className="text-xs text-gray-500">
            The Terms & Conditions of Export page is temporarily disabled by the website administrator.
          </p>
          <div className="pt-2">
            <Link to="/" className="inline-block bg-primary hover:bg-secondary text-white text-xs font-bold py-2.5 px-6 rounded-large transition-all cursor-pointer">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const effectiveDate = settings.terms_effective_date || "June 21, 2026";
  const noticeText = settings.terms_notice || "All shipping transactions, wholesale purchases, and custom contract manufacturing orders executed with VictaSure Global are bound by the trade terms detailed below.";
  const termsContent = settings.terms_content || "";

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
            Effective Date: {effectiveDate} • Trade Compliance Agreement
          </p>
        </div>

        {/* Introduction Notice */}
        {noticeText && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-large flex items-start space-x-3 text-xs leading-relaxed">
            <AlertCircle className="flex-shrink-0 mt-0.5 text-amber-600" size={18} />
            <div>
              <strong>Important Notice for International Buyers:</strong> {noticeText}
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="space-y-6 text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {termsContent ? (
            <div>{termsContent}</div>
          ) : (
            <div className="text-center text-gray-400 italic py-8">
              No terms content drafted yet.
            </div>
          )}
        </div>

        {/* Footer contact */}
        <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          For legal inquiries or draft reviews, please contact the Trade Compliance Desk:{' '}
          <a href={`mailto:${settings.contact_email || 'info@victasure.com'}`} className="text-accent hover:underline font-semibold">
            {settings.contact_email || 'info@victasure.com'}
          </a>
        </div>

      </div>
    </div>
  );
}
