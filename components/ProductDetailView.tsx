"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Share2,
} from "lucide-react";
import { Product } from "@/types";
import { formatPrice, getDiscountPercentage } from "@/lib/helpers";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import ProductCard from "@/components/ProductCard";
import QuantityStepper from "@/components/QuantityStepper";

interface ProductDetailViewProps {
  product: Product;
  similarProducts: Product[];
}

export default function ProductDetailView({
  product,
  similarProducts,
}: ProductDetailViewProps) {
  const { getItemQuantity, addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);

  const cartQuantity = getItemQuantity(product.id);
  const isWishlisted = isInWishlist(product.id);
  const discountPercent = getDiscountPercentage(product.price, product.mrp);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!", "info");
    }
  };

  return (
    <div className="space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <Link href="/" className="hover:text-emerald-700">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/products" className="hover:text-emerald-700">
          Groceries
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link
          href={`/products?category=${product.categorySlug}`}
          className="hover:text-emerald-700"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Large Emoji Tile Artwork */}
        <div className="relative rounded-3xl bg-gradient-to-b from-emerald-50 via-emerald-100/40 to-white border border-emerald-100 p-8 sm:p-14 flex items-center justify-center aspect-square shadow-sm select-none">
          {discountPercent > 0 && (
            <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {discountPercent}% OFF MRP
            </span>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white text-gray-500 hover:text-emerald-700 shadow-sm border border-gray-100 transition-colors"
            title="Share product link"
            aria-label="Share product"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-3xl bg-white shadow-xl border border-emerald-100 flex items-center justify-center text-8xl sm:text-9xl drop-shadow-md">
            {product.emoji}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-emerald-800 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-100">
            <span className="font-semibold">Harvested within 24 hrs</span>
            <span className="font-bold">Organic Certified</span>
          </div>
        </div>

        {/* Right: Product Details & Buying Control */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-md">
                {product.category}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Unit: {product.unit}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-xs font-bold text-amber-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                ({product.reviewCount} verified consumer ratings)
              </span>
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Quality Assured
              </span>
            </div>
          </div>

          {/* Price Block */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-emerald-950">
                {formatPrice(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-base text-gray-400 line-through">
                  MRP {formatPrice(product.mrp)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  Save {formatPrice(product.mrp - product.price)}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Inclusive of all taxes &bull; Standard packaging
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                product.inStock ? "bg-emerald-600 animate-pulse" : "bg-red-500"
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider">
              {product.inStock ? (
                <span className="text-emerald-700">In Stock (Ready for Dispatch)</span>
              ) : (
                <span className="text-red-600">Currently Out of Stock</span>
              )}
            </span>
          </div>

          {/* Action Row */}
          {product.inStock ? (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-700">Quantity:</span>
                <QuantityStepper
                  quantity={quantity}
                  onIncrease={() => setQuantity((q) => q + 1)}
                  onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                  size="md"
                />
                <span className="text-xs text-gray-400">
                  Total: {formatPrice(product.price * quantity)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm shadow-emerald-700/20 text-sm transition-all min-h-[44px]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {cartQuantity > 0
                      ? `Add More to Cart (${cartQuantity} already in cart)`
                      : "Add to Cart"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl border font-bold text-sm transition-all min-h-[44px] ${
                    isWishlisted
                      ? "border-red-200 bg-red-50 text-red-600"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
                  />
                  <span>{isWishlisted ? "Wishlisted" : "Save"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-gray-100 text-gray-600 text-xs font-medium space-y-2">
              <p className="font-bold text-gray-800">
                This product is temporarily sold out.
              </p>
              <p>
                Our fresh procurement team is restocking fresh batches. You can save this to your wishlist to get notified when available.
              </p>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-300 font-bold text-xs text-gray-800 hover:bg-gray-50 min-h-[44px]"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "text-red-500 fill-current" : ""}`} />
                <span>{isWishlisted ? "Saved in Wishlist" : "Notify Me via Wishlist"}</span>
              </button>
            </div>
          )}

          {/* Description */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Product Description
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Service Promises */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>30 Mins Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Pure & Fresh</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Instant Refund</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Row */}
      {similarProducts.length > 0 && (
        <div className="pt-10 border-t border-gray-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Similar Groceries in {product.category}
            </h2>
            <Link
              href={`/products?category=${product.categorySlug}`}
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:underline"
            >
              See all in {product.category} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

