import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-16 sm:py-24 text-center max-w-md mx-auto space-y-5">
      <div className="w-24 h-24 rounded-full bg-emerald-50 text-5xl flex items-center justify-center mx-auto shadow-inner">
        🥬
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
        Product Not Found
      </h1>
      <p className="text-sm text-gray-600 leading-relaxed">
        The grocery item you are looking for might have been moved, seasonal
        produce that ended, or the link is incorrect.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm min-h-[44px]"
        >
          <Search className="w-4 h-4" />
          <span>Browse All Groceries</span>
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-bold text-xs px-5 py-3 rounded-xl hover:bg-gray-50 transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

