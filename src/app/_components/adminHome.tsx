import { SetStateAction, useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ShoppingCart } from 'lucide-react';
import { Repeat } from 'lucide-react';
import { Truck } from 'lucide-react';
import { Check } from 'lucide-react';
export default function AdminHome() {
  const [status, setStatus] = useState("Pending");
  const [borderColor, setBorderColor] = useState("border-yellow-500");

  const handleChange = (selectedValue: SetStateAction<string>) => {
    setStatus(selectedValue);
    if (selectedValue === "Pending") {
      setBorderColor("border-yellow-500");
    } else if (selectedValue === "Delivered") {
      setBorderColor("border-green-500");
    } else if (selectedValue === "Cancelled") {
      setBorderColor("border-black");
    }
  };

  const stats = [
    { title: "Total Orders", count: 234, icon: <ShoppingCart/>, color: "bg-white" },
    { title: "Pending Orders", count: 765, icon: <Repeat/>, color: "bg-white text-red-600" },
    { title: "Processing Order", count: 123, icon: <Truck/>, color: "bg-white text-blue-600" },
    { title: "Completed Order", count: 834, icon: <Check/>, color: "bg-white text-green-600" },
  ];

  return (
    <div className="bg-white my-5 w-11/12 min-h-[600px] mx-auto rounded-3xl">
      <h1 className="text-2xl font-semibold mb-6 mx-5 mt-6">Dashboard Overview</h1>
      <div className="grid mx-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border flex items-center space-x-4">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full ${stat.color} text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500">{stat.title}</p>
              <p className="text-xl font-bold">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='mt-10 mx-5'>
        <h1 className="text-xl font-semibold mb-4">Recent Orders</h1>
        <div className="overflow-x-auto rounded-tl-xl rounded-tr-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-black text-left text-white">
                <th className="p-3">CUSTOMER NAME</th>
                <th className="p-3">ADDRESS</th>
                <th className="p-3">AMOUNT</th>
                <th className="p-3">ORDER TIME</th>
                <th className="p-3">PRODUCT</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">BUYKA</td>
                <td className="p-3">123 Main St, New York, NY 10001</td>
                <td className="p-3">25K </td>
                <td className="p-3">May 1, 2025 9:31 AM</td>
                <td className="p-3">Podwolk</td>
                <td className="p-3">
                  <Select value={status} onValueChange={handleChange}>
                    <SelectTrigger className={`font-[600] text-[12px] py-[6px] px-[10px] rounded-full w-[120px] border-2 ${borderColor}`}>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3 flex space-x-2">
                  <button className="text-black ml-5"><ZoomIn/></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
