import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/context/AuthProvider";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KOSH-Lite | Save Smarter",
  description: "Your hub for smart savings — build goals, track progress, and grow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${geist.className} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Toaster richColors closeButton />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}