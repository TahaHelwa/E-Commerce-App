import { Schema, model } from "mongoose";
import mongoose from "../global-setup.js";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    userType: {
      type: String,
      required: true,
      enum: ["Buyer", "Admin"],
      default: "Buyer",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isMarkedAsDeleted: {
      type: Boolean,
      default: false,
    },
    addressId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Address",
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.models.User || model("User", userSchema);
