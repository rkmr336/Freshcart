"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, ShoppingBag, ArrowRight, Sparkles, Trash2 } from "lucide-react";
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

  // Close drawer on Escape key press
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
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-gray-900">
              Your Grocery Cart ({totals.totalItemCount})
            </h3>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Goal Bar */}
        <div className="px-5 py-3 bg-emerald-50 border-b border-emerald-100 text-xs">
          {totals.amountNeededForFreeDelivery > 0 ? (
            <div>
              <div className="flex justify-between font-semibold text-emerald-950 mb-1.5">
                <span>Add {formatPrice(totals.amountNeededForFreeDelivery)} more for Free Delivery</span>
                <span>{Math.min(100, Math.round((totals.subtotal / 499) * 100))}%</span>
              </div>
              <div className="w-full bg-emerald-200/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (totals.subtotal / 499) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Congratulations! You get FREE Delivery on this order.</span>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-gray-100 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-3xl">
                🛒
              </div>
              <h4 className="text-base font-bold text-gray-800">Your cart is empty</h4>
              <p className="text-xs text-gray-500 max-w-xs">
                Explore our fresh daily fruits, vegetables, and pantry items to start your basket.
              </p>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
              >
                Start Shopping Now &rarr;
              </button>
            </div>
          ) : (
            cart.map(({ product, quantity }) => (
              <div key={product.id} className="pt-4 first:pt-0 flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-center text-2xl shrink-0">
                  {product.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {product.unit} &bull; {formatPrice(product.price)}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <QuantityStepper
                      quantity={quantity}
                      onIncrease={() => updateQuantity(product.id, quantity + 1)}
                      onDecrease={() => updateQuantity(product.id, quantity - 1)}
                      size="sm"
                    />
                    <span className="text-sm font-bold text-emerald-950">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(product.id)}
                  className="p-1 text-gray-300 hover:text-red-500 transition-colors self-start"
                  aria-label={`Remove ${product.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50 space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatPrice(totals.subtotal)}</span>
              </div>
              {totals.mrpSavings > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Total MRP Discount</span>
                  <span>-{formatPrice(totals.mrpSavings)}</span>
                </div>
              )}
              {totals.isCouponApplied && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon FRESH10 (10%)</span>
                  <span>-{formatPrice(totals.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>
                  {totals.deliveryFee === 0 ? (
                    <strong className="text-emerald-700 font-bold uppercase">FREE</strong>
                  ) : (
                    formatPrice(totals.deliveryFee)
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
                <span>Estimated Total</span>
                <span className="text-emerald-700 text-base">{formatPrice(totals.grandTotal)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href="/cart"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full text-center py-2.5 px-3 rounded-xl border border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-xs font-bold transition-colors min-h-[44px] flex items-center justify-center"
              >
                View Full Cart
              </Link>
              <Link
                href="/checkout"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-700/20 transition-all min-h-[44px]"
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

