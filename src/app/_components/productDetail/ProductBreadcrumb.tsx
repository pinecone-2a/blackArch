"use client";

import React from 'react';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

type ProductBreadcrumbProps = {
  isLoading: boolean;
  productName?: string;
  categoryName?: string;
  categoryId?: string;
};

const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ 
  isLoading, 
  productName, 
  categoryName, 
  categoryId 
}) => {
  return (
    <div className="mb-6 py-4">
      <Breadcrumb>
        <BreadcrumbList className='text-sm sm:text-base flex items-center'>
          <BreadcrumbItem>
            <BreadcrumbLink className='hover:underline text-gray-600' href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className='hover:underline text-gray-600' href="/category">Shop</BreadcrumbLink>
          </BreadcrumbItem>
          {isLoading ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Skeleton className="h-5 w-20 rounded" />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Skeleton className="h-5 w-24 rounded" />
              </BreadcrumbItem>
            </>
          ) : (
            <>
              {categoryName && categoryId && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      className='hover:underline text-gray-600' 
                      href={`/category?cat=${categoryId}`}
                    >
                      {categoryName}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className='text-black font-medium'>
                  {productName || 'Product'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default ProductBreadcrumb; 