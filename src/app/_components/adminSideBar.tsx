"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Store, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings, 
  Tag, 
  PieChart,
  LogOut
} from "lucide-react";

export default function AdminSideBar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Самбар", icon: Store, href: "/admin" },
    { name: "Бүтээгдэхүүн", icon: ShoppingBag, href: "/admin/products" },
    { name: "Ангилал", icon: Tag, href: "/admin/categories" },
    { name: "Хэрэглэгчид", icon: Users, href: "/admin/customers" },
    { name: "Захиалга", icon: BarChart3, href: "/admin/orders" },
    { name: "Анализ", icon: PieChart, href: "/admin/analytics" },
    { name: "Тохиргоо", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen w-[260px] bg-white shadow-lg flex flex-col justify-between">
      <div>
        <div className="px-6 py-6 border-b">
          <div className="flex items-center space-x-2">
          <Link href={"/"}>  
            <Image src="/reallogo.jpg" width={48} height={48} alt="PineShop" className="rounded-md" />
            <h1 className="text-2xl font-bold">PineShop</h1>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-1">Админ Самбар</p>
        </div>

        <div className="px-4 py-4">
          <h2 className="text-xs font-semibold text-gray-500 px-2 mb-3 uppercase tracking-wider">Үндсэн Меню</h2>
          <div className="space-y-1">
            {menuItems.slice(0, 5).map(({ name, icon: Icon, href }) => (
              <Link key={name} href={href} className="block">
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    pathname === href 
                      ? "bg-black text-white font-medium" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  <span>{name}</span>
                  {name === "Orders" && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">3</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
          
          <h2 className="text-xs font-semibold text-gray-500 px-2 mt-6 mb-3 uppercase tracking-wider">Систем</h2>
          <div className="space-y-1">
            {menuItems.slice(5).map(({ name, icon: Icon, href }) => (
              <Link key={name} href={href} className="block">
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    pathname === href 
                      ? "bg-black text-white font-medium" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  <span>{name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 m-4 mb-6 rounded-lg bg-gray-50">
        <div className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer">
          <LogOut size={18} />
          <span>Гарах</span>
        </div>
      </div>
    </div>
  );
}