"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CreditCard, ShoppingBag, LogOut, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AccountInfoProps {
  user: {
    id: string;
    email: string;
    userData?: string;
    createdAt?: string;
  };
  formatDate: (dateString: string) => string;
}

export default function AccountInfo({ user, formatDate }: AccountInfoProps) {
  const router = useRouter();
  const userCreatedAt = user.userData ? 
    JSON.parse(user.userData)?.createdAt || null : 
    null;
  
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="border overflow-hidden">
          <CardHeader>
            <CardTitle>Хэрэглэгчийн мэдээлэл</CardTitle>
            <CardDescription>Хувийн тохиргоогоо зохицуулах</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Хувийн мэдээлэл</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md bg-gray-50">
                    <p className="text-sm text-gray-500 mb-1">И-мэйл хаяг</p>
                    <p className="font-medium break-all">{user.email}</p>
                  </div>
                  <div className="p-4 border rounded-md bg-gray-50">
                    <p className="text-sm text-gray-500 mb-1">Бүртгүүлсэн огноо</p>
                    <p className="font-medium">{userCreatedAt ? formatDate(userCreatedAt) : "Тодорхойгүй"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Нууцлал</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-md bg-gray-50">
                    <div>
                      <p className="font-medium">Нууц үг</p>
                      <p className="text-sm text-gray-500">Нууц үгээ шинэчлэх</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push("/forgotpassword")}
                    >
                      Нууц үг солих
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 mt-4 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Бүртгэлийн аюулгүй байдал</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" asChild className="gap-2">
                    <Link href="/forgotpassword">
                      <Edit className="h-4 w-4" />
                      Нууц үг солих
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Гарах
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <QuickActionsCard />
    </div>
  );
}

function QuickActionsCard() {
  return (
    <div>
      <Card className="border overflow-hidden h-full">
        <CardHeader>
          <CardTitle>Түргэн холбоос</CardTitle>
          <CardDescription>Хэрэгтэй зүйлсийн холбоос</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline" className="justify-start gap-2 h-10">
              <Link href="/category">
                <ShoppingBag className="h-4 w-4" />
                Дэлгүүрлэлтээ үргэлжлүүлэх
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="justify-start gap-2 h-10">
              <Link href="/cart">
                <CreditCard className="h-4 w-4" />
                Сагс харах
              </Link>
            </Button>
          </div>
          
          <div className="rounded-md bg-blue-50 border border-blue-100 p-4 mt-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              Тусламж хэрэгтэй?
            </h4>
            <p className="text-sm text-blue-700 mb-3">
              Захиалга, бүртгэлтэй холбоотой асуултууд байна уу? Бидний тусламжийн баг танд туслахад бэлэн.
            </p>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/contact">Холбоо барих</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 