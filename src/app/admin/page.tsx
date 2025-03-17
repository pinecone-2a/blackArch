import AdminSideBar from "../_components/adminSideBar"
import AdminHome from "../_components/adminHome"
export default function Admin(){
    return(
        <div className="flex bg-black"><AdminSideBar/>
        <AdminHome  /></div>
    )
}