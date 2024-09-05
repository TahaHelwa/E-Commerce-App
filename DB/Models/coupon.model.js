// coupon model
import mongoose from "../global-setup.js";
import { CouponTypes } from "../../src/Utils/enums.utils.js";

const { Schema, model } = mongoose;

const couponSchema = new Schema(
  {
    couponCode: {
      type: String,
      required: true,
      unique: true,
    },
    couponAmount: {
      type: Number,
      required: true,
    },
    couponType: {
      type: String,
      required: true,
      enum: Object.values(CouponTypes),
    },
    from: {
      type: Date,
      required: true,
    },
    till: {
      type: Date,
      required: true,
    },
    Users: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        maxCount: {
          type: Number,
          required: true,
          min: 1,
        },
        usageCount: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
export const Coupon = mongoose.models.Coupon || model("Coupon", couponSchema);

// create coupon change log model
// couponId , updatedBy , changes:{}

const couponChangeLogsSchema = new Schema(
  {
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    changes: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export const CouponChangeLogs =
  mongoose.models.couponChangeLogs ||
  model("couponChangeLogs", couponChangeLogsSchema);
