import Link from "next/link";
import React from "react";

interface Hit {
  name: string;
  description: string;
  image: string;
  objectId: string;
  id: string
}

const HitComponent = ({ hit }: { hit: Hit }) => {
  return (
    <Link href={`/productDetail/${hit.id}`}> 
    <div className="flex h-20 items-center p-4 bg-white hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200 space-x-4 z-9999">
      <div className="shrink-0">
        <img 
          className="h-16 w-16 object-cover rounded-lg shadow-md" 
          src={hit.image} 
          alt={`${hit.name} image`} 
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{hit.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{hit.description}</p>
      </div>
      <div>
      </div>
    </div>
    </Link>
  );
};

export default HitComponent;