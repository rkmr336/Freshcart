"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCcw, ArrowLeft } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="py-24 text-center max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
        Something went wrong
      </h2>
      <p className="text-xs text-zinc-500">
        An unexpected error occurred while loading this view.
      </p>
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs px-4 py-2.5 rounded-lg transition-colors"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium text-xs px-4 py-2.5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </div>
    </div>
  );
}
