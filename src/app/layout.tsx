import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ATLANTIS EVENTS - Portes Ouvertes pour l'Orientation",
  description:
    "ATLANTIS EVENTS en partenariat avec l'AMCOPE organise des caravanes, des forums et des portes ouvertes d'orientation dans toutes les  villes du Maroc.",
  keywords: [
    "ATLANTIS EVENTS",
    "orientation",
    "lycées",
    "Tanger",
    "portes ouvertes",
    "AMCOPE",
  ],
  authors: [{ name: "ATLANTIS EVENTS" }],
  openGraph: {
    title: "ATLANTIS EVENTS - Tour de Portes Ouvertes",
    description:
      "Organisation des caravanes, des forums et des portes ouvertes d'orientation dans toutes les  villes du Maroc",
    siteName: "ATLANTIS EVENTS",
    type: "website",
  },
  other: {
    "color-scheme": "light dark",
    "theme-color": "#ffffff",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light only" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
