"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  RefreshCcw,
} from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { SortOption } from "@/types";
import ProductCard from "@/components/ProductCard";

interface FilterFormProps {
  categoryParam: string;
  maxPriceParam: number;
  inStockOnlyParam: boolean;
  queryParam: string;
  onUpdateQuery: (key: string, value: string | null) => void;
  onResetFilters: () => void;
}

function FilterForm({
  categoryParam,
  maxPriceParam,
  inStockOnlyParam,
  queryParam,
  onUpdateQuery,
  onResetFilters,
}: FilterFormProps) {
  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onUpdateQuery("category", null)}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
              !categoryParam
                ? "bg-emerald-600 text-white font-bold"
                : "text-gray-700 hover:bg-emerald-50"
            }`}
          >
            <span>All Groceries</span>
            <span className="text-[11px] opacity-80">{PRODUCTS.length}</span>
          </button>
          {CATEGORIES.map((cat) => {
            const count = PRODUCTS.filter((p) => p.categorySlug === cat.slug).length;
            const isSelected = categoryParam === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onUpdateQuery("category", cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-gray-700 hover:bg-emerald-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </span>
                <span className="text-[11px] opacity-80">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Price Range Filter */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Max Price
          </h4>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            ₹{maxPriceParam}
          </span>
        </div>
        <input
          type="range"
          min="30"
          max="1000"
          step="20"
          value={maxPriceParam}
          onChange={(e) => onUpdateQuery("maxPrice", e.target.value)}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-medium">
          <span>₹30</span>
          <span>₹500</span>
          <span>₹1000</span>
        </div>
      </div>

      {/* In Stock Only Toggle */}
      <div className="pt-4 border-t border-gray-100">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-bold text-gray-900">
            In Stock Items Only
          </span>
          <input
            type="checkbox"
            checked={inStockOnlyParam}
            onChange={(e) =>
              onUpdateQuery("inStock", e.target.checked ? "true" : null)
            }
            className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Reset Filter Action */}
      {(categoryParam || queryParam || inStockOnlyParam || maxPriceParam < 1000) && (
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 text-xs font-bold transition-colors"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
}

export default function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Query Sync
  const categoryParam = searchParams.get("category") || "";
  const queryParam = searchParams.get("q") || "";
  const sortParam = (searchParams.get("sort") as SortOption) || "relevance";
  const inStockOnlyParam = searchParams.get("inStock") === "true";
  const maxPriceParam = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : 1000;

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Helper to update query parameters smoothly
  const updateQuery = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "" || (key === "maxPrice" && value === "1000")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push("/products");
  };

  // Filter and Sort Pipeline
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (categoryParam && product.categorySlug !== categoryParam) {
        return false;
      }
      if (queryParam) {
        const q = queryParam.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesTag = product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesCat && !matchesTag) {
          return false;
        }
      }
      if (inStockOnlyParam && !product.inStock) {
        return false;
      }
      if (product.price > maxPriceParam) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortParam === "price-asc") return a.price - b.price;
      if (sortParam === "price-desc") return b.price - a.price;
      if (sortParam === "rating-desc") return b.rating - a.rating;
      if (sortParam === "discount-desc") {
        const discA = ((a.mrp - a.price) / a.mrp) * 100;
        const discB = ((b.mrp - b.price) / b.mrp) * 100;
        return discB - discA;
      }
      return 0; // relevance
    });
  }, [categoryParam, queryParam, inStockOnlyParam, maxPriceParam, sortParam]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      {/* Page Title & Search context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {categoryParam
              ? CATEGORIES.find((c) => c.slug === categoryParam)?.name || "Groceries"
              : queryParam
              ? `Results for "${queryParam}"`
              : "All Groceries & Daily Needs"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Showing <strong className="text-emerald-700">{filteredProducts.length}</strong> items available in your location
          </p>
        </div>

        {/* Sort & Mobile Filter Button */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-bold shadow-2xs min-h-[44px]"
          >
            <Filter className="w-4 h-4 text-emerald-700" />
            <span>Filters</span>
            {(categoryParam || inStockOnlyParam || maxPriceParam < 1000) && (
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
            )}
          </button>

          <div className="relative flex items-center">
            <label htmlFor="sort-select" className="sr-only">Sort products</label>
            <select
              id="sort-select"
              value={sortParam}
              onChange={(e) => updateQuery("sort", e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-emerald-500 cursor-pointer min-h-[44px]"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Customer Rating</option>
              <option value="discount-desc">Biggest Discount</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-100">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-gray-900">Filter Groceries</h3>
            </div>
            <FilterForm
              categoryParam={categoryParam}
              maxPriceParam={maxPriceParam}
              inStockOnlyParam={inStockOnlyParam}
              queryParam={queryParam}
              onUpdateQuery={updateQuery}
              onResetFilters={handleResetFilters}
            />
          </div>
        </aside>

        {/* Product Cards Grid & Empty State */}
        <main className="lg:col-span-3 space-y-8">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-emerald-100 p-12 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-4xl flex items-center justify-center mx-auto shadow-inner">
                🔍
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                No matching groceries found
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                We couldn&apos;t find any items matching your current filters. Try relaxing the price or browsing all fresh categories.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {displayedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Load More Button */}
              {displayedProducts.length < filteredProducts.length && (
                <div className="pt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="inline-flex items-center gap-2 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition-colors min-h-[44px]"
                  >
                    <span>Load More Groceries</span>
                    <span className="text-emerald-600">
                      ({filteredProducts.length - displayedProducts.length} remaining)
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col z-10 animate-in slide-in-from-right overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-gray-900">Filters</h3>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterForm
              categoryParam={categoryParam}
              maxPriceParam={maxPriceParam}
              inStockOnlyParam={inStockOnlyParam}
              queryParam={queryParam}
              onUpdateQuery={updateQuery}
              onResetFilters={handleResetFilters}
            />
            <div className="mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full bg-emerald-600 text-white font-bold text-xs py-3 rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
