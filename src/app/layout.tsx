import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Uventere | Premium Event Booking Platform",
  description: "Plan your perfect event effortlessly. Discover, book and manage premium events with top coordinators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex flex-col relative w-full pt-[80px]">
          {children}
        </main>
        <Footer />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#000000',
              border: '1px solid #e5e7eb',
              borderRadius: '9999px',
              padding: '16px 24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
            },
            success: {
              iconTheme: {
                primary: '#07715F',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
