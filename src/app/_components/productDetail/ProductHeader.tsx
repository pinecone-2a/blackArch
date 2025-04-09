"use client"
import React from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

type ProductHeaderProps = {
    isLoading: boolean;
    productName?: string;
};

const ProductHeader: React.FC<ProductHeaderProps> = ({ isLoading, productName }) => {
    return (
        <div className="py-4">
            <Breadcrumb>
                <BreadcrumbList className='text-lg sm:text-xl flex text-gray-300 items-center'>
                    <BreadcrumbItem>
                        <BreadcrumbLink className='hover:underline' href="/">Нүүр</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink className='hover:underline' href="/category">Бүх хувцас</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className='text-black'>
                            {isLoading ? (
                                <Skeleton className="h-6 w-20" />
                            ) : productName || 't-Shirt'}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};

export default ProductHeader; 