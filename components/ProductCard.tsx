"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Star, ArrowUpRight } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, getDiscountPercentage } from "@/lib/helpers";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = getDiscountPercentage(product.price, product.mrp);

  const activeColor = product.colors ? product.colors[selectedColorIndex] : undefined;
  const activeImage =
    product.gallery && product.gallery[selectedColorIndex]
      ? product.gallery[selectedColorIndex]
      : product.image;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      product,
      1,
      product.sizes ? product.sizes[0] : undefined,
      activeColor?.name
    );
  };

  return (
    <div className="group relative flex flex-col bg-white border border-zinc-200/80 rounded-xl overflow-hidden hover:border-zinc-400 hover:shadow-xs transition-all duration-300">
      {/* Visual Badge & Wishlist Action */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {product.badge && (
            <span className="bg-zinc-900/90 text-white text-[10px] tracking-wider uppercase font-medium px-2 py-0.5 rounded backdrop-blur-xs">
              {product.badge}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-zinc-200 text-zinc-700 text-[10px] tracking-wider uppercase font-medium px-2 py-0.5 rounded">
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
          className={`pointer-events-auto p-2 rounded-full transition-all duration-200 ${
            isWishlisted
              ? "bg-white text-zinc-900 shadow-sm"
              : "bg-white/80 backdrop-blur-xs text-zinc-400 hover:text-zinc-900 hover:bg-white shadow-xs"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
              isWishlisted ? "fill-current text-zinc-900" : ""
            }`}
          />
        </button>
      </div>

      {/* Product Image Tile */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-4/5 bg-zinc-100 overflow-hidden"
      >
        <img
          src={activeImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Quick Add Overlay on Hover (Desktop) */}
        {product.inStock && (
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="w-full bg-zinc-900/95 hover:bg-zinc-900 text-white text-xs font-medium py-2.5 rounded-lg shadow-sm backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Quick Add</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Color Swatches */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
          <span className="uppercase tracking-wider text-[10px] font-medium text-zinc-500">
            {product.category}
          </span>

          {/* Inline Color Dots if available */}
          {product.colors && product.colors.length > 1 && (
            <div className="flex items-center gap-1">
              {product.colors.map((c, idx) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColorIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full border transition-all ${
                    selectedColorIndex === idx
                      ? "ring-1 ring-zinc-900 ring-offset-1 border-transparent"
                      : "border-zinc-300 hover:scale-110"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  aria-label={`Select ${c.name} color`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <Link
          href={`/products/${product.slug}`}
          className="font-medium text-zinc-900 hover:text-zinc-600 transition-colors text-sm line-clamp-1 leading-snug"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Material or subtle subtitle */}
        {product.material && (
          <p className="text-[11px] text-zinc-400 truncate mt-0.5">
            {product.material}
          </p>
        )}

        {/* Pricing & Rating */}
        <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-zinc-900">
              {formatPrice(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-zinc-400 line-through">
                {formatPrice(product.mrp)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[10px] font-medium text-zinc-500">
                (-{discountPercent}%)
              </span>
            )}
          </div>

          {product.rating > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
              <Star className="w-3 h-3 fill-zinc-900 text-zinc-900" />
              <span>{product.rating}</span>
            </div>
          )}
        </div>

        {/* Mobile View/Add Action */}
        <div className="mt-3 sm:hidden">
          <Link
            href={`/products/${product.slug}`}
            className="w-full flex items-center justify-center py-2 px-3 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-800 hover:bg-zinc-50 transition-colors min-h-[36px]"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
