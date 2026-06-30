import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-grow min-h-[70vh] flex items-center justify-center px-6 py-16 bg-[#F8F9FA] font-sans">
      <div className="text-center max-w-md space-y-6">
        
        {/* Animated Icon Container */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center border border-red-100 shadow-sm animate-pulse">
            <HelpCircle size={48} className="stroke-[1.5]" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-primary tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
            The page you are looking for does not exist, has been removed, or has changed address.
          </p>
        </div>

        {/* Action Button */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-light text-white font-bold text-xs py-3 px-6 rounded-large shadow-lg hover:shadow transition-all hover:-translate-y-0.5 transform cursor-pointer"
          >
            <ArrowLeft size={14} className="text-accent" />
            <span>Back to Homepage</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
