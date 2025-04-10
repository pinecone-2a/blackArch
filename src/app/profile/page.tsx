"use client";

import { useProfile } from "@/lib/customHooks/useProfile";
import { useRouter } from "next/navigation";

import ProfileLayout from "../_components/profile/ProfileLayout";
import LoginPrompt from "../_components/profile/LoginPrompt";
import ProfileHeader from "../_components/profile/ProfileHeader";
import ProfileTabs from "../_components/profile/ProfileTabs";
import OrdersList from "../_components/profile/OrdersList";
import AddressForm from "../_components/profile/AddressForm";
import AccountInfo from "../_components/profile/AccountInfo";

export default function ProfilePage() {
  const router = useRouter();
  const { 
    user, 
    orders, 
    address, 
    loading, 
    ordersLoading,
    addressLoading, 
    error, 
    updateAddress, 
    refreshUserData 
  } = useProfile();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Mongolian months
    const months = [
      'Нэгдүгээр сар', 'Хоёрдугаар сар', 'Гуравдугаар сар', 
      'Дөрөвдүгээр сар', 'Тавдугаар сар', 'Зургадугаар сар', 
      'Долдугаар сар', 'Наймдугаар сар', 'Есдүгээр сар', 
      'Аравдугаар сар', 'Арван нэгдүгээр сар', 'Арван хоёрдугаар сар'
    ];
    
    return `${date.getFullYear()} оны ${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Show loading state while checking user authentication
  if (loading) {
    return (
      <ProfileLayout>
        <div className="flex flex-col items-center justify-center w-full h-[50vh]">
          <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
            <h2 className="text-xl font-medium mb-2">Хэрэглэгчийн мэдээлэл ачааллаж байна</h2>
            <p className="text-gray-600">Түр хүлээнэ үү...</p>
          </div>
        </div>
      </ProfileLayout>
    );
  }

  // If not logged in, show login prompt
  if (!user) {
    return (
      <ProfileLayout>
        <LoginPrompt />
      </ProfileLayout>
    );
  }

  // Return the profile content once loading is complete and user is logged in
  return (
    <ProfileLayout>
      <div className="flex flex-col w-full">
        <div className="w-full">
          <ProfileHeader 
            user={user} 
            ordersCount={orders.length} 
            formatDate={formatDate} 
          />
        </div>
        
        <div className="mt-8">
          <ProfileTabs
            ordersTab={
              <OrdersList
                orders={orders}
                loading={loading}
                ordersLoading={ordersLoading}
                error={error}
                refreshUserData={refreshUserData}
                formatDate={formatDate}
              />
            }
            addressesTab={
              <AddressForm
                address={address}
                loading={addressLoading}
                refreshUserData={refreshUserData}
                updateAddress={updateAddress}
              />
            }
            accountTab={
              <AccountInfo
                user={user}
                formatDate={formatDate}
              />
            }
          />
        </div>
      </div>
    </ProfileLayout>
  );
}
