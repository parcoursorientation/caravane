"use client";

import { ReactNode, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <div className={sidebarOpen ? "lg:ml-4 flex-1" : "lg:ml-16 flex-1"}>
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Menu className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-blue-600">ATLANTIS</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 lg:pt-6 lg:px-8 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}