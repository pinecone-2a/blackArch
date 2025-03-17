import AdminSideBar from "@/app/_components/adminSideBar"
import AdminCategoryComp from "@/app/_components/adminCategory"
export default function AdminCategory(){
    return (
        <div className="flex bg-black"> <AdminSideBar/>
           <AdminCategoryComp/></div>
    )
}