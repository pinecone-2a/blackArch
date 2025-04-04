"use client"

import { searchClient } from "@/lib/algolia/searchClient";
import { INSTANT_SEARCH_INDEX_NAME } from "@/lib/constants/types";
import React, { useState, useRef, useEffect } from "react";
import { Configure, useSearchBox } from "react-instantsearch";
import { Hits } from "react-instantsearch";
import Autocomplete from "./AutoComplete";
import HitComponent from "@/components/algolia/HitComponent";
import CustomPagination from "./CustomPagination";
import PopularSearches from "./PopularSearches";
import NextInstantSearch from "./NextInstantSearch";
import { Search as SearchIcon, X } from "lucide-react";

interface HitType {
  objectID: string;
  [key: string]: any;
  name: string;
  description: string;
  id: string;
  image: string;
  price?: number;
  rating?: number;
  discount?: number;
  category?: string;
}

const SearchControl = () => {
  const { query, refine } = useSearchBox();
  const [inputValue, setInputValue] = useState(query);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refine(inputValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClearSearch = () => {
    setInputValue("");
    refine("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    refine(inputValue);
  }, [inputValue, refine]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative w-full max-w-xl mx-auto"
    >
      <div className={`flex items-center relative bg-white border rounded-full transition-all overflow-hidden
        ${isInputFocused ? 'ring-2 ring-black shadow-sm' : 'border-gray-300'}`}
      >
        <SearchIcon className="w-5 h-5 text-gray-500 ml-4" />

        <input
          ref={inputRef}
          className="flex-1 px-3 py-3 text-base bg-transparent outline-none text-gray-900 placeholder-gray-500"
          type="search"
          placeholder="Search products, brands, categories..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          autoComplete="off"
        />

        {inputValue && (
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none mr-1"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default function SearchAlgolia() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  return (
    <NextInstantSearch
      initialUiState={{
        products: {
          query: "",
          page: 1,
        },
      }}
      searchClient={searchClient}
      indexName={INSTANT_SEARCH_INDEX_NAME}
      insights
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure hitsPerPage={6} distinct={true} getRankingInfo={true} />
      
      <div className="flex flex-col items-center">
        <div className="w-full max-w-xl">
          <SearchControl />
        </div>
        
        <div className="w-full max-w-xl flex justify-center mt-2">
          <PopularSearches queries={['Jacket', 'T-shirt', 'Shoes', 'Accessories']} />
        </div>

        <div className="mt-6 w-full max-w-5xl">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50">
              <h2 className="text-sm font-medium text-gray-700">Search Results</h2>
              <span className="text-xs text-gray-500">
                <ConnectedSearchResults />
              </span>
            </div>
            
            <div className="divide-y divide-gray-200">
              <Hits<HitType> hitComponent={({ hit }) => <HitComponent hit={hit} />} />
            </div>
            
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <CustomPagination />
            </div>
          </div>
        </div>
      </div>
    </NextInstantSearch>
  );
}

// Component to display search result count
const ConnectedSearchResults = () => {
  const { query } = useSearchBox();
  if (!query) return null;
  return (
    <span>Showing results for "<strong>{query}</strong>"</span>
  );
};