"use client";

import { useState, useEffect } from "react";

type QPayUrl = {
  data?: {
    qr_image?: string;
    qr_text?: string;
    urls?: any[];
    [key: string]: any;
  };
  urls?: any[];
  response?: {
    data?: {
      urls?: any[];
      [key: string]: any;
    };
  };
  [key: string]: any;
}

export const BankIcons = ({ qpayData }: { qpayData: QPayUrl }) => {
  const [icons, setIcons] = useState<Array<any>>([]);
  
  useEffect(() => {
    const defaultBanks = [
      { name: "Khan Bank", logo: "https://qpay.mn/q/logo/khan.png", link: "https://qpay.mn" },
      { name: "Golomt Bank", logo: "https://qpay.mn/q/logo/golomt.png", link: "https://qpay.mn" },
      { name: "TDB", logo: "https://qpay.mn/q/logo/tdb.png", link: "https://qpay.mn" },
      { name: "Xac Bank", logo: "https://qpay.mn/q/logo/xac.png", link: "https://qpay.mn" },
      { name: "State Bank", logo: "https://qpay.mn/q/logo/state.png", link: "https://qpay.mn" }
    ];
    
    try {
      if (qpayData?.data?.urls && Array.isArray(qpayData.data.urls) && qpayData.data.urls.length > 0) {
        setIcons(qpayData.data.urls);
      } else if (qpayData?.urls && Array.isArray(qpayData.urls)) {
        setIcons(qpayData.urls);
      } else if (qpayData?.response?.data?.urls && Array.isArray(qpayData.response.data.urls)) {
        setIcons(qpayData.response.data.urls);
      } else {
        setIcons(defaultBanks);
      }
    } catch (error) {
      setIcons(defaultBanks);
    }
  }, [qpayData]);
  
  if (!icons.length) return null;
  
  return (
    <div className="grid grid-cols-3 gap-3 mb-5 max-w-sm mx-auto md:hidden">
      {icons.slice(0, 17).map((bank, index) => (
        <div key={index} className="flex flex-col items-center">
          <a 
            href={bank.link || "https://qpay.mn"} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-12 h-12 bg-white rounded-lg p-1 shadow-sm flex items-center justify-center mb-1 hover:shadow-md transition-shadow"
          >
            <img 
              src={bank.logo || 'https://qpay.mn/img/logo.png'} 
              alt={bank.name || 'Bank'} 
              className="w-10 h-10 object-contain" 
              onError={(e) => { e.currentTarget.src = 'https://qpay.mn/img/logo.png'; }} 
              loading="eager"
            />
          </a>
          <span className="text-xs text-center line-clamp-1">{bank.name || 'Bank'}</span>
        </div>
      ))}
    </div>
  );
}; 