import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative text-white py-6 mt-10 overflow-hidden h-96">
      <img
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="footer.gif"
      ></img>

      <div className="absolute inset-0 bg-opacity-50 z-10"></div>

      <div className="relative container mx-auto px-6 flex flex-col md:flex-row justify-between items-center z-20">
        <div className="text-2xl font-bold">Pineshop</div>

        <nav className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-400">
            Нүүр
          </a>
          <a href="#" className="hover:text-gray-400">
            Бидний тухай
          </a>
          <a href="#" className="hover:text-gray-400">
            Холбоо барих
          </a>
        </nav>

        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-blue-500">
            <FaFacebook size={24} />
          </a>
          <a href="#" className="hover:text-blue-400">
            <FaTwitter size={24} />
          </a>
          <a href="#" className="hover:text-red-500">
            <FaYoutube size={24} />
          </a>
        </div>
      </div>

      <div className="relative text-center text-gray-300 text-sm mt-4 z-20">
        © 2025 Pineshop. Бүх эрх хуулиар хамгаалагдсан.
      </div>
    </footer>
  );
}
