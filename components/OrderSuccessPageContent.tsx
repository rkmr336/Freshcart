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
      const stored =
        localStorage.getItem("atelier_recent_order") ||
        localStorage.getItem("freshkart_recent_order");
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
        <div className="inline-block w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-semibold text-zinc-950">No Order Found</h2>
        <p className="text-xs text-zinc-500">
          We could not locate any active recent order details.
        </p>
        <Link
          href="/"
          className="inline-block bg-zinc-950 text-white font-medium text-xs px-5 py-2.5 rounded-lg hover:bg-zinc-800"
        >
          Return to Atelier
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4 sm:py-8">
      {/* Success Box */}
      <div className="text-center space-y-3 bg-white rounded-2xl border border-zinc-200 p-8">
        <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-950 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <span className="inline-block text-[10px] uppercase tracking-widest font-semibold text-zinc-500 bg-zinc-100 px-3 py-1 rounded">
          Order Confirmed
        </span>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">
          Thank you, {order.customerName}
        </h1>

        <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto font-normal">
          Your order has been routed to our direct fulfilment warehouse. A shipment confirmation with live tracking will be delivered to your inbox.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg px-3.5 py-1.5 text-xs">
            <span className="text-zinc-400">Order Reference: </span>
            <strong className="text-zinc-950 font-mono">{order.orderId}</strong>
          </div>
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg px-3.5 py-1.5 text-xs text-zinc-800 font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-600" />
            <span>ETA: {order.estimatedDelivery}</span>
          </div>
        </div>
      </div>

      {/* Ordered Items */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 sm:p-6 space-y-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 pb-3 border-b border-zinc-100 flex items-center gap-2">
          <Package className="w-4 h-4 text-zinc-700" />
          <span>Items in Shipment ({order.items.length})</span>
        </h3>

        <div className="divide-y divide-zinc-100">
          {order.items.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="py-3 first:pt-0 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-14 object-cover rounded bg-zinc-100 border border-zinc-200 shrink-0"
                  />
                ) : (
                  <span className="w-12 h-14 rounded bg-zinc-100 flex items-center justify-center text-lg shrink-0">
                    {item.emoji || "📦"}
                  </span>
                )}
                <div>
                  <p className="font-medium text-zinc-900">{item.name}</p>
                  <p className="text-zinc-400 text-[11px]">
                    Qty: {item.quantity} {item.selectedSize ? `• ${item.selectedSize}` : ""}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-zinc-950">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Breakdown */}
        <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-zinc-900 font-medium">
              <span>Promotion</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {order.deliveryFee === 0 ? "Complimentary" : formatPrice(order.deliveryFee)}
            </span>
          </div>
          <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm sm:text-base font-semibold text-zinc-950">
            <span>Total Paid ({order.paymentMethod.toUpperCase()})</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Address Details */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-2 text-xs">
        <h4 className="font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5 text-[11px]">
          <MapPin className="w-4 h-4 text-zinc-700" />
          <span>Delivery Address</span>
        </h4>
        <p className="text-zinc-700 leading-relaxed font-normal">
          {order.address}, {order.city} - {order.pincode}
        </p>
        <p className="text-zinc-500">
          Phone: +91 {order.phone} &bull; Service: {order.deliverySlot}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs px-6 py-3 rounded-xl transition-all min-h-[44px]"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium text-xs px-6 py-3 rounded-xl transition-colors min-h-[44px]"
        >
          <span>Return Home</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
