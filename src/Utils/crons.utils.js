import { scheduleJob } from "node-schedule";
import { Coupon } from "../../DB/Models/index.js";
import { DateTime } from "luxon";

export const cronJobOne = () => {
  scheduleJob("0 59 23 * * *", async () => {
    console.log("Cron Job To Disable Coupons ");

    const enabledCoupons = await Coupon.find({ isActive: true });

    console.log({
      tz: DateTime.fromJSDate(enabledCoupons[0].till),
    });

    if (enabledCoupons.length) {
      for (const coupon of enabledCoupons) {
        if (DateTime.now() > DateTime.fromJSDate(coupon.till)) {
          coupon.isActive = false;
          await coupon.save();
        }
      }
    }
  });
};
