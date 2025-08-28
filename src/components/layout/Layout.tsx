"use client";

import { ReactNode } from "react";
import Navigation from "./Navigation";
import AdminLayout from "./AdminLayout";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

export default function Layout({ children, isAdmin = false }: LayoutProps) {
  if (isAdmin) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation isAdmin={isAdmin} />
      <main className="flex-1">
        {children}
      </main>
      <Footer isAdmin={isAdmin} />
    </div>
  );
}