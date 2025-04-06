import AdminSideBar from "@/app/_components/adminSideBar"
import AdminHeader from "@/app/_components/adminHeader"
import AdminSettingsComp from "@/app/_components/adminSettings"

export default function AdminSettings(){
    return(
        <div className="flex min-h-screen bg-gray-100">
            <AdminSideBar />
            <div className="flex flex-col flex-1"> 
                <AdminHeader />
                <AdminSettingsComp />
            </div>
        </div>
    )
}