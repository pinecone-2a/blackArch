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
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      <ProfileHeader 
        user={user} 
        ordersCount={orders.length} 
        formatDate={formatDate} 
      />
      
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
    </ProfileLayout>
  );
}