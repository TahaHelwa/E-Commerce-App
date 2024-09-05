import joi from "joi";
import { CouponTypes, generalRules } from "../../Utils/enums.utils.js";

export const couponSchema = {
  body: joi.object({
    couponCode: joi.string().required(),
    from: joi.date().greater(Date.now()).required(),
    till: joi.date().greater(joi.ref("from")).required(),
    couponAmount: joi
      .number()
      .when("couponType", {
        is: joi.string().valid(CouponTypes.PERCENTAGE),
        then: joi.number().max(100).required(),
      })
      .min(1)
      .required()
      .messages({
        "number.min": "coupon amount must be greater than 0",
        "number.max": "coupon amount must be less than or equal to 100",
      }),
    couponType: joi
      .string()
      .valid(...Object.values(CouponTypes))
      .required(),
    Users: joi
      .array()
      .items(
        joi.object({
          userId: generalRules._id.required(),
          maxCount: joi.number().integer().min(1).required(),
        })
      )
      .required(),
  }),
};

export const updateCouponSchema = {
  // update all the same way couponSchema

  body: joi.object({
    // same as couponSchema but not required  => obtion is optional
    couponCode: joi.string(),
    from: joi.date().greater(Date.now()),
    till: joi.date().greater(joi.ref("from")),
    couponAmount: joi
      .number()
      .when("couponType", {
        is: joi.string().valid(CouponTypes.PERCENTAGE),
        then: joi.number().max(100),
      })
      .min(1),
    couponType: joi.string().valid(...Object.values(CouponTypes)),
    Users: joi.array().items(
      joi.object({
        userId: generalRules._id,
        maxCount: joi.number().integer().min(1),
      })
    ),
  }),
};
