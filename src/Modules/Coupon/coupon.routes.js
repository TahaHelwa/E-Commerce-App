import { Router } from "express";
// controllers
import * as couponControllers from "./coupon.controller.js";
// middlewares
import * as middleware from "../../middlewares/index.js";
import { couponSchema, updateCouponSchema } from "./coupon.schema.js";

const couponRouter = Router();
const { authenticate, errorHandler, validateMiddleware } = middleware;

// routes

couponRouter.post(
  "/create",
  authenticate,
  validateMiddleware(couponSchema),
  errorHandler(couponControllers.createCoupon)
);
couponRouter.get("/", errorHandler(couponControllers.getCoupons));
couponRouter.get("/:couponId", errorHandler(couponControllers.getCouponById));
couponRouter.put(
  "/update/:couponId",
  authenticate,
  validateMiddleware(updateCouponSchema),
  errorHandler(couponControllers.updateCouponById)
);
couponRouter.put(
  "/status/:couponId",
  authenticate,
  errorHandler(couponControllers.disableEnableCoupon)
);

export { couponRouter };
