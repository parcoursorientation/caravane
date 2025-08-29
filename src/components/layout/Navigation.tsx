"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  isAdmin?: boolean;
}

const navigationItems = [
  { href: "/", label: "Accueil" },
  { href: "/programme", label: "Programme" },
  { href: "/inscription", label: "Inscription" },
  { href: "/partenaires", label: "Partenaires" },
  { href: "/lycees", label: "Lycées" },
  { href: "/exposants", label: "Exposants" },
  { href: "/galerie", label: "Galerie" },
  { href: "/contact", label: "Contact" },
];

const adminNavigationItems = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/lycees", label: "Lycées" },
  { href: "/admin/programmes-lycees", label: "Programmes Lycées" },
  { href: "/admin/exposants", label: "Exposants" },
  { href: "/admin/evenements", label: "Événements" },
  { href: "/admin/inscriptions", label: "Inscriptions" },
  { href: "/admin/contact-messages", label: "Messages Contact" },
  { href: "/admin/partenaires", label: "Partenaires" },
  { href: "/admin/galerie", label: "Médias" },
  { href: "/admin/galeries-evenements", label: "Galeries Événements" },
  { href: "/admin/compte-a-rebours", label: "Compte à rebours" },
  { href: "/admin/utilisateurs", label: "Utilisateurs" },
  { href: "/admin/statistiques", label: "Statistiques" },
  { href: "/admin/calendrier", label: "Calendrier" },
  { href: "/admin/settings", label: "Paramètres" },
];

export default function Navigation({ isAdmin = false }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const items = isAdmin ? adminNavigationItems : navigationItems;

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          <div className="flex items-center">
            <Link
              href={isAdmin ? "/admin" : "/"}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AE</span>
              </div>
              <span className="text-xl md:text-2xl font-bold text-blue-600">
                ATLANTIS EVENTS
              </span>
            </Link>
            {isAdmin && (
              <>
                <span className="ml-2 md:ml-4 text-gray-400 text-sm md:text-base">|</span>
                <span className="ml-2 md:ml-4 text-gray-600 text-sm md:text-base">Administration</span>
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-8 lg:ml-10 flex items-baseline space-x-2 lg:space-x-4">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <div className="flex flex-col space-y-3 mt-6">
                  <div className="pb-4 border-b">
                    <h2 className="text-lg font-semibold text-blue-600">ATLANTIS EVENTS</h2>
                    {isAdmin && (
                      <p className="text-sm text-gray-600 mt-1">Administration</p>
                    )}
                  </div>
                  {items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
