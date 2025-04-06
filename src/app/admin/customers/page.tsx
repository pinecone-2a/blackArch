import AdminSideBar from "@/app/_components/adminSideBar"
import AdminHeader from "@/app/_components/adminHeader"
import AdminUsersComp from "@/app/_components/adminUsers"

export default function AdminUsers(){
    return(
        <div className="flex min-h-screen bg-gray-100">
            <AdminSideBar />
            <div className="flex flex-col flex-1"> 
                <AdminHeader />
                <AdminUsersComp />
            </div>
        </div>
    )
}