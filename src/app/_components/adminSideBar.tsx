"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Store, ChartBarStacked, ShoppingBag, Settings } from "lucide-react";

export default function AdminSideBar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", icon: Store, href: "/admin" },
    { name: "Products", icon: ShoppingBag, href: "/admin/products" },
   
  ];

  return (
    <div className="h-screen w-[20%] bg-white p-5 ">
      <div className="flex items-center justify-start mb-5">
        <Image  src="/reallogo.jpg" width={100} height={100} alt="logo" />
        <h1 className="text-3xl font-extrabold">PineShop</h1>
      </div>

      <div className="flex flex-col space-y-2">
        {menuItems.map(({ name, icon: Icon, href }) => (
          <Link key={name} href={href} legacyBehavior>
            <a
              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all ${
                pathname === href ? "bg-black text-white" : "hover:bg-gray-200"
              }`}
            >
              <Icon /> {name}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}