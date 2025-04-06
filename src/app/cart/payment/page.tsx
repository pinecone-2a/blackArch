"use client";

import Footer from "@/app/_components/homeFooter";
import Payment from "./payment";
import Navbar from "@/app/_components/homeHeader";
import Template from "@/app/_components/template";




export default function PaymentPage() {

  return (

        <div className="flex flex-col min-h-screen">
          <Template>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                <Payment />
              </div>
              <Footer />
            </div>
          </Template>
        </div>




  )


}