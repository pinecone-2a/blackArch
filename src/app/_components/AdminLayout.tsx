"use client";

import { ReactNode } from 'react';
import AdminSideBar from "./adminSideBar";
import AdminHeader from "./adminHeader";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSideBar />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
} 