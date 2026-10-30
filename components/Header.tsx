"use client";

import React, { useState, useRef, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, startTransition] = useTransition();

  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <aside aria-label="Announcement" className="bg-zinc-950 text-zinc-300 text-[11px] tracking-wide py-2 px-4 text-center border-b border-zinc-900 font-normal">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span>Complimentary shipping on orders above ₹1,499</span>
          <span className="text-zinc-600 hidden sm:inline">&bull;</span>
          <span className="text-zinc-400 hidden sm:inline">
            Use code <strong className="text-white font-medium">STUDIO10</strong> for 10% off
          </span>
        </div>
      </aside>

      {/* Main Minimalist Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Store Brand / Logo */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="w-7 h-7 bg-zinc-950 text-white rounded-md flex items-center justify-center font-bold text-xs tracking-wider">
                  AT
                </span>
                <span className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 font-sans uppercase">
                  ATELIER
                </span>
              </Link>

              {/* Desktop Main Navigation Links */}
              <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-wider font-medium text-zinc-600">
                <Link
                  href="/products"
                  className="hover:text-zinc-950 transition-colors"
                >
                  Shop All
                </Link>
                <Link
                  href="/products?category=mens-clothing"
                  className="hover:text-zinc-950 transition-colors"
                >
                  Men
                </Link>
                <Link
                  href="/products?category=womens-clothing"
                  className="hover:text-zinc-950 transition-colors"
                >
                  Women
                </Link>
                <Link
                  href="/products?category=hoodies-sweats"
                  className="hover:text-zinc-950 transition-colors"
                >
                  Hoodies
                </Link>
                <Link
                  href="/products?category=accessories"
                  className="hover:text-zinc-950 transition-colors"
                >
                  Accessories
                </Link>
                <Link
                  href="/products?sort=discount-desc"
                  className="text-zinc-950 font-semibold hover:text-zinc-600 transition-colors"
                >
                  New Arrivals
                </Link>
              </nav>
            </div>

            {/* Desktop Center/Right Interactive Bar */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Expandable Search Input (Desktop) */}
              <div ref={searchContainerRef} className="relative hidden md:block">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchOpen(true)}
                    placeholder="Search drops, heavyweight tees, accessories..."
                    className="w-64 lg:w-80 bg-zinc-100/80 focus:bg-white border border-transparent focus:border-zinc-300 rounded-lg py-2 pl-9 pr-8 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none transition-all"
                  />
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSuggestions([]);
                      }}
                      className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>

                {/* Search Dropdown */}
                {isSearchOpen && suggestions.length > 0 && (
                  <div className="absolute right-0 left-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-zinc-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="p-2 border-b border-zinc-100 text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                      Suggested Items
                    </div>
                    <div className="divide-y divide-zinc-50 max-h-80 overflow-y-auto">
                      {suggestions.map((p) => (
                        <Link
                          key={p.id}
                          href={`/products/${p.slug}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center justify-between p-3 hover:bg-zinc-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-12 object-cover rounded bg-zinc-100"
                            />
                            <div>
                              <p className="text-xs font-medium text-zinc-900 line-clamp-1">
                                {p.name}
                              </p>
                              <p className="text-[11px] text-zinc-400">
                                {p.category}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold text-zinc-900">
                              {formatPrice(p.price)}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 inline ml-1" />
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="p-2 bg-zinc-50 border-t border-zinc-100 text-center">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-[11px] font-medium text-zinc-800 hover:text-zinc-950 flex items-center justify-center gap-1 mx-auto"
                      >
                        <span>View all matching results</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative p-2.5 rounded-lg text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {totalWishlistCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-zinc-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalWishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Button */}
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white px-3.5 py-2 rounded-lg text-xs font-medium transition-colors min-h-[40px]"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Bag</span>
                {totals.totalItemCount > 0 && (
                  <span className="ml-1 bg-white text-zinc-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {totals.totalItemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-zinc-800 hover:bg-zinc-100 lg:hidden min-h-[40px] flex items-center justify-center"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Input */}
          <div className="pb-3 md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search collection..."
                className="w-full bg-zinc-100 border border-transparent focus:border-zinc-300 focus:bg-white rounded-lg py-2 pl-9 pr-8 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-zinc-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white px-5 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-1">
            <p className="text-[10px] font-semibold tracking-wider uppercase text-zinc-400">
              Collections
            </p>
            <div className="flex flex-col space-y-2">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-900 py-1.5 border-b border-zinc-100"
              >
                All Products
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-zinc-700 py-1.5 border-b border-zinc-100 flex items-center justify-between"
                >
                  <span>{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-300" />
                </Link>
              ))}
            </div>
            <div className="pt-2 flex items-center justify-between text-xs text-zinc-500">
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-900 font-medium"
              >
                Wishlist ({totalWishlistCount})
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-900 font-medium"
              >
                Shopping Bag ({totals.totalItemCount})
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
