import { Coupon } from "../../../../DB/Models/index.js";
import { DateTime } from "luxon";
import { DiscountType } from "../../../Utils/index.js";
/**
 *
 * @param {*} couponCode
 * @param {*} userId
 * @returns { message: string, error: Boolean , coupon: Object }
 */
export const validateCoupon = async (couponCode, userId) => {
  // get coupon by couponCode
  const coupon = await Coupon.findOne({ couponCode });
  if (!coupon) {
    return { message: "Invalid coupon code", error: true };
  }

  // check if coupon is active
  if (!coupon.isActive || DateTime.now() > DateTime.fromJSDate(coupon.till)) {
    return { message: "Coupon is not active", error: true };
  }

  // check if coupon is not started yet
  if (DateTime.now() < DateTime.fromJSDate(coupon.from)) {
    return {
      message: `Coupon is not started yet ,will start at ${coupon.from}`,
      error: true,
    };
  }

  // check if user is not assigned to this coupon or he takes the maximum amount
  const isUserAssigned = coupon.Users.some(
    (u) =>
      u.userId.toString() !== userId.toString() ||
      (u.userId.toString() === userId.toString() && u.maxUsage < u.maxcount)
  );
  if (isUserAssigned) {
    return {
      message: "Coupon is already assigned Or you reedem all tries",
      error: true,
    };
  }
  return { error: false, coupon };
};

// apply the coupon
export const applyCoupon = (subTotal, coupon) => {
  let total = subTotal;
  const { couponAmount: discountAmount, couponType: discountType } = coupon;
  if (couponAmount && couponType) {
    if (discountType == DiscountType.PERCENTAGE) {
      total = subTotal + (subTotal - discountAmount / 100);
    } else if (discountType == DiscountType.Amount) {
      if (discountAmount > subTotal) {
        return total;
      }
      total = subTotal - discountAmount;
    }
  }
  return total;
};
