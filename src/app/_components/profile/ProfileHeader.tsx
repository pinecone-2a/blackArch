"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, ShoppingBag, LogOut, Settings } from 'lucide-react';
import { useRouter } from "next/navigation";

interface ProfileHeaderProps {
  user: {
    id: string;
    email: string;
    userData?: string;
    createdAt?: string;
  };
  ordersCount: number;
  formatDate: (dateString: string) => string;
}

export default function ProfileHeader({ user, ordersCount, formatDate }: ProfileHeaderProps) {
  const router = useRouter();
  const userCreatedAt = user.userData ? 
    JSON.parse(user.userData)?.createdAt || null : 
    null;

  const getInitials = (email: string | undefined) => {
    if (!email) return "U";
    const parts = email.split("@")[0].split(/[.-_]/);
    if (parts.length === 1) {
      return email.substring(0, 2).toUpperCase();
    }
    return parts.map(part => part.charAt(0).toUpperCase()).join("").substring(0, 2);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-20 w-20 border-4 border-white/20">
              <AvatarFallback className="bg-gray-700 text-white text-xl">{getInitials(user.email)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{user.email ? user.email.split('@')[0] : 'User'}</h1>
              <p className="text-gray-300 text-sm">{user.email || 'No email available'}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            <Badge variant="outline" className="bg-white/10 text-white border-transparent px-3 py-1 flex items-center gap-1">
              <User className="h-3 w-3" />
              Member since {userCreatedAt ? formatDate(userCreatedAt) : "N/A"}
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white border-transparent px-3 py-1 flex items-center gap-1">
              <ShoppingBag className="h-3 w-3" />
              {ordersCount} {ordersCount === 1 ? "order" : "orders"}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="bg-white/10 border-transparent hover:bg-white/20" 
            size="sm"
            onClick={() => router.push("/forgotpassword")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Change Password
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            className="bg-red-600 hover:bg-red-700"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
} 