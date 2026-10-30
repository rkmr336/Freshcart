"use client";

import React from "react";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/helpers";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, getItemQuantity } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="py-20 sm:py-28 text-center max-w-md mx-auto space-y-4">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">
          Your Wishlist Is Empty
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
          Save your favorite apparel cuts, timepieces, and accessories to easily review or purchase them anytime.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs px-6 py-2.5 rounded-lg transition-all"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">
            Saved Wishlist
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {wishlist.length} saved pieces
          </p>
        </div>
        <button
          type="button"
          onClick={clearWishlist}
          className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map((product) => {
          const inCartQty = getItemQuantity(product.id);

          return (
            <div
              key={product.id}
              className="group bg-white rounded-xl border border-zinc-200/80 hover:border-zinc-300 transition-all flex flex-col overflow-hidden"
            >
              {/* Product Visual */}
              <div className="relative aspect-4/5 bg-zinc-100 overflow-hidden">
                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-zinc-400 hover:text-zinc-900 shadow-xs transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>

              {/* Details & Actions */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                    {product.category}
                  </span>
                  <Link
                    href={`/products/${product.slug}`}
                    className="block font-medium text-zinc-900 hover:text-zinc-600 transition-colors text-xs sm:text-sm mt-1 line-clamp-1"
                  >
                    {product.name}
                  </Link>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-950">
                    {formatPrice(product.price)}
                  </span>

                  {product.inStock ? (
                    <button
                      type="button"
                      onClick={() =>
                        addToCart(
                          product,
                          1,
                          product.sizes ? product.sizes[0] : undefined,
                          product.colors ? product.colors[0].name : undefined
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium transition-colors min-h-[34px]"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>{inCartQty > 0 ? `In Bag (${inCartQty})` : "Add"}</span>
                    </button>
                  ) : (
                    <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 px-2 py-1 rounded">
                      Sold Out
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
