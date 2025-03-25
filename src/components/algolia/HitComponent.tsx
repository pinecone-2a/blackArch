import React from "react";

interface Hit {
  title: string;
  description: string;
}

const HitComponent = ({ hit }: { hit: Hit }) => {
  return (
    <div className="p-2 border-b border-gray-200">
      <h3 className="text-lg font-semibold">{hit.title}</h3>
      <p className="text-sm text-gray-600">{hit.description}</p>
    </div>
  );
};

export default HitComponent;