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
        <h4 className="text-[11px] font-semibold text-zinc-900 uppercase tracking-wider mb-3">
          Collections
        </h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onUpdateQuery("category", null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
              !categoryParam
                ? "bg-zinc-950 text-white font-semibold"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            <span>All Products</span>
            <span className="text-[10px] opacity-70">{PRODUCTS.length}</span>
          </button>
          {CATEGORIES.map((cat) => {
            const count = PRODUCTS.filter((p) => p.categorySlug === cat.slug).length;
            const isSelected = categoryParam === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onUpdateQuery("category", cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-zinc-950 text-white font-semibold"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Price Range Filter */}
      <div className="pt-5 border-t border-zinc-200">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[11px] font-semibold text-zinc-900 uppercase tracking-wider">
            Price Range
          </h4>
          <span className="text-xs font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">
            Up to ₹{maxPriceParam}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="5000"
          step="100"
          value={maxPriceParam}
          onChange={(e) => onUpdateQuery("maxPrice", e.target.value)}
          className="w-full accent-zinc-900 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-medium">
          <span>₹500</span>
          <span>₹2,500</span>
          <span>₹5,000</span>
        </div>
      </div>

      {/* In Stock Only Toggle */}
      <div className="pt-5 border-t border-zinc-200">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-medium text-zinc-800">
            Available In Stock Only
          </span>
          <input
            type="checkbox"
            checked={inStockOnlyParam}
            onChange={(e) =>
              onUpdateQuery("inStock", e.target.checked ? "true" : null)
            }
            className="w-4 h-4 accent-zinc-950 rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Reset Filter Action */}
      {(categoryParam || queryParam || inStockOnlyParam || maxPriceParam < 5000) && (
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 text-xs font-medium transition-colors"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
}

export default function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") || "";
  const queryParam = searchParams.get("q") || "";
  const sortParam = (searchParams.get("sort") as SortOption) || "relevance";
  const inStockOnlyParam = searchParams.get("inStock") === "true";
  const maxPriceParam = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : 5000;

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const updateQuery = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "" || (key === "maxPrice" && value === "5000")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push("/products");
  };

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
      return 0;
    });
  }, [categoryParam, queryParam, inStockOnlyParam, maxPriceParam, sortParam]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="space-y-8">
      {/* Page Title & Search context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">
            {categoryParam
              ? CATEGORIES.find((c) => c.slug === categoryParam)?.name || "Catalog"
              : queryParam
              ? `Results for "${queryParam}"`
              : "All Products & Drops"}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Displaying <span className="font-semibold text-zinc-900">{filteredProducts.length}</span> pieces
          </p>
        </div>

        {/* Sort & Mobile Filter Button */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-300 bg-white text-zinc-900 text-xs font-medium shadow-2xs min-h-[40px]"
          >
            <Filter className="w-3.5 h-3.5 text-zinc-700" />
            <span>Filter</span>
            {(categoryParam || inStockOnlyParam || maxPriceParam < 5000) && (
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
            )}
          </button>

          <div className="relative flex items-center">
            <label htmlFor="sort-select" className="sr-only">Sort collection</label>
            <select
              id="sort-select"
              value={sortParam}
              onChange={(e) => updateQuery("sort", e.target.value)}
              className="appearance-none bg-white border border-zinc-200 rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-zinc-800 focus:outline-none focus:border-zinc-400 cursor-pointer min-h-[40px]"
            >
              <option value="relevance">Featured & Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="discount-desc">Current Season Offers</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Grid & Desktop Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 bg-white rounded-xl border border-zinc-200/80 p-5">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-zinc-100">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-700" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                Filter Selection
              </h3>
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

        {/* Product Cards Grid */}
        <main className="lg:col-span-3 space-y-8">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto text-xl">
                0
              </div>
              <h3 className="text-base font-semibold text-zinc-900">
                No matching pieces found
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                No items match your selected filter criteria. Try adjusting the maximum price or resetting filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 bg-zinc-950 text-white font-medium text-xs px-4 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors"
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
                    className="inline-flex items-center gap-2 bg-white border border-zinc-300 text-zinc-900 hover:bg-zinc-50 font-medium text-xs px-6 py-2.5 rounded-lg transition-colors min-h-[40px]"
                  >
                    <span>Load More Pieces</span>
                    <span className="text-zinc-400">
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
            className="fixed inset-0 bg-black/30 backdrop-blur-xs animate-in fade-in"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col z-10 animate-in slide-in-from-right overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-700" />
                <h3 className="text-sm font-semibold text-zinc-900">Filters</h3>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700"
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
            <div className="mt-8 pt-4 border-t border-zinc-200">
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full bg-zinc-950 text-white font-medium text-xs py-3 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                View {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
