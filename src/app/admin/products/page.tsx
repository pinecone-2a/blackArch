import AdminSideBar from "@/app/_components/adminSideBar"
import AdminProductsComp from "@/app/_components/adminProduct"
import AdminHeader from "@/app/_components/adminHeader"
import AdminCategoryComp from "@/app/_components/adminCategory"
export default function AdminProducts(){
    return(
 <div className="flex min-h-screen bg-gray-100">
      <AdminSideBar />
      <div className="flex flex-col flex-1"> 
        <AdminHeader />
        <AdminProductsComp />
      </div>
    </div>
    )
}