import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Percent,
  RotateCcw,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured).slice(0, 8);
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white p-6 sm:p-10 lg:p-14 shadow-lg shadow-emerald-900/15">
        <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs sm:text-sm font-semibold border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Farm Harvest To Your Doorstep</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
            Fresh Groceries, <br />
            <span className="text-amber-300">Delivered in 30 Mins.</span>
          </h1>

          <p className="text-emerald-100 text-sm sm:text-lg max-w-lg leading-relaxed">
            Premium organic vegetables, seasonal fruits, dairy & pantry staples.
            Zero adulteration, hygienic packaging, guaranteed fresh.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-900 font-bold px-6 py-3.5 rounded-2xl hover:bg-emerald-50 active:scale-95 transition-all text-sm sm:text-base shadow-sm min-h-[44px]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop All Groceries</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/products?category=fruits"
              className="inline-flex items-center justify-center gap-2 bg-emerald-800/80 hover:bg-emerald-800 border border-emerald-500/40 text-emerald-50 font-semibold px-5 py-3.5 rounded-2xl transition-all text-sm sm:text-base min-h-[44px]"
            >
              <span>Explore Fruits &bull; From ₹48</span>
            </Link>
          </div>

          <div className="pt-2 flex items-center gap-6 text-xs text-emerald-200">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-300 font-bold">★ 4.8/5</span>
              <span>(12,000+ Happy Families)</span>
            </div>
            <div className="hidden sm:inline">&bull;</div>
            <div className="hidden sm:inline">100% Contactless Delivery</div>
          </div>
        </div>

        {/* Decorative Floating Emoji Artwork */}
        <div
          className="absolute -right-10 -bottom-10 lg:right-4 lg:bottom-4 opacity-30 lg:opacity-90 pointer-events-none select-none text-8xl sm:text-9xl lg:text-[140px] drop-shadow-2xl animate-pulse"
          style={{ animationDuration: "6s" }}
        >
          🥑
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Handpicked categories for your everyday household cooking
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all duration-200"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50/70 group-hover:bg-emerald-100 flex items-center justify-center text-3xl mb-2 transition-transform group-hover:scale-110">
                {cat.icon}
              </div>
              <span className="text-xs font-bold text-gray-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional Offers Banner Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between shadow-sm">
          <div className="space-y-1.5 max-w-[70%]">
            <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              Limited Offer
            </span>
            <h3 className="text-lg sm:text-xl font-bold">
              Flat 10% Extra Off on Checkout
            </h3>
            <p className="text-xs text-amber-100">
              Use code <strong className="underline tracking-wider font-extrabold text-white">FRESH10</strong> on any basket above ₹499!
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-block bg-white text-amber-900 font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-amber-50 transition-colors"
              >
                Claim Offer
              </Link>
            </div>
          </div>
          <div className="text-5xl sm:text-6xl select-none">🎁</div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between shadow-sm">
          <div className="space-y-1.5 max-w-[70%]">
            <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              Organic Season
            </span>
            <h3 className="text-lg sm:text-xl font-bold">
              Farm Fresh Himachal Apples
            </h3>
            <p className="text-xs text-emerald-100">
              Crispy & naturally sweetened Shimla apples harvested this morning.
            </p>
            <div className="pt-2">
              <Link
                href="/products/fresh-shimla-apple"
                className="inline-block bg-white text-emerald-950 font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                Buy Now &bull; ₹180/kg
              </Link>
            </div>
          </div>
          <div className="text-5xl sm:text-6xl select-none">🍎</div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Featured Groceries
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Highest quality pantry and dairy products selected for you
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>Browse All ({PRODUCTS.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Why Choose FreshKart Strip */}
      <section className="rounded-3xl bg-white border border-emerald-100 p-6 sm:p-10 shadow-xs">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Why Shop with FreshKart?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            We partner directly with local farmers and verified dairies to ensure only the purest produce reaches your kitchen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/50">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                100% Farm Fresh
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Handpicked produce harvested within 24 hours of dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/50">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                30-Min Instant Delivery
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Hyperlocal dark stores across your city ensure rapid door drop.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/50">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Best Market Prices
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Zero middlemen markups. Enjoy wholesale rates every day.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/50">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                No-Questions Return
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Not satisfied with freshness? Instant replacement or refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Daily favorites trusted by thousands of neighborhood households
            </p>
          </div>
          <Link
            href="/products?sort=rating-desc"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>Top Rated</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
