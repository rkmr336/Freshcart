import React, { Suspense } from "react";
import OrderSuccessPageContent from "@/components/OrderSuccessPageContent";

export const metadata = {
  title: "Order Placed Successfully - FreshKart",
};

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderSuccessPageContent />
    </Suspense>
  );
}

