import React from 'react';
import { usePagination } from 'react-instantsearch';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CustomPagination() {
  const {
    pages,
    currentRefinement,
    nbPages,
    isFirstPage,
    isLastPage,
    refine,
    createURL,
  } = usePagination();

  // No need to show pagination if there's only one page or no pages
  if (nbPages <= 1) {
    return null;
  }

  // For mobile, show limited pagination
  const pageRange = window?.innerWidth < 640 ? 3 : 5;
  
  // Determine which page numbers to show
  let startPage = Math.max(0, currentRefinement - Math.floor(pageRange / 2));
  const endPage = Math.min(nbPages - 1, startPage + pageRange - 1);
  
  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < pageRange) {
    startPage = Math.max(0, endPage - pageRange + 1);
  }

  const visiblePages = pages.slice(startPage, endPage + 1);

  return (
    <div className="flex flex-wrap justify-center items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        disabled={isFirstPage}
        onClick={() => refine(Math.max(0, currentRefinement - 1))}
      >
        <span className="sr-only">Previous page</span>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {startPage > 0 && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 hidden sm:flex"
            onClick={() => refine(0)}
          >
            <span>1</span>
          </Button>
          {startPage > 1 && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </>
      )}
      
      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={currentRefinement === page ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => refine(page)}
        >
          <span>{page + 1}</span>
        </Button>
      ))}
      
      {endPage < nbPages - 1 && (
        <>
          {endPage < nbPages - 2 && (
            <span className="px-2 text-gray-500">...</span>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 hidden sm:flex"
            onClick={() => refine(nbPages - 1)}
          >
            <span>{nbPages}</span>
          </Button>
        </>
      )}
      
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        disabled={isLastPage}
        onClick={() => refine(Math.min(nbPages - 1, currentRefinement + 1))}
      >
        <span className="sr-only">Next page</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}