import { orderStatus, paymentMethods } from "../../src/Utils/index.js";

import mongoose from "../global-setup.js";

const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromCart: {
      type: Boolean,
      default: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    address: String,
    addressId: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
    contactNumber: {
      type: String,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    VAT: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    couponId: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: Object.values(paymentMethods),
    },
    orderStatus: {
      type: String,
      required: true,
      enum: Object.values(orderStatus),
    },
    deliveredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    deliveredAt: Date,
    createdAt: Date,
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || model("Order", orderSchema);
