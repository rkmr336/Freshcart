"use client";

import React, { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Lock,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, generateOrderId } from "@/lib/helpers";
import { OrderDetails } from "@/types";

const emptySubscribe = () => () => {};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totals, clearCart } = useCart();

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Gurugram");
  const [pincode, setPincode] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("express-30");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi" | "card">("cod");

  // Error states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isClient) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-4xl flex items-center justify-center mx-auto">
          🛒
        </div>
        <h2 className="text-xl font-bold text-gray-900">Your basket is empty</h2>
        <p className="text-xs text-gray-500">
          You don&apos;t have any groceries in your cart to checkout.
        </p>
        <Link
          href="/products"
          className="inline-block bg-emerald-600 text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-emerald-700"
        >
          Browse Fresh Groceries
        </Link>
      </div>
    );
  }

  const validate = () => {
    const err: { [key: string]: string } = {};

    if (!name.trim()) err.name = "Full name is required";
    else if (name.trim().length < 3) err.name = "Enter at least 3 characters";

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone) err.phone = "Phone number is required";
    else if (cleanPhone.length !== 10) err.phone = "Enter a valid 10-digit mobile number";

    if (!email.trim()) err.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      err.email = "Enter a valid email address";

    if (!address.trim()) err.address = "Delivery address & flat/house no is required";
    else if (address.trim().length < 8) err.address = "Please enter full street address";

    if (!city.trim()) err.city = "City is required";

    const cleanPin = pincode.replace(/\D/g, "");
    if (!cleanPin) err.pincode = "Pincode is required";
    else if (cleanPin.length !== 6) err.pincode = "Enter a valid 6-digit Indian pincode";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const orderId = generateOrderId();
    const orderData: OrderDetails = {
      orderId,
      createdAt: new Date().toISOString(),
      items: cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        emoji: item.product.emoji,
        unit: item.product.unit,
        price: item.product.price,
        quantity: item.quantity,
      })),
      subtotal: totals.subtotal,
      discount: totals.couponDiscount,
      deliveryFee: totals.deliveryFee,
      total: totals.grandTotal,
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      deliverySlot:
        deliverySlot === "express-30"
          ? "Express 30 Mins"
          : deliverySlot === "morning"
          ? "Morning Slot (7:00 AM - 9:00 AM)"
          : "Evening Slot (6:00 PM - 8:30 PM)",
      paymentMethod,
      estimatedDelivery:
        deliverySlot === "express-30"
          ? "Within 30 minutes"
          : "Tomorrow, Scheduled Slot",
    };

    try {
      localStorage.setItem("freshkart_recent_order", JSON.stringify(orderData));
      clearCart();
      router.push(`/order-success?orderId=${orderId}`);
    } catch (e) {
      console.error("Order save failure", e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Delivery & Checkout
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Safe contactless delivery to your home or office address
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Delivery & Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Contact & Address Details */}
            <div className="bg-white rounded-2xl border border-emerald-100 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-gray-900">
                  1. Delivery Address
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full bg-gray-50 border rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:bg-white focus:outline-none ${
                      errors.name ? "border-red-400" : "border-gray-200 focus:border-emerald-500"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    10-Digit Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-gray-400 font-semibold">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="9876543210"
                      className={`w-full bg-gray-50 border rounded-xl pl-12 pr-3.5 py-2.5 text-xs text-gray-900 focus:bg-white focus:outline-none ${
                        errors.phone ? "border-red-400" : "border-gray-200 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address (for invoice & receipt) *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@example.com"
                    className={`w-full bg-gray-50 border rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:bg-white focus:outline-none ${
                      errors.email ? "border-red-400" : "border-gray-200 focus:border-emerald-500"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Flat / House No., Apartment, Street *
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat 402, Green Palm Residency, Main Market Road"
                    className={`w-full bg-gray-50 border rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:bg-white focus:outline-none ${
                      errors.address ? "border-red-400" : "border-gray-200 focus:border-emerald-500"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-[11px] text-red-600 mt-0.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Gurugram / New Delhi"
                    className={`w-full bg-gray-50 border rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:bg-white focus:outline-none ${
                      errors.city ? "border-red-400" : "border-gray-200 focus:border-emerald-500"
                    }`}
                  />
                  {errors.city && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    6-Digit Pincode *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    placeholder="122002"
                    className={`w-full bg-gray-50 border rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:bg-white focus:outline-none ${
                      errors.pincode ? "border-red-400" : "border-gray-200 focus:border-emerald-500"
                    }`}
                  />
                  {errors.pincode && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.pincode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Choose Delivery Slot */}
            <div className="bg-white rounded-2xl border border-emerald-100 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Clock className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-gray-900">
                  2. Choose Delivery Window
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    deliverySlot === "express-30"
                      ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">⚡ Express 30 Mins</span>
                    <input
                      type="radio"
                      name="slot"
                      checked={deliverySlot === "express-30"}
                      onChange={() => setDeliverySlot("express-30")}
                      className="accent-emerald-600 cursor-pointer"
                    />
                  </div>
                  <span className="text-[11px] text-gray-500 font-normal">
                    Delivered in 25-35 minutes from local dark store
                  </span>
                </label>

                <label
                  className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    deliverySlot === "morning"
                      ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">🌅 Tomorrow Morning</span>
                    <input
                      type="radio"
                      name="slot"
                      checked={deliverySlot === "morning"}
                      onChange={() => setDeliverySlot("morning")}
                      className="accent-emerald-600 cursor-pointer"
                    />
                  </div>
                  <span className="text-[11px] text-gray-500 font-normal">
                    7:00 AM - 9:00 AM (Fresh milk & bread slot)
                  </span>
                </label>

                <label
                  className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    deliverySlot === "evening"
                      ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">🌆 Tomorrow Evening</span>
                    <input
                      type="radio"
                      name="slot"
                      checked={deliverySlot === "evening"}
                      onChange={() => setDeliverySlot("evening")}
                      className="accent-emerald-600 cursor-pointer"
                    />
                  </div>
                  <span className="text-[11px] text-gray-500 font-normal">
                    6:00 PM - 8:30 PM (Evening dinner preparation)
                  </span>
                </label>
              </div>
            </div>

            {/* 3. Payment Method Choice (UI only simulation) */}
            <div className="bg-white rounded-2xl border border-emerald-100 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-gray-900">
                    3. Payment Option (Test Mode)
                  </h3>
                </div>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                  No Real Charges
                </span>
              </div>

              <div className="space-y-2.5">
                <label
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-emerald-600 bg-emerald-50/60 font-bold text-emerald-950"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">
                        Cash / UPI on Delivery
                      </span>
                      <span className="text-[11px] text-gray-500 font-normal">
                        Pay cash or scan QR upon delivery at your doorstep
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-emerald-600 cursor-pointer"
                  />
                </label>

                <label
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === "upi"
                      ? "border-emerald-600 bg-emerald-50/60 font-bold text-emerald-950"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-800">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">
                        Instant UPI (GPay, PhonePe, Paytm)
                      </span>
                      <span className="text-[11px] text-gray-500 font-normal">
                        Fastest payment via simulated UPI intent
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="accent-emerald-600 cursor-pointer"
                  />
                </label>

                <label
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-emerald-600 bg-emerald-50/60 font-bold text-emerald-950"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">
                        Credit / Debit Card / Netbanking
                      </span>
                      <span className="text-[11px] text-gray-500 font-normal">
                        All major Visa, Mastercard & RuPay cards accepted
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="accent-emerald-600 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Checkout Order Summary Sticky Box */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs space-y-4 sticky top-28">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
                Order Review ({totals.totalItemCount} items)
              </h3>

              {/* Items preview */}
              <div className="max-h-48 overflow-y-auto divide-y divide-gray-50 pr-1 text-xs">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="py-2 first:pt-0 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span>{item.product.emoji}</span>
                      <span className="truncate text-gray-800">
                        {item.quantity}x {item.product.name}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(totals.subtotal)}
                  </span>
                </div>

                {totals.isCouponApplied && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon FRESH10 (10%)</span>
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

                <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-extrabold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-emerald-700">
                    {formatPrice(totals.grandTotal)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-3.5 px-4 rounded-2xl shadow-sm shadow-emerald-700/20 text-sm transition-all disabled:opacity-50 min-h-[44px]"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Place Grocery Order &bull; {formatPrice(totals.grandTotal)}</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-[11px] text-gray-400 space-y-1 text-center">
                <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Safe & Sealed Deliveries</span>
                </div>
                <p>By placing order you agree to FreshKart hygiene terms</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
