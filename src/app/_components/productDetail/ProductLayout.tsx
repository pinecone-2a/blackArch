"use client";

import React from 'react';
import Header from '../homeHeader';
import Footer from '../homeFooter';
import { Toaster } from 'react-hot-toast';

type ProductLayoutProps = {
  children: React.ReactNode;
};

const ProductLayout: React.FC<ProductLayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <Toaster 
        position='top-center'
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          success: {
            duration: 3000,
          },
        }}
      />
      
      <main className='flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12'>
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductLayout; 