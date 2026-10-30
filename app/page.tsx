import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Award,
} from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured).slice(0, 8);
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = PRODUCTS.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Minimal Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-zinc-950 text-white min-h-[480px] sm:min-h-[540px] flex items-center">
        {/* Subtle Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80"
            alt="Atelier Lifestyle & Fashion"
            className="w-full h-full object-cover object-center opacity-30 scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl p-6 sm:p-12 lg:p-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-zinc-300 text-xs font-normal border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
            <span>Autumn / Winter 2026 Release</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-white">
            Quiet Luxury. <br />
            <span className="text-zinc-400">Engineered for Daily Living.</span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base max-w-lg leading-relaxed font-normal">
            Heavyweight combed cotton essentials, clean architectural tailoring,
            minimalist timepieces, and functional everyday lifestyle accessories.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-white text-zinc-950 font-medium px-6 py-3 rounded-xl hover:bg-zinc-200 active:scale-98 transition-all text-xs sm:text-sm min-h-[44px]"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/products?category=hoodies-sweats"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-medium px-5 py-3 rounded-xl transition-all text-xs sm:text-sm backdrop-blur-xs min-h-[44px]"
            >
              <span>460 GSM Hoodies</span>
            </Link>
          </div>

          <div className="pt-4 flex items-center gap-6 text-[11px] text-zinc-400">
            <span>Direct dropshipping logistics</span>
            <span>&bull;</span>
            <span>Worldwide verified partners</span>
            <span>&bull;</span>
            <span>7-day return guarantee</span>
          </div>
        </div>
      </section>

      {/* Featured Collections / Categories */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-zinc-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">
              Curated Collections
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Refined cuts, tactile fabrics, and considered accessories
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-medium text-zinc-900 hover:text-zinc-500 flex items-center gap-1 transition-colors"
          >
            <span>All Collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative flex flex-col rounded-xl overflow-hidden bg-zinc-900 aspect-3/4"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-104 transition-all duration-500 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-3 bottom-3 text-white">
                <span className="text-[10px] tracking-widest uppercase font-medium text-zinc-300 block mb-0.5">
                  Collection
                </span>
                <h3 className="text-sm font-semibold tracking-tight leading-tight">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending & Best Sellers Section */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-zinc-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">
              Trending Pieces
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              The most requested apparel and everyday carry essentials this week
            </p>
          </div>
          <Link
            href="/products?sort=rating-desc"
            className="text-xs font-medium text-zinc-900 hover:text-zinc-500 flex items-center gap-1 transition-colors"
          >
            <span>Highest Rated</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Elegant Promotional Banner */}
      <section className="relative rounded-2xl bg-zinc-100 border border-zinc-200/80 p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-lg z-10">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-zinc-500">
            Private Release
          </span>
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">
            Welcome To The Studio.
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
            Enjoy 10% complimentary deduction across our entire dropshipping catalog with code{" "}
            <strong className="text-zinc-950 font-semibold underline decoration-zinc-400">STUDIO10</strong> on checkout.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-zinc-950 text-white text-xs font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <span>Shop The Drop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="relative w-full md:w-80 aspect-4/3 rounded-xl overflow-hidden shadow-xs border border-zinc-200">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
            alt="Field Watch & Minimalist EDC"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-zinc-200 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">
                New Arrivals
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Fresh drops in tailored silhouettes and tactile living goods
              </p>
            </div>
            <Link
              href="/products?sort=discount-desc"
              className="text-xs font-medium text-zinc-900 hover:text-zinc-500 flex items-center gap-1 transition-colors"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Showcase */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-zinc-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">
              The Essentials Collection
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Heavyweight staples crafted for effortless daily rotation
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-medium text-zinc-900 hover:text-zinc-500 flex items-center gap-1 transition-colors"
          >
            <span>View All ({PRODUCTS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Brand Values & Guarantees */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-8 sm:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <Award className="w-5 h-5 text-zinc-900" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-950">
              Curated Manufacturing
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Every garment and accessory is vetted for stitch density, fabric weight, and endurance.
            </p>
          </div>

          <div className="space-y-2">
            <Truck className="w-5 h-5 text-zinc-900" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-950">
              Complimentary Shipping
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Orders over ₹1,499 ship free with end-to-end doorstep tracking.
            </p>
          </div>

          <div className="space-y-2">
            <ShieldCheck className="w-5 h-5 text-zinc-900" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-950">
              Reliable Dropshipping
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Direct fulfilment partnerships ensure honest pricing without middleman retail markup.
            </p>
          </div>

          <div className="space-y-2">
            <RotateCcw className="w-5 h-5 text-zinc-900" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-950">
              7-Day Hassle-Free Returns
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Not the right fit? Simple exchanges and straightforward return assistance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
