import express from "express";
import cors from "cors";
import { globaleResponse } from "./src/middlewares/index.js";
import * as router from "./src/Modules/index.js";

export const routerHandler = (app) => {
  app.use(express.json());

  app.use("/categories", router.categoryRouter);
  app.use("/sub-categories", router.subCategoryRouter);
  app.use("/brands", router.brandRouter);
  app.use("/products", router.productRouter);
  app.use("/users", router.userRouter);
  app.use("/users", router.addressRouter);
  app.use("/carts", router.cartRouter);
  app.use("/coupons", router.couponRouter);

  app.use("*", (req, res) => {
    res.status(404).json({ message: "Page Not found" });
  });
  // Error handling middleware
  app.use(globaleResponse);
};
