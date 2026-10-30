import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/context/ToastContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ATELIER — Modern Fashion, Accessories & Lifestyle Dropshipping",
  description:
    "Curated collection of heavyweight organic clothing, minimalist streetwear, timepieces, leather goods, and functional everyday lifestyle accessories.",
  keywords: [
    "clothing",
    "streetwear",
    "hoodies",
    "minimalist accessories",
    "lifestyle",
    "online store",
    "dropshipping",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-zinc-50/50 text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white">
        <ToastProvider>
          <WishlistProvider>
            <CartProvider>
              <Header />
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
              </main>
              <CartDrawer />
              <Footer />
            </CartProvider>
          </WishlistProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
