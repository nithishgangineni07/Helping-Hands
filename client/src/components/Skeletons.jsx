import React from 'react';

export const CampaignCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-soft animate-pulse space-y-4">
      <div className="w-full aspect-[16/10] bg-gray-200 rounded-xl"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-5 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-2.5 bg-gray-200 rounded-full w-full"></div>
        <div className="flex justify-between pt-1">
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="h-9 bg-gray-200 rounded-xl"></div>
        <div className="h-9 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl"></div>
        <div className="h-96 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
  );
};
