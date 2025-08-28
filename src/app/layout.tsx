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
  title: "ATLANTIS EVENTS - Tour de Portes Ouvertes pour l'Orientation",
  description: "ATLANTIS EVENTS en partenariat avec l'AMCOPE Tanger-Asilah organise un tour de portes ouvertes pour l'orientation dans plusieurs lycées de Tanger.",
  keywords: ["ATLANTIS EVENTS", "orientation", "lycées", "Tanger", "portes ouvertes", "AMCOPE"],
  authors: [{ name: "ATLANTIS EVENTS" }],
  openGraph: {
    title: "ATLANTIS EVENTS - Tour de Portes Ouvertes",
    description: "Tour de portes ouvertes pour l'orientation dans les lycées de Tanger",
    siteName: "ATLANTIS EVENTS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
