"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem } from "@/types";
import { calculateCartTotals, VALID_COUPON_CODE } from "@/lib/helpers";
import { useToast } from "./ToastContext";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  couponCode: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  totals: ReturnType<typeof calculateCartTotals>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "freshkart_cart_v1";
const COUPON_STORAGE_KEY = "freshkart_coupon_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { showToast } = useToast();

  // Guard localStorage access to prevent SSR hydration mismatch
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      const storedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
      if (storedCoupon) {
        setCouponCode(storedCoupon);
      }
    } catch (e) {
      console.error("Failed to restore cart from storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to storage after initial load
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to persist cart", e);
    }
  }, [cart, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (couponCode) {
        localStorage.setItem(COUPON_STORAGE_KEY, couponCode);
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to persist coupon", e);
    }
  }, [couponCode, isLoaded]);

  const addToCart = (product: Product, quantity = 1) => {
    if (!product.inStock) {
      showToast(`${product.name} is currently out of stock`, "error");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    showToast(`Added ${product.name} to cart`, "success");
    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    if (item) {
      showToast(`Removed ${item.product.name} from cart`, "info");
    }
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode(null);
  };

  const getItemQuantity = (productId: string): number => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: "Please enter a coupon code" };
    }
    if (cleanCode === VALID_COUPON_CODE) {
      setCouponCode(cleanCode);
      showToast("Coupon FRESH10 applied! 10% discount added.", "success");
      return { success: true, message: "Coupon FRESH10 applied successfully!" };
    }
    return {
      success: false,
      message: "Invalid coupon code. Try FRESH10 for 10% off.",
    };
  };

  const removeCoupon = () => {
    setCouponCode(null);
    showToast("Coupon removed", "info");
  };

  const totals = calculateCartTotals(cart, couponCode);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        couponCode,
        applyCoupon,
        removeCoupon,
        totals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

