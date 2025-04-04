import AdminSideBar from "@/app/_components/adminSideBar"
import AdminHeader from "@/app/_components/adminHeader"
import AdminCategoryComp from "@/app/_components/adminCategory"

export default function AdminCategories() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSideBar />
            <div className="flex flex-col flex-1"> 
                <AdminHeader />
                <AdminCategoryComp />
            </div>
        </div>
    )
}