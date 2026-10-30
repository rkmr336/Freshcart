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

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [pincode, setPincode] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi" | "card">("upi");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isClient) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-semibold text-zinc-950">Your bag is empty</h2>
        <p className="text-xs text-zinc-500">
          Add items to your bag before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="inline-block bg-zinc-950 text-white font-medium text-xs px-5 py-2.5 rounded-lg hover:bg-zinc-800"
        >
          Explore Collection
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

    if (!address.trim()) err.address = "Street address and house/flat number is required";
    else if (address.trim().length < 8) err.address = "Please enter full delivery address";

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
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
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
        deliverySlot === "standard"
          ? "Standard Tracked Delivery (3-5 business days)"
          : "Express Priority Air Delivery (1-2 business days)",
      paymentMethod,
      estimatedDelivery:
        deliverySlot === "standard" ? "3-5 Business Days" : "1-2 Business Days",
    };

    try {
      localStorage.setItem("atelier_recent_order", JSON.stringify(orderData));
      clearCart();
      router.push(`/order-success?orderId=${orderId}`);
    } catch (e) {
      console.error("Order save failure", e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">
          Checkout & Shipping
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Complete your delivery details to place the dropshipping order
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Area */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Address */}
            <div className="bg-white rounded-xl border border-zinc-200 p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
                <MapPin className="w-4 h-4 text-zinc-900" />
                <h3 className="text-sm font-semibold tracking-tight text-zinc-950 uppercase">
                  1. Shipping Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Verma"
                    className={`w-full bg-zinc-50 border rounded-lg px-3.5 py-2 text-xs text-zinc-900 focus:bg-white focus:outline-none ${
                      errors.name ? "border-red-400" : "border-zinc-200 focus:border-zinc-950"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-zinc-400 font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="9876543210"
                      className={`w-full bg-zinc-50 border rounded-lg pl-11 pr-3 py-2 text-xs text-zinc-900 focus:bg-white focus:outline-none ${
                        errors.phone ? "border-red-400" : "border-zinc-200 focus:border-zinc-950"
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
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav@atelier.com"
                    className={`w-full bg-zinc-50 border rounded-lg px-3.5 py-2 text-xs text-zinc-900 focus:bg-white focus:outline-none ${
                      errors.email ? "border-red-400" : "border-zinc-200 focus:border-zinc-950"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Street Address & House / Flat No. *
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Apartment 4B, Signature Crest, Linking Road, Bandra West"
                    className={`w-full bg-zinc-50 border rounded-lg px-3.5 py-2 text-xs text-zinc-900 focus:bg-white focus:outline-none ${
                      errors.address ? "border-red-400" : "border-zinc-200 focus:border-zinc-950"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-[11px] text-red-600 mt-0.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    className={`w-full bg-zinc-50 border rounded-lg px-3.5 py-2 text-xs text-zinc-900 focus:bg-white focus:outline-none ${
                      errors.city ? "border-red-400" : "border-zinc-200 focus:border-zinc-950"
                    }`}
                  />
                  {errors.city && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    placeholder="400050"
                    className={`w-full bg-zinc-50 border rounded-lg px-3.5 py-2 text-xs text-zinc-900 focus:bg-white focus:outline-none ${
                      errors.pincode ? "border-red-400" : "border-zinc-200 focus:border-zinc-950"
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

            {/* 2. Courier Options */}
            <div className="bg-white rounded-xl border border-zinc-200 p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
                <Clock className="w-4 h-4 text-zinc-900" />
                <h3 className="text-sm font-semibold tracking-tight text-zinc-950 uppercase">
                  2. Courier Delivery Option
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-3.5 rounded-lg border flex flex-col justify-between cursor-pointer transition-all ${
                    deliverySlot === "standard"
                      ? "border-zinc-950 bg-zinc-50 font-medium text-zinc-950"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">Standard Tracked Courier</span>
                    <input
                      type="radio"
                      name="slot"
                      checked={deliverySlot === "standard"}
                      onChange={() => setDeliverySlot("standard")}
                      className="accent-zinc-950 cursor-pointer"
                    />
                  </div>
                  <span className="text-[11px] text-zinc-500 font-normal">
                    3-5 Business Days across all metro and urban hubs
                  </span>
                </label>

                <label
                  className={`p-3.5 rounded-lg border flex flex-col justify-between cursor-pointer transition-all ${
                    deliverySlot === "express"
                      ? "border-zinc-950 bg-zinc-50 font-medium text-zinc-950"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">Priority Air Express</span>
                    <input
                      type="radio"
                      name="slot"
                      checked={deliverySlot === "express"}
                      onChange={() => setDeliverySlot("express")}
                      className="accent-zinc-950 cursor-pointer"
                    />
                  </div>
                  <span className="text-[11px] text-zinc-500 font-normal">
                    1-2 Business Days priority warehouse dispatch
                  </span>
                </label>
              </div>
            </div>

            {/* 3. Payment Option */}
            <div className="bg-white rounded-xl border border-zinc-200 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-zinc-900" />
                  <h3 className="text-sm font-semibold tracking-tight text-zinc-950 uppercase">
                    3. Payment Method (Sandbox / Test Mode)
                  </h3>
                </div>
                <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-medium">
                  Simulated Gateway
                </span>
              </div>

              <div className="space-y-2.5">
                <label
                  className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === "upi"
                      ? "border-zinc-950 bg-zinc-50 font-medium text-zinc-950"
                      : "border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-zinc-100 text-zinc-900">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold block">
                        Instant UPI (Google Pay, PhonePe, Paytm)
                      </span>
                      <span className="text-[11px] text-zinc-500 font-normal">
                        Fastest payment via simulated instant authorization
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="accent-zinc-950 cursor-pointer"
                  />
                </label>

                <label
                  className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-zinc-950 bg-zinc-50 font-medium text-zinc-950"
                      : "border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-zinc-100 text-zinc-900">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold block">
                        Credit / Debit Card / Netbanking
                      </span>
                      <span className="text-[11px] text-zinc-500 font-normal">
                        All major Visa, Mastercard, RuPay & Amex accepted
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="accent-zinc-950 cursor-pointer"
                  />
                </label>

                <label
                  className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-zinc-950 bg-zinc-50 font-medium text-zinc-950"
                      : "border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-zinc-100 text-zinc-900">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold block">
                        Cash on Delivery
                      </span>
                      <span className="text-[11px] text-zinc-500 font-normal">
                        Pay upon courier arrival at your address
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-zinc-950 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Sticky Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4 sticky top-28">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
                Review Bag ({totals.totalItemCount} items)
              </h3>

              <div className="max-h-52 overflow-y-auto divide-y divide-zinc-100 pr-1 text-xs">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="py-2.5 first:pt-0 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-12 object-cover rounded bg-zinc-100 shrink-0"
                      />
                      <div className="truncate">
                        <p className="truncate text-zinc-900 font-medium">
                          {item.quantity}x {item.product.name}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {item.selectedSize} {item.selectedColor ? `• ${item.selectedColor}` : ""}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-zinc-950 shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900">
                    {formatPrice(totals.subtotal)}
                  </span>
                </div>

                {totals.isCouponApplied && (
                  <div className="flex justify-between text-zinc-900 font-medium">
                    <span>Promo Discount</span>
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

                <div className="pt-3 border-t border-zinc-200 flex justify-between text-base font-semibold text-zinc-950">
                  <span>Total Amount</span>
                  <span>{formatPrice(totals.grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-800 active:scale-98 text-white font-medium py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-all disabled:opacity-50 min-h-[44px]"
              >
                {isSubmitting ? (
                  <span>Authorizing Order...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Place Order • {formatPrice(totals.grandTotal)}</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-600" />
                <span>Encrypted 256-Bit SSL Checkout Protection</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
