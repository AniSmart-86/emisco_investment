import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";

import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Emisco | Truck spare parts",
  description: "Authorized distributor of genuine heavy-duty truck parts. Engines, gearboxes, and components for Mack, Volvo, DAF, and more.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col font-sans transition-colors duration-300">
        <Navbar />
        <main className="grow pt-20">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
