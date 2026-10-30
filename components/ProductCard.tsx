"use client";

import React from "react";
import Link from "next/link";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, getDiscountPercentage } from "@/lib/helpers";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import QuantityStepper from "./QuantityStepper";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { getItemQuantity, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const quantity = getItemQuantity(product.id);
  const isWishlisted = isInWishlist(product.id);
  const discountPercent = getDiscountPercentage(product.price, product.mrp);

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Top badges & Wishlist */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {discountPercent > 0 && (
            <span className="bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-800 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
              Out of stock
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isWishlisted
              ? "bg-red-50 text-red-500 border border-red-200 shadow-sm"
              : "bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white shadow-sm border border-gray-100"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isWishlisted ? "fill-current" : ""
            }`}
          />
        </button>
      </div>

      {/* Emoji Product Tile */}
      <Link
        href={`/products/${product.slug}`}
        className="block bg-gradient-to-b from-emerald-50/60 to-emerald-50/20 p-6 flex items-center justify-center aspect-square select-none group-hover:scale-105 transition-transform duration-300"
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/80 shadow-inner border border-emerald-100 flex items-center justify-center text-5xl sm:text-6xl drop-shadow-sm">
          {product.emoji}
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
            {product.category}
          </span>
          <span className="text-gray-400">{product.unit}</span>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1 text-base mt-1"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md text-xs font-semibold text-amber-800">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
          </div>
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>

        {/* Price & Action Area */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-emerald-900">
                {formatPrice(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.mrp)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-emerald-600 block font-medium">
              Free delivery eligible
            </span>
          </div>

          <div className="min-w-[90px] flex justify-end">
            {!product.inStock ? (
              <button
                disabled
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed text-center"
              >
                Sold Out
              </button>
            ) : quantity > 0 ? (
              <QuantityStepper
                quantity={quantity}
                onIncrease={() => updateQuantity(product.id, quantity + 1)}
                onDecrease={() => updateQuantity(product.id, quantity - 1)}
                size="sm"
              />
            ) : (
              <button
                type="button"
                onClick={() => addToCart(product, 1)}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-sm shadow-emerald-700/20 transition-all min-h-[38px]"
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

