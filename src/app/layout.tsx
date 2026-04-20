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
          {/* Background Ambient Orbs */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
            <div className="orb orb-red w-[600px] h-[600px] top-[-200px] left-[-200px]" />
            <div className="orb orb-red w-[500px] h-[500px] bottom-[-100px] right-[-100px]" style={{ animationDelay: '2s' }} />
            <div className="orb orb-pink w-[400px] h-[400px] top-[40%] left-[60%]" style={{ animationDelay: '4s', opacity: 0.2 }} />
          </div>
          
          {children}
        </main>
        <Footer />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0d0d20',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(16px)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
