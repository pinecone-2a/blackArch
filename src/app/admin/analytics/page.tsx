import AdminSideBar from "@/app/_components/adminSideBar"
import AdminHeader from "@/app/_components/adminHeader"
import AdminAnalyticsComp from "@/app/_components/adminAnalytics"

export default function AdminAnalytics(){
    return(
        <div className="flex min-h-screen bg-gray-100">
            <AdminSideBar />
            <div className="flex flex-col flex-1"> 
                <AdminHeader />
                <AdminAnalyticsComp />
            </div>
        </div>
    )
}