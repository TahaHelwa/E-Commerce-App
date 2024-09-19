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

export const orderStatus = {
  Pending: "Pending",
  Placed: "Placed",
  Confirmed: "Confirmed",
  Cancelled: "Cancelled",
  Refunded: "Refunded",
  Returned: "Returned",
  Delivered: "Delivered",
  Dropped: "Dropped",
  OneWay: "OneWay",
};
