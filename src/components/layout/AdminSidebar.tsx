"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  X,
  LayoutDashboard,
  Building,
  Calendar,
  Users,
  MessageSquare,
  Handshake,
  Image,
  GalleryVerticalEnd,
  Timer,
  User,
  BarChart3,
  CalendarDays,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  GraduationCap,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const adminNavigationItems = [
  {
    href: "/admin",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    description: "Vue d'ensemble",
  },
  {
    href: "/admin/lycees",
    label: "Lycées",
    icon: GraduationCap,
    description: "Gestion des lycées",
  },
  {
    href: "/admin/programmes-lycees",
    label: "Programmes Lycées",
    icon: Calendar,
    description: "Programmes par lycée",
  },
  {
    href: "/admin/exposants",
    label: "Exposants",
    icon: Building,
    description: "Gestion des exposants",
  },
  {
    href: "/admin/evenements",
    label: "Événements",
    icon: CalendarDays,
    description: "Gestion des événements",
  },
  {
    href: "/admin/inscriptions",
    label: "Inscriptions",
    icon: Users,
    description: "Gestion des inscriptions",
  },
  {
    href: "/admin/contact-messages",
    label: "Messages Contact",
    icon: MessageSquare,
    description: "Messages des visiteurs",
  },
  {
    href: "/admin/partenaires",
    label: "Partenaires",
    icon: Handshake,
    description: "Gestion des partenaires",
  },
  {
    href: "/admin/galerie",
    label: "Médias",
    icon: Image,
    description: "Gestion des médias",
  },
  {
    href: "/admin/galeries-evenements",
    label: "Galeries Événements",
    icon: GalleryVerticalEnd,
    description: "Galeries par événement",
  },
  {
    href: "/admin/compte-a-rebours",
    label: "Compte à rebours",
    icon: Timer,
    description: "Gestion du compte à rebours",
  },
  {
    href: "/admin/utilisateurs",
    label: "Utilisateurs",
    icon: User,
    description: "Gestion des utilisateurs",
  },
  {
    href: "/admin/statistiques",
    label: "Statistiques",
    icon: BarChart3,
    description: "Statistiques et rapports",
  },
  {
    href: "/admin/calendrier",
    label: "Calendrier",
    icon: CalendarDays,
    description: "Calendrier des événements",
  },
  {
    href: "/admin/parametres-navigation",
    label: "Navigation",
    icon: Settings,
    description: "Paramètres de navigation",
  },
  {
    href: "/admin/settings",
    label: "Paramètres",
    icon: Settings,
    description: "Configuration du système",
  },
];

const secondaryNavigationItems = [
  {
    href: "/",
    label: "Retour au site",
    icon: Home,
    description: "Voir le site public",
  },
];

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          {isOpen && (
            <div>
              <h1 className="text-lg font-bold text-blue-600">ATLANTIS</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="hidden lg:flex"
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Navigation Principale
          </h2>
          <nav className="space-y-1">
            {adminNavigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon className={`h-5 w-5 ${isOpen ? "mr-3" : "mx-auto"}`} />
                  {isOpen && (
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-3 mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Autres
          </h2>
          <nav className="space-y-1">
            {secondaryNavigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon className={`h-5 w-5 ${isOpen ? "mr-3" : "mx-auto"}`} />
                  {isOpen && (
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        {isOpen && (
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-2">Session Admin</div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        )}
        {!isOpen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-center text-red-600 hover:bg-red-50"
            title="Déconnexion"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex lg:flex-shrink-0 transition-all duration-300 ${
          isOpen ? "lg:w-64" : "lg:w-16"
        }`}
      >
        <div className="flex flex-col w-full bg-white border-r border-gray-200 h-screen sticky top-0">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-md"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
