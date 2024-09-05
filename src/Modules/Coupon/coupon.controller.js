import { Coupon, CouponChangeLogs } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";
import { User } from "../../../DB/Models/index.js";
/**
 * @API {post} /coupons/create - Create a new Coupon
 */

export const createCoupon = async (req, res, next) => {
  const { couponCode, from, till, couponAmount, couponType, Users } = req.body;
  // check if coupon exists
  const isCouponExist = await Coupon.findOne({ couponCode });
  if (isCouponExist) {
    return next(new ErrorClass("Coupon code already exists", 400));
  }
  const userIds = await Users.map((u) => u.userId); // [userId1, userId2]

  // check if all user ids are valid  (existing in the database)
  const validUsers = await User.find({ _id: { $in: userIds } });
  if (validUsers.length !== userIds.length) {
    return next(new ErrorClass("Invalid user ids", 400));
  }

  // create a new coupon
  const newCoupon = new Coupon({
    couponCode,
    from,
    till,
    couponAmount,
    couponType,
    Users,
    createdBy: req.user._id,
  });

  // save the coupon to the database
  await newCoupon.save();
  res.status(201).json(newCoupon);
};

/**
 * @API {get} /coupons/get - Get all coupons
 */

export const getCoupons = async (req, res, next) => {
  const { isActive } = req.query; // "true" or "false" as string coz of req.query
  const filters = {};
  // check if isEnabled is present and convert it to boolean value
  // "true" becomes true and "false" becomes false (coz of boolean conversion)
  if (isActive === "true") {
    filters.isActive = true;
  } else if (isActive === "false") {
    filters.isActive = false;
  }
  const disabledCoupons = await Coupon.find(filters);
  return res.status(200).json(disabledCoupons);
};

/**
 * @API {get} /coupons/:couponId - get coupon by Id
 */

export const getCouponById = async (req, res, next) => {
  const { couponId } = req.params;
  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    return next(new ErrorClass("Coupon not found", 404));
  }
  return res.status(200).json(coupon);
};

/**
 * @API {put} /coupons/:couponId - Update coupon by Id
 */

export const updateCouponById = async (req, res, next) => {
  const { couponId } = req.params;
  const { Users, from, till, couponCode, couponAmount, couponType } = req.body;
  const userId = req.user._id;

  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    return next(new ErrorClass("Coupon not found", 404));
  }
  const logUpdateObject = { couponId, updatedBy: userId, changes: {} };

  if (couponCode) {
    const isCouponExist = await Coupon.findOne({ couponCode });
    if (isCouponExist) {
      return next(new ErrorClass("Coupon code already exists", 400));
    }
    coupon.couponCode = couponCode;
    logUpdateObject.changes.couponCode = couponCode;
  }
  if (from) {
    coupon.from = from;
    logUpdateObject.changes.from = from;
  }
  if (till) {
    coupon.till = till;
    logUpdateObject.changes.till = till;
  }
  if (couponAmount) {
    coupon.couponAmount = couponAmount;
    logUpdateObject.changes.couponAmount = couponAmount;
  }
  if (couponType) {
    coupon.couponType = couponType;
    logUpdateObject.changes.couponType = couponType;
  }
  if (Users) {
    const userIds = await Users.map((u) => u.userId);
    const validUsers = await User.find({ _id: { $in: userIds } });
    if (validUsers.length !== userIds.length) {
      return next(new ErrorClass("Invalid user ids", 400));
    }
    coupon.Users = Users;
    logUpdateObject.changes.Users = Users;
  }
  await coupon.save();
  const logs = await CouponChangeLogs.create(logUpdateObject);

  return res
    .status(200)
    .json({ message: "Success to update coupon", coupon, logs });
};

/**
 * @API {patch} /coupons/:couponId - disable or enable coupon
 */

export const disableEnableCoupon = async (req, res, next) => {
  const { couponId } = req.params;
  const userId = req.user._id;
  const { isActive } = req.body;

  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    return next(new ErrorClass("Coupon not found", 404));
  }

  if (typeof isActive !== "boolean") {
    return next(new ErrorClass("Invalid enable status", 400));
  }
  const logUpdateObject = { updatedBy: userId, couponId, changes: {} };

  if (isActive) {
    coupon.isActive = true;
    logUpdateObject.changes.isActive = true;
  } else {
    coupon.isActive = false;
    logUpdateObject.changes.isActive = false;
  }
  await coupon.save();
  const logs = await CouponChangeLogs.create(logUpdateObject);

  return res
    .status(200)
    .json({ message: "Coupon status toggled successfully", coupon, logs });
};
