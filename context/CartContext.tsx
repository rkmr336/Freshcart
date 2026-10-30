"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem } from "@/types";
import { calculateCartTotals, VALID_COUPON_CODE } from "@/lib/helpers";
import { useToast } from "./ToastContext";

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedSize?: string,
    selectedColor?: string
  ) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    selectedSize?: string,
    selectedColor?: string
  ) => void;
  removeFromCart: (
    productId: string,
    selectedSize?: string,
    selectedColor?: string
  ) => void;
  clearCart: () => void;
  getItemQuantity: (
    productId: string,
    selectedSize?: string,
    selectedColor?: string
  ) => number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  couponCode: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  totals: ReturnType<typeof calculateCartTotals>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "atelier_cart_v2";
const COUPON_STORAGE_KEY = "atelier_coupon_v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { showToast } = useToast();

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

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    if (!product.inStock) {
      showToast(`${product.name} is currently out of stock`, "error");
      return;
    }

    const defaultSize = selectedSize || (product.sizes ? product.sizes[0] : undefined);
    const defaultColor = selectedColor || (product.colors ? product.colors[0].name : undefined);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === defaultSize &&
          item.selectedColor === defaultColor
      );

      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prev,
        {
          product,
          quantity,
          selectedSize: defaultSize,
          selectedColor: defaultColor,
        },
      ];
    });

    showToast(`Added ${product.name} to cart`, "success");
    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        const isMatch =
          item.product.id === productId &&
          (selectedSize ? item.selectedSize === selectedSize : true) &&
          (selectedColor ? item.selectedColor === selectedColor : true);
        return isMatch ? { ...item, quantity } : item;
      })
    );
  };

  const removeFromCart = (
    productId: string,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    const item = cart.find(
      (i) =>
        i.product.id === productId &&
        (selectedSize ? i.selectedSize === selectedSize : true) &&
        (selectedColor ? i.selectedColor === selectedColor : true)
    );

    setCart((prev) =>
      prev.filter(
        (i) =>
          !(
            i.product.id === productId &&
            (selectedSize ? i.selectedSize === selectedSize : true) &&
            (selectedColor ? i.selectedColor === selectedColor : true)
          )
      )
    );

    if (item) {
      showToast(`Removed ${item.product.name} from bag`, "info");
    }
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode(null);
  };

  const getItemQuantity = (
    productId: string,
    selectedSize?: string,
    selectedColor?: string
  ): number => {
    const matching = cart.filter(
      (i) =>
        i.product.id === productId &&
        (selectedSize ? i.selectedSize === selectedSize : true) &&
        (selectedColor ? i.selectedColor === selectedColor : true)
    );
    return matching.reduce((sum, item) => sum + item.quantity, 0);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: "Please enter a promo code" };
    }
    if (cleanCode === VALID_COUPON_CODE || cleanCode === "FRESH10") {
      setCouponCode(cleanCode);
      showToast(`Promo ${cleanCode} applied! 10% discount deducted.`, "success");
      return { success: true, message: `Code ${cleanCode} applied successfully.` };
    }
    return {
      success: false,
      message: `Invalid code. Try ${VALID_COUPON_CODE} for 10% off.`,
    };
  };

  const removeCoupon = () => {
    setCouponCode(null);
    showToast("Promo code removed", "info");
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
