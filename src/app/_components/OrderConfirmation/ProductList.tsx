"use client";

import { OrderDetails } from "./types";

type ProductListProps = {
  productDetails: OrderDetails["productDetails"];
  totalPrice: number;
};

export const ProductList = ({ productDetails, totalPrice }: ProductListProps) => {
  if (!productDetails || productDetails.length === 0) {
    return (
      <div className="mt-5 border rounded-lg p-6 text-center">
        <div className="text-gray-400 flex flex-col items-center justify-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span className="text-lg font-medium">Бүтээгдэхүүний мэдээлэл олдсонгүй</span>
          <p className="text-sm text-gray-500">Захиалгын бүтээгдэхүүний мэдээлэл шинэчлэгдэж байна</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 border rounded-lg overflow-hidden">
      <div className="bg-gray-50 py-3 px-4 border-b">
        <h3 className="text-base font-medium">Захиалсан бүтээгдэхүүнүүд</h3>
      </div>
      <div className="divide-y">
        {productDetails.map((product, index) => {
          const quantity = product.quantity || 1;
          const price = Number(product.price || 0);
          const subtotal = price * quantity;
          
          return (
            <div key={product.id || index} className="flex items-center p-4 hover:bg-gray-50">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded bg-gray-100 overflow-hidden mr-4 flex-shrink-0">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                      <circle cx="9" cy="9" r="2"></circle>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-base">{product.name || "Бүтээгдэхүүн"}</h4>
                  <p className="text-gray-800 font-medium">₮{subtotal.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <span className="inline-block w-4 h-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9h12"></path>
                          <path d="M6 15h12"></path>
                          <path d="M10 3H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"></path>
                          <path d="M10 3v4h4V3"></path>
                        </svg>
                      </span>
                      {quantity} ширхэг
                    </p>
                    <p className="text-gray-600 text-sm">₮{price.toLocaleString()} / ширхэг</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-gray-50 p-4 border-t">
        <div className="flex justify-between items-center">
          <p className="font-medium">Нийт {productDetails.length} төрлийн бүтээгдэхүүн</p>
          <p className="font-bold text-lg">₮{Number(totalPrice || 0).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}; 