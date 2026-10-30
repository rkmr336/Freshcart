"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { OrderDetails } from "@/types";
import { formatPrice } from "@/lib/helpers";

export default function OrderSuccessPageContent() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get("orderId");

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("freshkart_recent_order");
      if (stored) {
        const parsed: OrderDetails = JSON.parse(stored);
        if (!orderIdFromUrl || parsed.orderId === orderIdFromUrl) {
          setOrder(parsed);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to read order data", e);
    }
    setLoading(false);
  }, [orderIdFromUrl]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect to home if no order exists
  if (!order) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-3xl flex items-center justify-center mx-auto">
          📦
        </div>
        <h2 className="text-xl font-bold text-gray-900">No Recent Order Found</h2>
        <p className="text-xs text-gray-500">
          Looks like you haven&apos;t placed any recent grocery orders.
        </p>
        <Link
          href="/"
          className="inline-block bg-emerald-600 text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-emerald-700"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4 sm:py-8">
      {/* Success Hero Header */}
      <div className="text-center space-y-3 bg-white rounded-3xl border border-emerald-100 p-8 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-in zoom-in">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Order Confirmed & Placed!
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Thank you, {order.customerName}!
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          We received your grocery order. Our harvest team is packing your fresh items in temperature-controlled bags.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-1.5 text-xs">
            <span className="text-gray-400">Order ID: </span>
            <strong className="text-gray-900 font-mono">{order.orderId}</strong>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-1.5 text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>ETA: {order.estimatedDelivery}</span>
          </div>
        </div>
      </div>

      {/* Order Status Cards */}
      <div className="bg-white rounded-2xl border border-emerald-100 p-5 sm:p-6 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
          <Package className="w-4 h-4 text-emerald-600" />
          <span>Items Ordered ({order.items.length})</span>
        </h3>

        <div className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="py-3 first:pt-0 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl shrink-0">
                  {item.emoji}
                </span>
                <div>
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <p className="text-gray-400">
                    {item.unit} &bull; Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-bold text-emerald-950">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Financial Recap */}
        <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Coupon Discount</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>
              {order.deliveryFee === 0 ? "FREE" : formatPrice(order.deliveryFee)}
            </span>
          </div>
          <div className="pt-2 border-t border-gray-200 flex justify-between text-sm sm:text-base font-extrabold text-gray-900">
            <span>Paid Amount ({order.paymentMethod.toUpperCase()})</span>
            <span className="text-emerald-700">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Destination Card */}
      <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs space-y-2 text-xs">
        <h4 className="font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5 text-xs">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>Delivery Details</span>
        </h4>
        <p className="text-gray-700 leading-relaxed">
          {order.address}, {order.city} - {order.pincode}
        </p>
        <p className="text-gray-500">
          Phone: +91 {order.phone} &bull; Slot: {order.deliverySlot}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-sm transition-all min-h-[44px]"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order More Fresh Items</span>
        </Link>
        <Link
          href="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs px-6 py-3.5 rounded-2xl transition-colors min-h-[44px]"
        >
          <span>Explore All Categories</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
