import React from 'react';
import { Award, Leaf, Users, ShieldCheck, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function About() {
  const { settings, founder } = useApp();

  if (!settings) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  const valueIcons = [
    <ShieldCheck className="text-secondary w-6 h-6" />,
    <Leaf className="text-secondary w-6 h-6" />,
    <Users className="text-secondary w-6 h-6" />,
    <Award className="text-secondary w-6 h-6" />,
    <Heart className="text-secondary w-6 h-6" />
  ];

  return (
    <div className="flex-grow py-12 bg-neutral-lightBg space-y-16">
      
      {/* 1. Header Hero */}
      <section className="max-w-7xl mx-auto px-4 text-center space-y-5 pt-8 pb-4">
        <span className="text-xs font-bold uppercase text-accent tracking-widest bg-primary/10 px-4 py-1.5 rounded-full inline-block mb-1">
          VictaSure Global
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-primary tracking-tight leading-tight">
          About Our Enterprise
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
          Establishing reliable channels for certified, natural products exported directly from premium production units.
        </p>
      </section>

      {/* 2. Founder Details (Conditional) */}
      {settings.show_founder_section && founder && founder.is_visible && (
        <section className="bg-primary py-16 text-white">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            
            {/* Founder Image */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-accent shadow-lg bg-primary-dark">
                <img
                  src={founder.photo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"}
                  alt={founder.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-accent mt-4">{founder.name}</h3>
              <p className="text-xs text-gray-400 font-medium">{founder.designation}</p>
            </div>

            {/* Founder Message */}
            <div className="md:col-span-2 space-y-4 text-center md:text-left">
              <span className="text-xs font-bold text-accent uppercase tracking-widest block">Message from Leadership</span>
              <blockquote className="text-sm italic leading-relaxed text-gray-200">
                "{founder.message}"
              </blockquote>
              <div className="h-0.5 bg-accent/30 w-24 mx-auto md:mx-0"></div>
              <p className="text-[10px] text-gray-400">
                VictaSure Global Trade Division • Quality Compliant Exports
              </p>
            </div>

          </div>
        </section>
      )}

      {/* 3. Core Grid Info */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Overview */}
        <div className="bg-white p-8 rounded-large border border-neutral-border shadow-premium space-y-3">
          <span className="text-xs uppercase text-accent font-extrabold tracking-wider block">Corporate Overview</span>
          <p className="text-xs text-gray-500 leading-relaxed">
            {settings.about_overview}
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white p-8 rounded-large border border-neutral-border shadow-premium space-y-3">
          <span className="text-xs uppercase text-secondary font-extrabold tracking-wider block">Our Mission</span>
          <p className="text-xs text-gray-500 leading-relaxed">
            {settings.about_mission}
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white p-8 rounded-large border border-neutral-border shadow-premium space-y-3">
          <span className="text-xs uppercase text-primary font-extrabold tracking-wider block">Our Vision</span>
          <p className="text-xs text-gray-500 leading-relaxed">
            {settings.about_vision}
          </p>
        </div>

      </section>

      {/* 4. Core Values & Quality Statement */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Core Values */}
        <div className="bg-white p-8 sm:p-10 border border-neutral-border rounded-xlarge shadow-premium flex flex-col justify-center space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-bl-full flex items-center justify-center">
            <Users className="text-secondary w-8 h-8" />
          </div>
          <span className="text-secondary font-bold text-xs uppercase tracking-widest block">Our Foundation</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-primary">Our Core Values</h2>
          <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">
            {typeof settings.about_core_values === 'string' 
              ? settings.about_core_values 
              : settings.about_core_values?.join('\n')}
          </p>
        </div>

        {/* Quality Commitment Card */}
        <div className="bg-white p-8 sm:p-10 border border-neutral-border rounded-xlarge shadow-premium flex flex-col justify-center space-y-4 relative overflow-hidden">
          {/* Gold highlight accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-bl-full flex items-center justify-center">
            <Award className="text-accent w-8 h-8" />
          </div>

          <span className="text-accent font-bold text-xs uppercase tracking-widest block">Quality Assurance</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-primary">Uncompromised Auditing Policy</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {settings.about_quality_commitment}
          </p>

          <div className="pt-4 border-t border-gray-100 flex items-center space-x-4">
            <div className="text-center bg-gray-50 border border-gray-100 rounded-large p-3 flex-grow">
              <span className="block text-lg font-bold text-primary">Zero</span>
              <span className="text-[10px] text-gray-500 font-medium">Bacterial Recalls</span>
            </div>
            <div className="text-center bg-gray-50 border border-gray-100 rounded-large p-3 flex-grow">
              <span className="block text-lg font-bold text-primary">100%</span>
              <span className="text-[10px] text-gray-500 font-medium">Fumigation Standard</span>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
