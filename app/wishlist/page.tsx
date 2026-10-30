"use client";

import React from "react";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/helpers";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, getItemQuantity } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-4xl flex items-center justify-center mx-auto shadow-inner">
          🤍
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          Your Wishlist is Empty
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Save your favorite fresh fruits, dry fruits, and weekly cooking items here to easily order anytime.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Discover Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            You have <strong className="text-emerald-700">{wishlist.length}</strong> items saved for later
          </p>
        </div>
        <button
          type="button"
          onClick={clearWishlist}
          className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map((product) => {
          const inCartQty = getItemQuantity(product.id);

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all flex flex-col overflow-hidden"
            >
              {/* Product Visual */}
              <div className="relative p-6 bg-emerald-50/40 flex items-center justify-center aspect-square select-none">
                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white text-gray-400 hover:text-red-500 shadow-xs"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="w-20 h-20 rounded-2xl bg-white shadow-inner border border-emerald-100 flex items-center justify-center text-5xl">
                  {product.emoji}
                </div>
              </div>

              {/* Details & Actions */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                  <Link
                    href={`/products/${product.slug}`}
                    className="block font-semibold text-gray-900 hover:text-emerald-700 transition-colors text-sm mt-1.5 line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">{product.unit}</p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-base font-bold text-emerald-950">
                    {formatPrice(product.price)}
                  </span>

                  {product.inStock ? (
                    <button
                      type="button"
                      onClick={() => addToCart(product, 1)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors min-h-[36px]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{inCartQty > 0 ? `In Cart (${inCartQty})` : "Add"}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
                      Out of Stock
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
