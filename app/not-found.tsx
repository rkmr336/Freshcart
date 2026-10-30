import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <div className="py-28 text-center max-w-md mx-auto space-y-4">
      <span className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
        404
      </span>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">
        Page Not Found
      </h1>
      <p className="text-xs text-zinc-500 leading-relaxed font-normal">
        The page you are looking for does not exist or has been relocated.
      </p>
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs px-5 py-2.5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Atelier Home</span>
        </Link>
      </div>
    </div>
  );
}
