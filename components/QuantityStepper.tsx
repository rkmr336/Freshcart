"use client";

import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  min = 0,
  max = 99,
  size = "md",
  className = "",
}: QuantityStepperProps) {
  const sizeClasses = {
    sm: "h-8 text-xs",
    md: "h-10 text-xs",
    lg: "h-11 text-sm",
  };

  const btnClasses = {
    sm: "w-7 h-7",
    md: "w-8 h-8",
    lg: "w-9 h-9",
  };

  return (
    <div
      className={`inline-flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-lg px-1 text-zinc-900 select-none ${sizeClasses[size]} ${className}`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onDecrease();
        }}
        disabled={quantity <= min}
        className={`flex items-center justify-center rounded text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/70 active:bg-zinc-300 transition-colors disabled:opacity-30 disabled:pointer-events-none ${btnClasses[size]}`}
        aria-label="Decrease quantity"
      >
        {quantity === 1 ? (
          <Trash2 className="w-3.5 h-3.5 text-zinc-600 hover:text-red-600" />
        ) : (
          <Minus className="w-3 h-3" />
        )}
      </button>

      <span className="px-3 text-center min-w-6 tabular-nums font-medium text-zinc-900">
        {quantity}
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onIncrease();
        }}
        disabled={quantity >= max}
        className={`flex items-center justify-center rounded text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/70 active:bg-zinc-300 transition-colors disabled:opacity-30 disabled:pointer-events-none ${btnClasses[size]}`}
        aria-label="Increase quantity"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}
