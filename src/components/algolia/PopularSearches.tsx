import React from 'react';
import { useSearchBox } from 'react-instantsearch';

interface PopularSearchesProps {
  queries: string[];
}

export default function PopularSearches({ queries }: PopularSearchesProps) {
  const { refine } = useSearchBox();

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {queries.map((query) => (
        <button
          key={query}
          type="button"
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 hover:text-gray-900 transition-colors"
          onClick={() => refine(query)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          {query}
        </button>
      ))}
    </div>
  );
}