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
    md: "h-9 text-sm",
    lg: "h-11 text-base",
  };

  const btnClasses = {
    sm: "w-7 h-7",
    md: "w-8 h-8",
    lg: "w-9 h-9",
  };

  return (
    <div
      className={`inline-flex items-center justify-between bg-emerald-50 border border-emerald-300 rounded-xl px-1 font-semibold text-emerald-900 select-none ${sizeClasses[size]} ${className}`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onDecrease();
        }}
        disabled={quantity <= min}
        className={`flex items-center justify-center rounded-lg hover:bg-emerald-200/80 active:bg-emerald-300 transition-colors text-emerald-700 disabled:opacity-40 disabled:pointer-events-none ${btnClasses[size]}`}
        aria-label="Decrease quantity"
      >
        {quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-600" /> : <Minus className="w-3.5 h-3.5" />}
      </button>

      <span className="px-2.5 text-center min-w-6 tabular-nums font-bold text-emerald-950">
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
        className={`flex items-center justify-center rounded-lg hover:bg-emerald-200/80 active:bg-emerald-300 transition-colors text-emerald-700 disabled:opacity-40 disabled:pointer-events-none ${btnClasses[size]}`}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

