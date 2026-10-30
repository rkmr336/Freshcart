"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trash2,
  Heart,
  ArrowRight,
  ShoppingBag,
  Tag,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/helpers";
import QuantityStepper from "@/components/QuantityStepper";

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    couponCode,
    applyCoupon,
    removeCoupon,
    totals,
  } = useCart();
  const { addToWishlist } = useWishlist();

  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCoupon(couponInput);
    setCouponMessage({
      text: res.message,
      isError: !res.success,
    });
    if (res.success) {
      setCouponInput("");
    }
  };

  const handleMoveToWishlist = (product: (typeof cart)[0]["product"]) => {
    addToWishlist(product);
    removeFromCart(product.id);
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 sm:py-28 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">
          Your Shopping Bag Is Empty
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
          Explore our collection of tailored heavyweight apparel, accessories, and lifestyle essentials.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs px-6 py-3 rounded-xl transition-all min-h-[42px]"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-baseline justify-between pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">
            Shopping Bag
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            {totals.totalItemCount} items selected
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          Clear bag
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="p-4 rounded-xl bg-zinc-100/70 border border-zinc-200 text-xs">
        {totals.amountNeededForFreeDelivery > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-zinc-700">
              <span>
                Add <strong className="font-semibold text-zinc-900">{formatPrice(totals.amountNeededForFreeDelivery)}</strong> more for complimentary shipping
              </span>
              <span className="font-medium text-zinc-500">
                {Math.min(100, Math.round((totals.subtotal / 1499) * 100))}%
              </span>
            </div>
            <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-zinc-950 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (totals.subtotal / 1499) * 100)}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-zinc-900 font-medium">
            <CheckCircle2 className="w-4 h-4 text-zinc-950 shrink-0" />
            <span>Your order qualifies for complimentary standard shipping.</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Bag Items Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100 overflow-hidden">
            {cart.map(({ product, quantity, selectedSize, selectedColor }) => (
              <div
                key={`${product.id}-${selectedSize}-${selectedColor}`}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-24 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-200 shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <div className="text-xs text-zinc-400 space-x-2">
                      {selectedSize && <span>Size: {selectedSize}</span>}
                      {selectedColor && <span>&bull; Color: {selectedColor}</span>}
                    </div>
                    <p className="text-xs font-semibold text-zinc-900 pt-0.5">
                      {formatPrice(product.price)} each
                    </p>

                    <div className="flex items-center gap-3 pt-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handleMoveToWishlist(product)}
                        className="text-zinc-500 hover:text-zinc-950 flex items-center gap-1 transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Save for later</span>
                      </button>
                      <span className="text-zinc-300">&bull;</span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id, selectedSize, selectedColor)}
                        className="text-zinc-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
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
                  <div className="text-right min-w-[80px]">
                    <span className="text-sm font-semibold text-zinc-950">
                      {formatPrice(product.price * quantity)}
                    </span>
                    {product.mrp > product.price && (
                      <p className="text-[11px] text-zinc-400 line-through">
                        {formatPrice(product.mrp * quantity)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/products"
              className="text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
            >
              &larr; Continue shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="space-y-4">
          {/* Promo Box */}
          <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-zinc-700" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                Promo Code
              </h3>
            </div>

            {couponCode ? (
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-zinc-900">
                    {couponCode}
                  </span>
                  <p className="text-[11px] text-zinc-500">
                    10% deduction active
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs text-zinc-500 hover:text-zinc-900 font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter code (e.g. STUDIO10)"
                    className="flex-1 uppercase bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
                  />
                  <button
                    type="submit"
                    className="bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors min-h-[38px]"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`text-xs flex items-center gap-1.5 ${
                      couponMessage.isError ? "text-red-600" : "text-zinc-900"
                    }`}
                  >
                    {couponMessage.isError ? (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span>{couponMessage.text}</span>
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-zinc-900">
                  {formatPrice(totals.subtotal)}
                </span>
              </div>

              {totals.mrpSavings > 0 && (
                <div className="flex justify-between text-zinc-600">
                  <span>Discount</span>
                  <span>-{formatPrice(totals.mrpSavings)}</span>
                </div>
              )}

              {totals.isCouponApplied && (
                <div className="flex justify-between text-zinc-900 font-medium">
                  <span>Promo (10%)</span>
                  <span>-{formatPrice(totals.couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {totals.deliveryFee === 0 ? (
                    <span className="font-semibold text-zinc-950 uppercase text-[11px]">
                      Complimentary
                    </span>
                  ) : (
                    formatPrice(totals.deliveryFee)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-zinc-200 flex justify-between text-sm sm:text-base font-semibold text-zinc-950">
                <span>Total</span>
                <span>{formatPrice(totals.grandTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-800 active:scale-98 text-white font-medium py-3 px-4 rounded-xl text-xs sm:text-sm transition-all min-h-[44px]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
