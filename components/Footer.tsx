"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, CheckCircle, ArrowRight } from "lucide-react";

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
    <footer className="bg-emerald-950 text-emerald-100 pt-14 pb-8 border-t border-emerald-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-900/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-emerald-950 flex items-center justify-center font-bold text-2xl shadow-sm">
                🌿
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white font-serif">
                Fresh<span className="text-emerald-400">Kart</span>
              </span>
            </Link>
            <p className="text-sm text-emerald-200/80 max-w-sm leading-relaxed">
              Your neighborhood online grocery store delivering crisp vegetables, handpicked farm fruits, daily dairy essentials, and organic kitchen staples in under 30 minutes.
            </p>
            <div className="pt-2 text-xs text-emerald-300 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sector 18, Cyber City, Gurugram, HR 122002</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 98765 43210 (9 AM - 9 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@freshkart.local</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/80">
              <li>
                <Link href="/products?category=fruits" className="hover:text-white transition-colors">
                  🍎 Farm Fresh Fruits
                </Link>
              </li>
              <li>
                <Link href="/products?category=vegetables" className="hover:text-white transition-colors">
                  🥕 Crispy Vegetables
                </Link>
              </li>
              <li>
                <Link href="/products?category=dairy-eggs" className="hover:text-white transition-colors">
                  🥛 Dairy, Milk & Eggs
                </Link>
              </li>
              <li>
                <Link href="/products?category=atta-rice-dal" className="hover:text-white transition-colors">
                  🌾 Atta, Rice & Dal
                </Link>
              </li>
              <li>
                <Link href="/products?category=snacks" className="hover:text-white transition-colors">
                  🍪 Healthy Snacks
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/80">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Browse All Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Your Cart & Offers
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors">
                  Delivery Guidelines
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors">
                  Privacy Policy & Terms
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-1">
              Fresh Discounts
            </h4>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Subscribe to get secret weekly deals, fresh harvest notifications, and ₹100 off your first cart!
            </p>
            {isSubscribed ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-900/60 rounded-xl text-xs text-emerald-200 border border-emerald-700/60">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You&apos;re subscribed! Welcome to the FreshKart family.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-emerald-900/40 border border-emerald-800 text-sm text-white placeholder-emerald-400/60 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-emerald-950 font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm"
                >
                  <span>Subscribe Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400/80 gap-3">
          <p>&copy; 2026 FreshKart Groceries India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-emerald-300/80">
            <span>100% Organic Certified</span>
            <span>&bull;</span>
            <span>Contactless Delivery</span>
            <span>&bull;</span>
            <span>Instant Refunds</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

