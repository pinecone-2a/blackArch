import { MdOutlineEmail } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (

    <div className="2xl:w-[80%] w-full mx-auto my-5 xl:px-5 lg:px-5 md:px-2 sm:px-1">
      <footer>
        <div className="flex flex-wrap justify-between mt-10 gap-10">
          <div className="flex-grow flex flex-col mx-5 gap-10">
            <h1 className="font-bold text-3xl">PINESHOP</h1>
            <p className="max-w-72">
              We have clothes that suits your style and which you’re proud to
              wear. From women to men.
            </p>
            <div className="flex gap-5">
              <FaXTwitter size={25} />
              <FaFacebook size={25} />
              <FaInstagram size={25} />
              <FaGithub size={25} />
            </div>
          </div>
          <div className="flex-grow flex gap-5 flex-col justify-center items-center">
            <h1 className="font-semibold -ml-20">Company</h1>
            <ul className="flex flex-col gap-5">
              <li className="hover:underline underline-offset-4 cursor-pointer">About</li>
              <li className="hover:underline underline-offset-4 cursor-pointer">Features</li>
              <li className="hover:underline underline-offset-4 cursor-pointer">Works</li>
              <li className="hover:underline underline-offset-4 cursor-pointer">Career</li>
            </ul>
          </div>
          <div className="flex-grow flex gap-5 flex-col justify-center items-center">
            <h1 className="font-semibold -ml-24">Help</h1>
            <ul className="flex flex-col gap-5">
              <li className="hover:underline underline-offset-4 cursor-pointer">Customer Support</li>
              <li className="hover:underline underline-offset-4 cursor-pointer">Delivery Details</li>
              <li className="hover:underline underline-offset-4 cursor-pointer">Terms & Conditions</li>
              <li className="hover:underline underline-offset-4 cursor-pointerks">Privacy Policy</li>
            </ul>
          </div>
          <div className="flex-grow flex gap-5 flex-col justify-center items-center">
            <h1 className="font-semibold -ml-24">FAQ</h1>
            <ul className="flex flex-col gap-5">
              <li className="hover:underline underline-offset-4 cursor-pointer">Account</li>
              <li className="hover:underline underline-offset-4 cursor-pointer">Manage Deliveries</li>
              <li className="hover:underline underline-offset-4 cursor-pointer">Orders</li>
              <li className="hover:underline underline-offset-4 cursor-pointer">Payments</li>
            </ul>
          </div>
          <div className="flex-grow flex gap-5 flex-col justify-center items-center">
            <h1 className="font-semibold -ml-20">Resources</h1>
            <ul className="flex flex-col gap-5">
              <li className="hover:underline underline-offset-4 cursor-pointer">Free eBooks</li>
              <li className="hover:underline underline-offset-4 cursor-pointer">Development Tutorial</li>
              <li className="hover:underline underline-offset-4 cursor-pointer">How to - Blog</li>
              <li className="hover:underline underline-offset-4 cursor-pointer">Youtube Playlist</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-center mt-10 gap-y-5 border-t-4 items-center flex-wrap">
          <div className="flex-grow text-center md:text-left">
            Pineshop © 2000-2025, All Rights Reserved
          </div>
          <div className="w-fit"></div>
        </div>
      </footer>
    </div>
  );
}
