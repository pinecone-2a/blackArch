"use client"

import SearchAlgolia from "@/components/algolia/Search";

export default function SearchPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Product Search</h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm text-gray-500">
            Search for products by name, category, or description
          </p>
        </div>
        
        <div className="mt-8">
          <SearchAlgolia />
        </div>
      </div>
    </div>
  );
}