import Link from "next/link";
import { Search, Home } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <div className="py-20 text-center max-w-md mx-auto space-y-4">
      <div className="w-24 h-24 rounded-full bg-emerald-50 text-5xl flex items-center justify-center mx-auto shadow-inner">
        🛒
      </div>
      <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
        404 Page Not Found
      </span>
      <h1 className="text-3xl font-extrabold text-gray-900">
        Lost in the Aisles?
      </h1>
      <p className="text-sm text-gray-500 leading-relaxed">
        The grocery shelf you are trying to visit does not exist or has been rearranged.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-sm min-h-[44px]"
        >
          <Home className="w-4 h-4" />
          <span>Go to FreshKart Home</span>
        </Link>
        <Link
          href="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs px-5 py-3 rounded-xl transition-all min-h-[44px]"
        >
          <Search className="w-4 h-4" />
          <span>Browse Groceries</span>
        </Link>
      </div>
    </div>
  );
}

