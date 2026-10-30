"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CATEGORIES } from "@/data/categories";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-16 pb-12 border-t border-zinc-900 mt-24 text-xs font-normal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-zinc-900">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="w-6 h-6 bg-white text-zinc-950 rounded flex items-center justify-center font-bold text-[11px] tracking-wider">
                AT
              </span>
              <span className="text-base font-bold tracking-tight text-white uppercase">
                ATELIER
              </span>
            </Link>
            <p className="text-zinc-400 max-w-sm leading-relaxed text-xs">
              A minimalist online dropshipping store specializing in heavyweight cotton apparel, precision everyday carry accessories, and functional lifestyle objects. Designed for modern life.
            </p>
            <div className="pt-2 text-[11px] text-zinc-500 space-y-1">
              <p>Customer Support: support@atelier-store.local</p>
              <p>Operating Hours: Monday – Saturday, 9:00 AM – 7:00 PM IST</p>
            </div>
          </div>

          {/* Collections Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-zinc-400">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/products?category=${c.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Service Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Client Service
            </h4>
            <ul className="space-y-2.5 text-zinc-400">
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <span className="text-zinc-500 hover:text-zinc-400 cursor-pointer">
                  Track Delivery
                </span>
              </li>
              <li>
                <span className="text-zinc-500 hover:text-zinc-400 cursor-pointer">
                  Returns & Exchanges
                </span>
              </li>
              <li>
                <span className="text-zinc-500 hover:text-zinc-400 cursor-pointer">
                  Privacy Policy & Terms
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Drops list */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-1">
              Curated Drops
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Subscribe for private release announcements, restock alerts, and 10% off your initial order.
            </p>
            {isSubscribed ? (
              <div className="flex items-center gap-2 p-3 bg-zinc-900 rounded-lg text-xs text-zinc-200 border border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>You are subscribed. Welcome to Atelier.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 rounded-lg px-3 py-2.5 focus:outline-none focus:border-zinc-500 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-zinc-950 font-medium text-xs py-2 px-4 rounded-lg transition-colors min-h-[38px]"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-zinc-500 gap-4 text-[11px]">
          <p>&copy; 2026 ATELIER Goods & Apparel. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Direct Dropshipping Partner</span>
            <span>&bull;</span>
            <span>Secure 256-Bit SSL Checkout</span>
            <span>&bull;</span>
            <span>Worldwide Courier Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
