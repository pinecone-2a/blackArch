import { Facebook, Instagram, Youtube } from "lucide-react";
import Lottie from "lottie-react";
import facebook from "./facebook.json";
import instagram from "./instagram.json";
import youtube from "./youtube.json";

export default function MinimalistFooter() {
  return (
    <footer className="bg-black text-white py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-6 md:space-y-0 h-300">
        
   
        <div className="flex items-center space-x-2">
          <img src="/authlogo.jpg" className="w-8 h-8 text-3xl" />
          <h2 className="text-lg font-semibold tracking-wide">
            Pineshop
          </h2>
        </div>

      
        <div className="flex space-x-6">
          <a
            href="#"
            className="text-gray-400 hover:text-[#3b5998] transition"
          >
             <Lottie
                  animationData={facebook}
                  style={{ width: 100, height: 100 }}
                  onClick={() => window.open("https://www.facebook.com/", "_blank")}
                />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-[#C13584] transition"
          >
             <Lottie
                  animationData={instagram}
                  style={{ width: 100, height: 100 }}
                  onClick={() => window.open("https://www.instagram.com/", "_blank")}
                />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-[#3f83fb] transition"  
          >
            <Lottie
                  animationData={youtube}
                  style={{ width: 100, height: 100 }}
                  onClick={() => window.open("https://www.youtube.com/watch?v=LPTlvQ1Zet0", "_blank")}
                />
          </a>
        </div>

    
        <p className="text-white text-5xl text-sm">
          © 2025 Pineshop. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
