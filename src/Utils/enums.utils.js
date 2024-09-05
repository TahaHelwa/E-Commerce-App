import joi from "joi";
export const Badges = {
  NEW: "New",
  SALE: "Sale",
  BEST_SELLER: "Best Seller",
};

export const DiscountType = {
  PERCENTAGE: "Percentage",
  FIXED: "Fixed",
};

export const CouponTypes = {
  PERCENTAGE: "Percentage",
  FIXED: "Fixed",
};

export const generalRules = {
  _id: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid user ID format",
    }),
};

export const paymentMethods = {
  Stripe: "Stripe",
  Paymop: "Paymop",
  Cash: "Cash",
};

export const OrderStatus = {
  Pending: "pending",
  Placed: "placed",
  Confirmed: "confirmed",
  Cancelled: "cancelled",
  Refunded: "refunded",
  Returned: "returned",
  Delivered: "delivered",
  Dropped: "dropped",
  OneWay: "oneway",
};
