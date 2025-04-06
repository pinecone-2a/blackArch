import AdminSideBar from "@/app/_components/adminSideBar"
import AdminHeader from "@/app/_components/adminHeader"
import AdminOrdersComp from "@/app/_components/adminOrders"

export default function AdminOrders(){
    return(
        <div className="flex min-h-screen bg-gray-100">
            <AdminSideBar />
            <div className="flex flex-col flex-1"> 
                <AdminHeader />
                <AdminOrdersComp />
            </div>
        </div>
    )
}