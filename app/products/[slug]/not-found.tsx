import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-24 text-center max-w-md mx-auto space-y-4">
      <span className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
        404 Not Found
      </span>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
        Product Unavailable
      </h1>
      <p className="text-xs text-zinc-500 leading-relaxed font-normal">
        The piece you requested could not be found or has been archived from the collection.
      </p>
      <div className="pt-2">
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 bg-zinc-950 text-white font-medium text-xs px-5 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Browse All Pieces</span>
        </Link>
      </div>
    </div>
  );
}
