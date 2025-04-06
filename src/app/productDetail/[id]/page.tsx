"use client"
import React from 'react';
import { ProductDetailProps } from '@/app/_components/productDetail/types';
import ProductLayout from '@/app/_components/productDetail/ProductLayout';
import ProductBreadcrumb from '@/app/_components/productDetail/ProductBreadcrumb';
import ProductImageGallery from '@/app/_components/productDetail/ProductImageGallery';
import ProductInfo from '@/app/_components/productDetail/ProductInfo';
import SimilarProducts from '@/app/_components/productDetail/SimilarProducts';
import { useProductDetail } from '@/app/_components/productDetail/useProductDetail';

const ProductDetail: React.FC<ProductDetailProps> = ({ params }) => {
  const {
    product,
    isLoading,
    mainImage,
    isWishlist,
    productImages,
    similarProducts,
    formatPrice,
    toggleWishlist,
    handleAddToCart,
    handleImageChange,
    currentImageIndex
  } = useProductDetail(params.id);

  return (
    <ProductLayout>

      <ProductBreadcrumb 
        isLoading={isLoading}
        productName={product?.name}
        categoryName={product?.categoryName}
        categoryId={product?.categoryId}
      />


      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12'>

        <ProductImageGallery 
          isLoading={isLoading}
          mainImage={mainImage}
          productName={product?.name}
          productImages={productImages}
          isWishlist={isWishlist}
          onToggleWishlist={toggleWishlist}
          currentImageIndex={currentImageIndex}
          onImageChange={handleImageChange}
        />


        <ProductInfo 
          isLoading={isLoading}
          product={product || {}}
          onAddToCart={handleAddToCart}
          formatPrice={formatPrice}
        />
      </div>


      <SimilarProducts 
        isLoading={isLoading}
        products={similarProducts}
        formatPrice={formatPrice}
      />
    </ProductLayout>
  );
};

export default ProductDetail;
