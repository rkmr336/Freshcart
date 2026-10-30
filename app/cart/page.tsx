"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trash2,
  Heart,
  ArrowRight,
  Sparkles,
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
      <div className="py-16 sm:py-24 text-center max-w-md mx-auto space-y-4">
        <div className="w-24 h-24 rounded-full bg-emerald-50 text-5xl flex items-center justify-center mx-auto shadow-inner">
          🛒
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Your Cart is Empty
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Looks like you haven&apos;t added any farm fresh produce or groceries to your basket yet.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-sm transition-all min-h-[44px]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            You have <strong className="text-emerald-700">{totals.totalItemCount}</strong> fresh items in your basket
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {/* Free Delivery Progress Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80">
        {totals.amountNeededForFreeDelivery > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-950">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Add {formatPrice(totals.amountNeededForFreeDelivery)} more for FREE Delivery!
              </span>
              <span>{Math.min(100, Math.round((totals.subtotal / 499) * 100))}%</span>
            </div>
            <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (totals.subtotal / 499) * 100)}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Hooray! You unlocked FREE Delivery on this order.</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs divide-y divide-gray-100 overflow-hidden">
            {cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-center text-3xl shrink-0">
                    {product.emoji}
                  </div>
                  <div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-sm sm:text-base font-bold text-gray-900 hover:text-emerald-700 transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {product.unit} &bull; {formatPrice(product.price)} each
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => handleMoveToWishlist(product)}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Move to Wishlist</span>
                      </button>
                      <span className="text-gray-300">&bull;</span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-xs font-semibold text-gray-400 hover:text-red-600 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <QuantityStepper
                    quantity={quantity}
                    onIncrease={() => updateQuantity(product.id, quantity + 1)}
                    onDecrease={() => updateQuantity(product.id, quantity - 1)}
                    size="sm"
                  />
                  <div className="text-right min-w-[70px]">
                    <span className="text-base font-bold text-emerald-950">
                      {formatPrice(product.price * quantity)}
                    </span>
                    {product.mrp > product.price && (
                      <p className="text-[11px] text-gray-400 line-through">
                        {formatPrice(product.mrp * quantity)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              href="/products"
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:underline flex items-center gap-1.5"
            >
              &larr; Add more groceries
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          {/* Coupon Box */}
          <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Apply Promo Code
              </h3>
            </div>

            {couponCode ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-emerald-900">
                    {couponCode}
                  </span>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    10% discount applied!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs font-bold text-red-600 hover:underline"
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
                    placeholder="Enter code (e.g. FRESH10)"
                    className="flex-1 uppercase bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors min-h-[38px]"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`text-xs flex items-center gap-1 ${
                      couponMessage.isError ? "text-red-600" : "text-emerald-700"
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
                <p className="text-[11px] text-gray-400">
                  Tip: Use promo code <strong>FRESH10</strong> for 10% instant off.
                </p>
              </form>
            )}
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              Bill Details
            </h3>

            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(totals.subtotal)}
                </span>
              </div>

              {totals.mrpSavings > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Product Discount (from MRP)</span>
                  <span>-{formatPrice(totals.mrpSavings)}</span>
                </div>
              )}

              {totals.isCouponApplied && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount (10%)</span>
                  <span>-{formatPrice(totals.couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>
                  {totals.deliveryFee === 0 ? (
                    <strong className="text-emerald-700 font-bold uppercase">
                      FREE
                    </strong>
                  ) : (
                    formatPrice(totals.deliveryFee)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between text-sm sm:text-base font-extrabold text-gray-900">
                <span>To Pay</span>
                <span className="text-emerald-700">
                  {formatPrice(totals.grandTotal)}
                </span>
              </div>

              {totals.totalSavings > 0 && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl text-center border border-emerald-200/60">
                  🎉 Total Savings on this order: {formatPrice(totals.totalSavings)}
                </div>
              )}
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-3.5 px-4 rounded-2xl shadow-sm shadow-emerald-700/20 text-sm transition-all min-h-[44px]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

