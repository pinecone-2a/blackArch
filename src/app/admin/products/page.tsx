import AdminSideBar from "@/app/_components/adminSideBar"
import AdminProductsComp from "@/app/_components/adminProduct"
import AdminCategoryComp from "@/app/_components/adminCategory"
export default function AdminProducts(){
    return(
        <div className="flex bg-[black]">
            <AdminSideBar/>
            
            
            <AdminProductsComp/>
            </div>
    )
}