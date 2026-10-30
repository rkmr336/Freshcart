import React, { Suspense } from "react";
import ProductsPageContent from "@/components/ProductsPageContent";

export const metadata = {
  title: "Products & Groceries - FreshKart",
  description: "Browse farm fresh fruits, crispy vegetables, dairy, eggs, and groceries with filters and sorting.",
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center space-y-4">
          <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-emerald-800">
            Loading fresh groceries...
          </p>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}

