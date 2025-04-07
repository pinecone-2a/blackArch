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
  const { user, orders, address, loading, error, updateAddress, refreshUserData } = useProfile();
  
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

  if (!user) {
    return (
      <ProfileLayout>
        <LoginPrompt />
      </ProfileLayout>
    );
  }

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
                error={error}
                refreshUserData={refreshUserData}
                formatDate={formatDate}
              />
            }
            addressesTab={
              <AddressForm
                address={address}
                loading={loading}
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