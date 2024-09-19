import { User, Order, Product, Cart } from "../../../DB/Models/index.js";
import { calculateCartTotalPrice, ErrorClass } from "../../Utils/index.js";
import { validateCoupon } from "./Utils/index.js";
/**
 * @API {post} /orders/create - Create a new order
 */

export const createOrder = async (req, res, next) => {
  const userId = req.user._id;
  const {
    addressId,
    address,
    contactNumber,
    couponCode,
    VAT,
    shippingFee,
    paymentMethod,
  } = req.body;
  // find logged in user's cart with products.
  const cart = await Cart.findOne({ userId }).populate("products.productId");
  if (!cart || !cart.products.length) {
    return next(new ErrorClass("Cart is empty", 400));
  }

  // check if any product in the cart is already soldout
  const isSoldOut = cart.products.find((p) => p.productId.stock <= p.quantity);
  if (isSoldOut) {
    return next(
      new ErrorClass(`${isSoldOut.productId.title} product is sold out`, 400)
    );
  }
  // calculate subtotal, total, and applied discount
  const subtotal = calculateCartTotalPrice(cart.products);
  let total = subtotal + shippingFee + VAT;

  if (couponCode) {
    const isCouponValid = await validateCoupon(couponCode, userId);
    if (isCouponValid.error) {
      return next(new ErrorClass(isCouponValid.message, 400));
    }
  }
};
