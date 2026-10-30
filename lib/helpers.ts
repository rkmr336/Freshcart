import { CartItem } from "@/types";

export const FREE_DELIVERY_THRESHOLD = 1499;
export const STANDARD_DELIVERY_FEE = 99;
export const VALID_COUPON_CODE = "STUDIO10";
export const COUPON_DISCOUNT_PERCENT = 10;

/**
 * Formats a numeric value to currency format (INR ₹)
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculates discount percentage given current price and original MRP
 */
export function getDiscountPercentage(price: number, mrp: number): number {
  if (mrp <= price || mrp <= 0) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

/**
 * Computes subtotal, savings from MRP, coupon discount, delivery fee, and net total
 */
export function calculateCartTotals(items: CartItem[], couponCode: string | null = null) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalMrp = items.reduce(
    (sum, item) => sum + item.product.mrp * item.quantity,
    0
  );

  const mrpSavings = Math.max(0, totalMrp - subtotal);

  const isCouponApplied =
    couponCode?.trim().toUpperCase() === VALID_COUPON_CODE ||
    couponCode?.trim().toUpperCase() === "FRESH10";

  const couponDiscount = isCouponApplied
    ? Math.round((subtotal * COUPON_DISCOUNT_PERCENT) / 100)
    : 0;

  const totalSavings = mrpSavings + couponDiscount;

  const deliveryFee =
    subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD
      ? 0
      : STANDARD_DELIVERY_FEE;

  const amountNeededForFreeDelivery = Math.max(
    0,
    FREE_DELIVERY_THRESHOLD - subtotal
  );

  const grandTotal = Math.max(0, subtotal - couponDiscount + deliveryFee);

  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return {
    subtotal,
    totalMrp,
    mrpSavings,
    isCouponApplied,
    couponDiscount,
    totalSavings,
    deliveryFee,
    amountNeededForFreeDelivery,
    grandTotal,
    totalItemCount,
  };
}

/**
 * Generates an authentic order reference ID e.g. "ORD-94821"
 */
export function generateOrderId(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${randomNum}`;
}
