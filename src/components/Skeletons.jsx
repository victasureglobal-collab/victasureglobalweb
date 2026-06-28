import React from 'react';

export const SlideshowSkeleton = () => (
  <div className="relative min-h-[600px] flex items-center justify-center bg-gray-200 animate-pulse overflow-hidden w-full">
    <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 z-[2] space-y-6">
      <div className="h-12 sm:h-16 md:h-20 bg-gray-300 rounded w-3/4 max-w-3xl"></div>
      <div className="h-4 sm:h-6 bg-gray-300 rounded w-1/2 max-w-2xl"></div>
      <div className="flex flex-wrap gap-4 pt-4">
        <div className="h-12 w-48 bg-gray-300 rounded-large"></div>
        <div className="h-12 w-32 bg-gray-300 rounded-large"></div>
      </div>
    </div>
  </div>
);

export const TabsSkeleton = () => (
  <div className="flex flex-wrap gap-2.5 animate-pulse">
    <div className="h-9 w-24 bg-gray-200 rounded-full"></div>
    <div className="h-9 w-32 bg-gray-200 rounded-full"></div>
    <div className="h-9 w-28 bg-gray-200 rounded-full"></div>
    <div className="h-9 w-36 bg-gray-200 rounded-full"></div>
  </div>
);

export const ProductGridSkeleton = ({ count = 4, gridClass = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" }) => (
  <div className={`${gridClass} animate-pulse`}>
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bg-white rounded-xlarge border border-gray-200 flex flex-col justify-between p-4 space-y-4">
        {/* Card Thumbnail */}
        <div className="aspect-[4/3] w-full bg-gray-200 rounded-large"></div>
        {/* Info details */}
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        {/* Bottom buttons */}
        <div className="space-y-2 pt-2">
          <div className="h-8 bg-gray-200 rounded-large w-full"></div>
          <div className="h-8 bg-gray-200 rounded-large w-full"></div>
        </div>
      </div>
    ))}
  </div>
);
