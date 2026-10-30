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
  Check,
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
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ""
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : ""
  );
  const [activeImage, setActiveImage] = useState<string>(product.image);

  const cartQuantity = getItemQuantity(product.id, selectedSize, selectedColor);
  const isWishlisted = isInWishlist(product.id);
  const discountPercent = getDiscountPercentage(product.price, product.mrp);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard", "info");
    }
  };

  const allImages = [
    product.image,
    ...(product.gallery || []).filter((g) => g !== product.image),
  ];

  return (
    <div className="space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400 font-normal">
        <Link href="/" className="hover:text-zinc-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-zinc-900 transition-colors">
          Catalog
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/products?category=${product.categorySlug}`}
          className="hover:text-zinc-900 transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-800 truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[640px] shrink-0">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border transition-all shrink-0 ${
                    activeImage === img
                      ? "border-zinc-900 ring-1 ring-zinc-900"
                      : "border-zinc-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Primary View */}
          <div className="relative flex-1 aspect-4/5 bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200/80">
            {product.badge && (
              <span className="absolute top-4 left-4 z-10 bg-zinc-950/90 text-white text-[10px] tracking-wider uppercase font-medium px-2.5 py-1 rounded backdrop-blur-xs">
                {product.badge}
              </span>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 hover:bg-white text-zinc-600 hover:text-zinc-950 backdrop-blur-xs transition-colors shadow-xs"
              title="Share"
              aria-label="Share product"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Right Column: Buying Area (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                {product.category}
              </span>
              {product.rating > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                  <Star className="w-3.5 h-3.5 fill-zinc-900 text-zinc-900" />
                  <span className="font-medium text-zinc-900">{product.rating}</span>
                  <span className="text-zinc-400">({product.reviewCount} verified reviews)</span>
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 leading-tight">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl font-semibold text-zinc-950">
                {formatPrice(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-sm text-zinc-400 line-through">
                  {formatPrice(product.mrp)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-medium text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded">
                  Save {discountPercent}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Taxes included. Free standard shipping on orders above ₹1,499.
            </p>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-zinc-900">
                  Color: <strong className="font-semibold">{selectedColor}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setSelectedColor(c.name);
                    }}
                    className={`group relative flex items-center gap-2 p-1.5 pr-3 rounded-lg border text-xs transition-all ${
                      selectedColor === c.name
                        ? "border-zinc-950 bg-zinc-50 font-medium"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-zinc-200"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-zinc-900">
                  Select Size: <strong className="font-semibold">{selectedSize}</strong>
                </span>
                <span className="text-zinc-400 text-[11px]">True to size</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`py-2.5 text-xs font-medium rounded-lg border transition-all text-center ${
                      selectedSize === s
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-zinc-200 text-zinc-800 hover:border-zinc-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart Controls */}
          {product.inStock ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-zinc-600">Quantity</span>
                <QuantityStepper
                  quantity={quantity}
                  onIncrease={() => setQuantity((q) => q + 1)}
                  onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                  size="md"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-800 active:scale-98 text-white font-medium py-3.5 px-6 rounded-xl text-xs sm:text-sm transition-all min-h-[44px]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {cartQuantity > 0
                      ? `Add More to Bag (${cartQuantity} added)`
                      : `Add to Bag • ${formatPrice(product.price * quantity)}`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-xl border flex items-center justify-center transition-colors min-h-[44px] ${
                    isWishlisted
                      ? "border-zinc-950 bg-zinc-100 text-zinc-950"
                      : "border-zinc-200 hover:border-zinc-300 text-zinc-600"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-zinc-100 text-zinc-600 text-xs space-y-2">
              <p className="font-semibold text-zinc-900">Item Currently Unavailable</p>
              <p>
                This batch is completely spoken for. Add to wishlist to receive restocking updates.
              </p>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 font-medium text-xs hover:bg-zinc-50"
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current" : ""}`} />
                <span>{isWishlisted ? "Saved in Wishlist" : "Notify via Wishlist"}</span>
              </button>
            </div>
          )}

          {/* Description & Technical Details */}
          <div className="pt-6 border-t border-zinc-200 space-y-4 text-xs">
            <div>
              <h3 className="font-semibold uppercase tracking-wider text-[11px] text-zinc-900 mb-2">
                Overview
              </h3>
              <p className="text-zinc-600 leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

            {product.details && product.details.length > 0 && (
              <div>
                <h4 className="font-semibold uppercase tracking-wider text-[11px] text-zinc-900 mb-2">
                  Key Specifications
                </h4>
                <ul className="space-y-1.5 text-zinc-600">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quality Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-zinc-200 text-center">
            <div className="p-3 bg-zinc-50 rounded-xl space-y-1">
              <Truck className="w-4 h-4 text-zinc-700 mx-auto" />
              <p className="text-[11px] font-semibold text-zinc-900">Tracked Shipping</p>
              <p className="text-[10px] text-zinc-400">Doorstep delivery in 3-5 days</p>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl space-y-1">
              <ShieldCheck className="w-4 h-4 text-zinc-700 mx-auto" />
              <p className="text-[11px] font-semibold text-zinc-900">Premium Quality</p>
              <p className="text-[10px] text-zinc-400">Strict standard inspection</p>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl space-y-1">
              <RotateCcw className="w-4 h-4 text-zinc-700 mx-auto" />
              <p className="text-[11px] font-semibold text-zinc-900">7-Day Exchanges</p>
              <p className="text-[10px] text-zinc-400">Hassle-free return policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Recommendation */}
      {similarProducts.length > 0 && (
        <div className="pt-16 border-t border-zinc-200 space-y-6">
          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
                Complete The Look
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Hand-selected complementary pieces from our {product.category} collection
              </p>
            </div>
            <Link
              href={`/products?category=${product.categorySlug}`}
              className="text-xs font-medium text-zinc-900 hover:text-zinc-600 transition-colors"
            >
              Explore Category &rarr;
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
