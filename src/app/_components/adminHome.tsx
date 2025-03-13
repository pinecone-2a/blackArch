import { ZoomIn } from 'lucide-react';
export default function AdminHome() {
    const stats = [
        { title: "Total Orders", count: 23545, icon: "🛒", color: "bg-green-100 text-green-600" },
        { title: "Pending Orders", count: 23545, icon: "🔄", color: "bg-red-100 text-red-600" },
        { title: "Processing Order", count: 23545, icon: "🚚", color: "bg-blue-100 text-blue-600" },
        { title: "Completed Order", count: 23545, icon: "✔️", color: "bg-green-100 text-green-600" },
    ];

    return (
        <div className="mt-10 w-[70%] mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
        <div className='mt-10'>
            <h1 className="text-xl font-semibold mb-4">Recent Orders</h1>
            <div className="overflow-x-auto rounded-tl-xl rounded-tr-xl overflow-hidden">
            <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-black text-left text-white">
                            <th className="p-3">INVOICE NO</th>
                            <th className="p-3">CUSTOMER NAME</th>
                            <th className="p-3">METHOD</th>
                            <th className="p-3">AMOUNT</th>
                            <th className="p-3">ORDER TIME</th>
                            <th className="p-3">STATUS</th>
                            <th className="p-3">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="p-3">#DSFSD322</td>
                            <td className="p-3">BUYKA</td>
                            <td className="p-3">CASH</td>
                            <td className="p-3">$32423</td>
                            <td className="p-3">May 1, 2025 9:31 AM</td>
                            <td className="p-3">Pending</td>
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
