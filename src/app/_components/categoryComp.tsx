"use client";

import HomeHeader from "./homeHeader";
import Footer from "./homeFooter";
import { Star, Search, SlidersHorizontal, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import type { Product } from "../home/page";
import Link from "next/link";
import Reveal from "./Reavel";
import NextInstantSearch from "@/components/algolia/NextInstantSearch";
import { searchClient } from "@/lib/algolia/searchClient";
import { INSTANT_SEARCH_INDEX_NAME } from "@/lib/constants/types";
import {
  Configure,
  Hits,
  SearchBox,
  Pagination,
  RefinementList,
  SortBy,
  CurrentRefinements,
  ClearRefinements,
  Stats,
  RangeInput,
  ToggleRefinement,
  useHits,
  HierarchicalMenu
} from "react-instantsearch";
import HitComponent from "@/components/algolia/HitComponent";
import CustomPagination from "@/components/algolia/CustomPagination";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const HitAttributeDebugger = (): null => {
  const { hits } = useHits();
  
  useEffect(() => {
    if (hits.length > 0) {
      console.log('First hit attributes:', Object.keys(hits[0]));
      console.log('Sample hit:', hits[0]);
    }
  }, [hits]);
  
  return null;
};

const IndexSelector = ({ 
  sortBy, 
  isMobile, 
  FilterPanel, 
  ProductItem,
  applyFilters
}: { 
  sortBy: string;
  isMobile: boolean;
  FilterPanel: React.FC;
  ProductItem: React.FC<{hit: any}>;
  applyFilters: () => void;
}) => {
  const indexName = sortBy === 'price:asc' 
    ? `${INSTANT_SEARCH_INDEX_NAME}_price_asc` 
    : sortBy === 'price:desc'
    ? `${INSTANT_SEARCH_INDEX_NAME}_price_desc`
    : INSTANT_SEARCH_INDEX_NAME;
  
  // Get numeric filters from URL if they exist
  const [numericFilters, setNumericFilters] = useState<string[]>([]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const numericFilterParam = params.get('numericFilters');
      if (numericFilterParam) {
        setNumericFilters(numericFilterParam.split(','));
      }
    }
  }, []);
  
  return (
    <NextInstantSearch
      searchClient={searchClient}
      indexName={indexName}
      routing={true}
      insights={true}
    >
      <Configure 
        hitsPerPage={16} 
        distinct={true}
        attributesToSnippet={['name:10', 'description:25']}
        snippetEllipsisText="..."
        facets={['*']}
        maxValuesPerFacet={100}
        numericFilters={numericFilters}
      />
      <HitAttributeDebugger />
      
      <div className="mt-24 pt-4 pb-16 w-full max-w-full mx-auto overflow-hidden">
        <div className="flex justify-between items-center mb-6 px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold">Бүх хувцас</h1>
          
          <div className="flex items-center space-x-4">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Шүүлтүүр
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Шүүлтүүр</SheetTitle>
                    <SheetDescription>
                      Хувцасны төрөл болон үнийн шүүлтүүр
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <ClearRefinements
                      classNames={{
                        button: "text-sm text-gray-500 hover:text-gray-700 mb-4 underline",
                        disabledButton: "text-sm text-gray-300 mb-4"
                      }}
                      translations={{
                        resetButtonText: 'Бүгдийг цэвэрлэх',
                      }}
                    />
                    <FilterPanel />
                    <div className="mt-6 pt-4 border-t flex justify-end">
                      <SheetClose asChild>
                        <Button className="bg-black hover:bg-gray-800" onClick={applyFilters}>
Хайх                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            
            <select 
              className="h-10 rounded-md border border-input bg-transparent pl-3 pr-8 py-2 text-sm shadow-sm transition-colors min-w-[100px] md:min-w-[160px]"
              onChange={(e) => {
                const value = e.target.value;
                const searchParams = new URLSearchParams(window.location.search);
                if (value) {
                  searchParams.set('sortBy', value);
                } else {
                  searchParams.delete('sortBy');
                }
                
                window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
              }}
              value={sortBy}
            >
              <option value="">Эрэмбэлэх</option>
              <option value="price:asc">Үнэ: Бага → Их</option>
              <option value="price:desc">Үнэ: Их → Бага</option>
            </select>
          </div>
        </div>
        
        <div className="px-4 md:px-6 mb-6">
          <div className="relative w-full max-w-3xl mx-auto">
            <SearchBox
              placeholder="Бүтээгдэхүүн хайх..."
              classNames={{
                root: "relative w-full",
                input: "w-full h-12 pl-12 pr-10 rounded-full border-2 border-gray-200 bg-white text-sm shadow transition-colors focus-within:border-black focus:outline-none focus:ring-1 focus:ring-black",
                submit: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400",
                reset: "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400",
                loadingIndicator: "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400",
              }}
              submitIconComponent={() => (
                <Search className="h-5 w-5 text-gray-500" />
              )}
            />
          </div>
        </div>
        
        <div className="px-4 md:px-6 mb-4">
          <CurrentRefinements
            classNames={{
              root: "flex flex-wrap items-center gap-2 mb-2",
              item: "flex items-center",
              category: "flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm",
              delete: "ml-2 text-gray-500 hover:text-gray-700",
            }}
            transformItems={(items) =>
              items.map(item => ({
                ...item,
                label: item.label === 'price' ? 'Үнэ' : 
                       item.label === 'categoryId' ? 'Ангилал' :
                       item.label === 'categoryName' ? 'Ангилал' :
                       item.label === 'size' ? 'Хэмжээ' : item.label,
              }))
            }
          />
          <Stats
            classNames={{
              root: "text-sm text-gray-500",
            }}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 px-2 md:px-4">
          <div className="hidden md:block md:w-1/4 w-full">
            <div className="sticky top-24 p-4 rounded-lg border bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Шүүлтүүр</h2>
                <ClearRefinements
                  classNames={{
                    button: "text-sm text-gray-500 hover:text-gray-700 underline",
                    disabledButton: "text-sm text-gray-300"
                  }}
                  translations={{
                    resetButtonText: 'Цэвэрлэх',
                  }}
                />
              </div>
              <FilterPanel />
            </div>
          </div>

          <div className="md:w-3/4 w-full">
            <Hits<any>
              hitComponent={({ hit }) => <ProductItem hit={hit} />}
              classNames={{
                root: "",
                list: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 p-2 sm:p-4",
                item: "",
              }}
            />
            <div className="mt-8">
              <CustomPagination />
            </div>
          </div>
        </div>
      </div>
    </NextInstantSearch>
  );
};

export default function CategoryComp() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sortParam = params.get('sortBy');
      if (sortParam) {
        setSortBy(sortParam);
      }
      
      const numericFilterParam = params.get('numericFilters');
      if (numericFilterParam) {
        if (numericFilterParam === 'price<=50000') {
          setSelectedPriceRange('0-50000');
        } else if (numericFilterParam === 'price>=50000,price<=100000') {
          setSelectedPriceRange('50000-100000');
        } else if (numericFilterParam === 'price>=100000') {
          setSelectedPriceRange('100000-plus');
        }
      }
    }
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const applyFilters = () => {
    const searchParams = new URLSearchParams(window.location.search);
    
    if (selectedPriceRange === '0-50000') {
      searchParams.set('numericFilters', 'price<=50000');
    } else if (selectedPriceRange === '50000-100000') {
      searchParams.set('numericFilters', 'price>=50000,price<=100000');
    } else if (selectedPriceRange === '100000-plus') {
      searchParams.set('numericFilters', 'price>=100000');
    } else {
      searchParams.delete('numericFilters');
    }
    
    if (sortBy) {
      searchParams.set('sortBy', sortBy);
    }
    
    window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
  };

  const ProductItem = ({ hit }: { hit: any }) => {
    // Make sure we have a valid ID to link to
    const productId = hit.id || hit.objectID;
    
    // Don't render if no valid ID found
    if (!productId) {
      console.error('Product missing ID', hit);
      return null;
    }
    
    return (
      <Link
        href={`/productDetail/${productId}`}
        className="transform transition-transform hover:scale-[1.02]"
      >
        <div className="group bg-white h-[300px] sm:h-[320px] rounded-xl border shadow-sm p-2 sm:p-3 flex flex-col items-center relative overflow-hidden transition-all duration-300 ease-in-out">
          <div className="w-full h-[160px] sm:h-[180px] md:h-[200px] flex items-center justify-center overflow-hidden rounded-lg">
            <img
              src={hit.image}
              alt={hit.name}
              className="object-contain h-full w-full p-1 sm:p-2 transition-transform duration-700 ease-in-out group-hover:scale-110"
            />
          </div>
          <div className="mt-2 sm:mt-3 w-full text-center">
            <h3 className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base lg:text-lg truncate">
              {hit.name}
            </h3>
            {hit.categoryName && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block my-1">
                {hit.categoryName}
              </span>
            )}
            <p className="mt-1 sm:mt-2 text-base sm:text-lg md:text-xl font-bold text-gray-900">
              ₮{Number(hit.price).toLocaleString()}
            </p>
          </div>
          <div className="absolute bottom-0 w-full">
            <Button className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out w-full rounded-t-none rounded-b-xl h-10 shadow-lg bg-black text-white hover:bg-gray-800">
              Дэлгэрэнгүй
            </Button>
          </div>
        </div>
      </Link>
    );
  };

  const FilterPanel = () => {
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const numericFilterParam = params.get('numericFilters');
        
        if (numericFilterParam) {
          if (numericFilterParam === 'price<=50000') {
            setSelectedPriceRange('0-50000');
          } else if (numericFilterParam === 'price>=50000,price<=100000') {
            setSelectedPriceRange('50000-100000');
          } else if (numericFilterParam === 'price>=100000') {
            setSelectedPriceRange('100000-plus');
          }
        }
      }
    }, []);
    
    // Function to update price filter
    const updatePriceFilter = (range: string) => {
      setSelectedPriceRange(range);
    };
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Ангилал</h3>
          <RefinementList
            attribute="categoryName"
            classNames={{
              root: "space-y-2",
              checkbox: "mr-2 h-4 w-4 rounded border-gray-300 text-black focus:ring-black",
              count: "ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full",
              label: "flex items-center text-sm cursor-pointer hover:text-black",
              labelText: "flex-grow",
            }}
            sortBy={['count:desc']}
            limit={20}
            operator="or"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Үнийн хязгаар</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center">
              <input
                type="radio"
                id="price-all"
                name="price"
                checked={selectedPriceRange === 'all'}
                className="mr-2 h-4 w-4 rounded-full border-gray-300 text-black focus:ring-black"
                onChange={() => {
                  updatePriceFilter('all');
                  // If not mobile, apply immediately
                  if (!isMobile) {
                    const searchParams = new URLSearchParams(window.location.search);
                    searchParams.delete('numericFilters');
                    window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
                  }
                }}
              />
              <label htmlFor="price-all" className="text-sm">Бүх үнэ</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="price-0-50000"
                name="price"
                checked={selectedPriceRange === '0-50000'}
                className="mr-2 h-4 w-4 rounded-full border-gray-300 text-black focus:ring-black"
                onChange={() => {
                  updatePriceFilter('0-50000');
                  // If not mobile, apply immediately
                  if (!isMobile) {
                    const searchParams = new URLSearchParams(window.location.search);
                    searchParams.set('numericFilters', 'price<=50000');
                    window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
                  }
                }}
              />
              <label htmlFor="price-0-50000" className="text-sm">₮0 - ₮50,000</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="price-50000-100000"
                name="price"
                checked={selectedPriceRange === '50000-100000'}
                className="mr-2 h-4 w-4 rounded-full border-gray-300 text-black focus:ring-black"
                onChange={() => {
                  updatePriceFilter('50000-100000');
                  // If not mobile, apply immediately
                  if (!isMobile) {
                    const searchParams = new URLSearchParams(window.location.search);
                    searchParams.set('numericFilters', 'price>=50000,price<=100000');
                    window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
                  }
                }}
              />
              <label htmlFor="price-50000-100000" className="text-sm">₮50,000 - ₮100,000</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="price-100000-plus"
                name="price"
                checked={selectedPriceRange === '100000-plus'}
                className="mr-2 h-4 w-4 rounded-full border-gray-300 text-black focus:ring-black"
                onChange={() => {
                  updatePriceFilter('100000-plus');
                  // If not mobile, apply immediately
                  if (!isMobile) {
                    const searchParams = new URLSearchParams(window.location.search);
                    searchParams.set('numericFilters', 'price>=100000');
                    window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
                  }
                }}
              />
              <label htmlFor="price-100000-plus" className="text-sm">₮100,000+</label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Хэмжээ</h3>
          <RefinementList
            attribute="size"
            classNames={{
              root: "space-y-2",
              checkbox: "mr-2 h-4 w-4 rounded border-gray-300 text-black focus:ring-black",
              count: "ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full",
              label: "flex items-center text-sm cursor-pointer hover:text-black",
              labelText: "flex-grow",
            }}
            sortBy={['count:desc']}
            limit={10}
            operator="or"
          />
        </div>
      </div>
    );
  };

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    
    const searchParams = new URLSearchParams(window.location.search);
    if (value) {
      searchParams.set('sortBy', value);
    } else {
      searchParams.delete('sortBy');
    }
    
    window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <HomeHeader />
        <div className="mt-24 pt-4 pb-16 w-full mx-auto overflow-hidden">
          {/* Header section with title and sort dropdown */}
          <div className="flex justify-between items-center mb-6 px-4 md:px-6">
            <h1 className="text-3xl md:text-4xl font-bold">Бүх хувцас</h1>
            <div className="flex items-center space-x-4">
              {/* Mobile filter button skeleton */}
              <div className="h-10 w-28 bg-gray-100 animate-pulse rounded-md md:hidden"></div>
              {/* Sort dropdown skeleton */}
              <div className="h-10 w-[160px] bg-gray-100 animate-pulse rounded-md"></div>
            </div>
          </div>
          
          {/* Search bar skeleton */}
          <div className="px-4 md:px-6 mb-6">
            <div className="relative w-full max-w-3xl mx-auto">
              <div className="w-full h-12 rounded-full border-2 border-gray-200 bg-gray-100 animate-pulse"></div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          
          {/* Current refinements and stats skeleton */}
          <div className="px-4 md:px-6 mb-4">
            <div className="h-6 w-64 bg-gray-100 animate-pulse rounded-md mb-2"></div>
            <div className="h-4 w-32 bg-gray-100 animate-pulse rounded-md"></div>
          </div>
          
          {/* Main content section */}
          <div className="flex flex-col md:flex-row gap-6 px-2 md:px-4">
            {/* Filter panel skeleton - only shown on desktop */}
            <div className="hidden md:block md:w-1/4 w-full">
              <div className="sticky top-24 p-4 rounded-lg border bg-white">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-7 w-24 bg-gray-100 animate-pulse rounded"></div>
                  <div className="h-5 w-16 bg-gray-100 animate-pulse rounded"></div>
                </div>
                
                {/* Category filter section */}
                <div className="space-y-4">
                  <div>
                    <div className="h-6 w-32 bg-gray-100 animate-pulse rounded mb-3"></div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div key={`cat-${item}`} className="flex items-center">
                          <div className="h-4 w-4 bg-gray-100 animate-pulse rounded mr-2"></div>
                          <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded"></div>
                          <div className="h-4 w-6 bg-gray-100 animate-pulse rounded-full ml-2"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="h-6 w-40 bg-gray-100 animate-pulse rounded mb-3"></div>
                    <div className="mt-4 space-y-3">
                      {[1, 2, 3, 4].map((item) => (
                        <div key={`price-${item}`} className="flex items-center">
                          <div className="h-4 w-4 bg-gray-100 animate-pulse rounded-full mr-2"></div>
                          <div className="h-4 w-28 bg-gray-100 animate-pulse rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="h-6 w-24 bg-gray-100 animate-pulse rounded mb-3"></div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((item) => (
                        <div key={`size-${item}`} className="flex items-center">
                          <div className="h-4 w-4 bg-gray-100 animate-pulse rounded mr-2"></div>
                          <div className="h-4 w-12 bg-gray-100 animate-pulse rounded"></div>
                          <div className="h-4 w-6 bg-gray-100 animate-pulse rounded-full ml-2"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-3/4 w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 p-2 sm:p-4">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white h-[300px] sm:h-[320px] rounded-xl border shadow-sm p-2 sm:p-3 flex flex-col items-center relative overflow-hidden"
                  >
                    <div className="w-full h-[160px] sm:h-[180px] md:h-[200px] bg-gray-100 animate-pulse rounded-lg"></div>
                    
                    <div className="mt-2 sm:mt-3 w-full text-center">
                      <div className="h-4 sm:h-5 w-3/4 bg-gray-100 animate-pulse rounded mx-auto mb-1 sm:mb-2"></div>
                      <div className="h-3 sm:h-4 w-1/2 bg-gray-100 animate-pulse rounded-full mx-auto mb-1 sm:mb-2"></div>
                      <div className="h-5 sm:h-6 w-1/3 bg-gray-100 animate-pulse rounded mx-auto"></div>
                    </div>
                    
                    <div className="absolute bottom-0 w-full">
                      <div className="w-full h-10 bg-gray-100 animate-pulse rounded-b-xl opacity-0"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={`page-${i}`} className="h-8 sm:h-10 w-8 sm:w-10 bg-gray-100 animate-pulse rounded-md"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HomeHeader />
      <IndexSelector 
        sortBy={sortBy} 
        isMobile={isMobile}
        FilterPanel={FilterPanel}
        ProductItem={ProductItem}
        applyFilters={applyFilters}
      />
      <Footer />
    </div>
  );
}