"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { Product } from "@/types";
import { formatPrice } from "@/lib/helpers";

export default function Header() {
  const router = useRouter();
  const { totals, setIsCartDrawerOpen } = useCart();
  const { totalWishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, startTransition] = useTransition();

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Search input handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    startTransition(() => {
      const q = value.trim().toLowerCase();
      if (!q) {
        setSuggestions([]);
        return;
      }
      const matches = PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      ).slice(0, 5);
      setSuggestions(matches);
    });
  };

  // Click outside search listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Top Announcement Strip */}
      <div className="bg-emerald-800 text-emerald-50 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>
          Free delivery on orders above <strong>₹499</strong> | Code{" "}
          <strong className="underline tracking-wider font-bold text-amber-300">
            FRESH10
          </strong>{" "}
          for 10% off!
        </span>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm shadow-emerald-700/20">
                🌿
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-emerald-950 font-serif leading-none">
                  Fresh<span className="text-emerald-600">Kart</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-emerald-700 font-bold -mt-0.5">
                  Farm to Table
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-gray-700">
              <Link
                href="/products"
                className="hover:text-emerald-600 transition-colors"
              >
                All Groceries
              </Link>
              <Link
                href="/products?category=fruits"
                className="hover:text-emerald-600 transition-colors"
              >
                Fruits
              </Link>
              <Link
                href="/products?category=vegetables"
                className="hover:text-emerald-600 transition-colors"
              >
                Vegetables
              </Link>
              <Link
                href="/products?category=dairy-eggs"
                className="hover:text-emerald-600 transition-colors"
              >
                Dairy & Eggs
              </Link>
            </nav>

            {/* Search Bar with Autocomplete Dropdown */}
            <div
              ref={searchContainerRef}
              className="relative flex-1 max-w-md hidden md:block"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search 40+ fresh items (e.g., Apple, Milk, Atta)..."
                  className="w-full bg-emerald-50/60 border border-emerald-200 focus:border-emerald-500 focus:bg-white rounded-full py-2.5 pl-10 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-emerald-600" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSuggestions([]);
                    }}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Suggestions Popup */}
              {isSearchFocused && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="p-2 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    Suggested Fresh Items
                  </div>
                  <div className="divide-y divide-gray-50">
                    {suggestions.map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.slug}`}
                        onClick={() => {
                          setIsSearchFocused(false);
                          setSearchQuery("");
                          setSuggestions([]);
                        }}
                        className="flex items-center justify-between p-3 hover:bg-emerald-50/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-1 bg-emerald-50 rounded-lg">
                            {p.emoji}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {p.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {p.category} &bull; {p.unit}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-emerald-700">
                            {formatPrice(p.price)}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400 inline ml-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="p-2.5 bg-gray-50 text-center">
                    <button
                      onClick={handleSearchSubmit}
                      className="text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      View all results for &quot;{searchQuery}&quot; &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative p-2.5 sm:px-3 sm:py-2 rounded-xl text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-1.5 min-h-[44px]"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 text-emerald-700" />
                <span className="hidden sm:inline text-xs font-semibold">Wishlist</span>
                {totalWishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 sm:top-1 sm:right-1 bg-red-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalWishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger Button */}
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm shadow-emerald-700/20 transition-all min-h-[44px]"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  {totals.totalItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-400 text-emerald-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {totals.totalItemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">
                  {totals.totalItemCount > 0 ? formatPrice(totals.grandTotal) : "Cart"}
                </span>
              </button>

              {/* Mobile menu hamburger toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-gray-700 hover:bg-emerald-50 lg:hidden min-h-[44px] flex items-center justify-center"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="pb-3 md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search groceries..."
                className="w-full bg-emerald-50/60 border border-emerald-200 focus:border-emerald-500 focus:bg-white rounded-full py-2 pl-9 pr-8 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-emerald-600" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSuggestions([]);
                  }}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Mobile Flyout Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-emerald-100 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Browse Categories
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-emerald-50/60 text-xs font-bold text-emerald-900 flex items-center gap-2 hover:bg-emerald-100"
              >
                <span>🛒</span> All Products
              </Link>
              {CATEGORIES.slice(0, 7).map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-gray-50 text-xs font-semibold text-gray-800 flex items-center gap-2 hover:bg-emerald-50"
                >
                  <span>{c.icon}</span> {c.name}
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="font-semibold text-emerald-700"
              >
                Go to Cart ({totals.totalItemCount})
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="font-semibold text-emerald-700"
              >
                Wishlist ({totalWishlistCount})
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
