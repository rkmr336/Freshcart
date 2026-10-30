"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/helpers";
import QuantityStepper from "./QuantityStepper";

export default function CartDrawer() {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    totals,
  } = useCart();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsCartDrawerOpen(false);
      }
    }
    if (isCartDrawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartDrawerOpen, setIsCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={() => setIsCartDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-zinc-900" />
            <h3 className="text-sm font-semibold tracking-tight text-zinc-950 uppercase">
              Shopping Bag ({totals.totalItemCount})
            </h3>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-200/80 text-xs">
          {totals.amountNeededForFreeDelivery > 0 ? (
            <div>
              <div className="flex justify-between text-zinc-700 mb-1.5 font-normal">
                <span>
                  Add <strong className="font-semibold text-zinc-900">{formatPrice(totals.amountNeededForFreeDelivery)}</strong> for complimentary delivery
                </span>
                <span className="font-medium text-zinc-500">
                  {Math.min(100, Math.round((totals.subtotal / 1499) * 100))}%
                </span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-1 overflow-hidden">
                <div
                  className="bg-zinc-950 h-1 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (totals.subtotal / 1499) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-zinc-900 font-medium">
              <span>Your order qualifies for complimentary standard shipping.</span>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-zinc-100 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-900">Your bag is empty</h4>
              <p className="text-xs text-zinc-500 max-w-xs">
                Explore our minimal fashion and curated everyday lifestyle essentials.
              </p>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="mt-2 text-xs font-semibold text-zinc-900 hover:underline"
              >
                Browse Collections &rarr;
              </button>
            </div>
          ) : (
            cart.map(({ product, quantity, selectedSize, selectedColor }) => (
              <div key={`${product.id}-${selectedSize}-${selectedColor}`} className="pt-4 first:pt-0 flex items-start gap-3">
                <div className="w-16 h-20 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-200 shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-zinc-900 truncate">
                    {product.name}
                  </h4>
                  <div className="text-[11px] text-zinc-400 mt-0.5 space-x-1.5">
                    {selectedSize && <span>Size: {selectedSize}</span>}
                    {selectedColor && <span>&bull; {selectedColor}</span>}
                  </div>
                  <div className="text-xs font-semibold text-zinc-900 mt-1">
                    {formatPrice(product.price)}
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <QuantityStepper
                      quantity={quantity}
                      onIncrease={() =>
                        updateQuantity(product.id, quantity + 1, selectedSize, selectedColor)
                      }
                      onDecrease={() =>
                        updateQuantity(product.id, quantity - 1, selectedSize, selectedColor)
                      }
                      size="sm"
                    />
                    <span className="text-xs font-semibold text-zinc-900">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(product.id, selectedSize, selectedColor)}
                  className="p-1 text-zinc-400 hover:text-zinc-900 transition-colors"
                  aria-label={`Remove ${product.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-zinc-200 bg-zinc-50/50 space-y-3">
            <div className="space-y-1.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-zinc-900">{formatPrice(totals.subtotal)}</span>
              </div>
              {totals.mrpSavings > 0 && (
                <div className="flex justify-between text-zinc-600">
                  <span>Savings</span>
                  <span>-{formatPrice(totals.mrpSavings)}</span>
                </div>
              )}
              {totals.isCouponApplied && (
                <div className="flex justify-between text-zinc-900 font-medium">
                  <span>Promotion Discount</span>
                  <span>-{formatPrice(totals.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {totals.deliveryFee === 0 ? (
                    <span className="font-medium text-zinc-900 uppercase text-[11px]">Free</span>
                  ) : (
                    formatPrice(totals.deliveryFee)
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm font-semibold text-zinc-950">
                <span>Estimated Total</span>
                <span>{formatPrice(totals.grandTotal)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/cart"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full text-center py-2.5 px-3 rounded-lg border border-zinc-300 text-zinc-900 hover:bg-zinc-100 text-xs font-medium transition-colors min-h-[40px] flex items-center justify-center"
              >
                View Bag
              </Link>
              <Link
                href="/checkout"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium transition-colors min-h-[40px]"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
