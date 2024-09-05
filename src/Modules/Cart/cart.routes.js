import { Router } from "express";
//controller
import * as cartController from "./cart.controller.js";
//middleware
import * as middleware from "../../middlewares/index.js";

const cartRouter = Router();

cartRouter.post(
  "/create/:productId",
  middleware.authenticate,
  cartController.createCart
);

cartRouter.get("/", middleware.authenticate, cartController.getCart);
cartRouter.put(
  "/remove/:productId",
  middleware.authenticate,
  cartController.removeFromTheCart
);
cartRouter.put(
  "/update/:productId",
  middleware.authenticate,
  cartController.updateCart
);

export { cartRouter };
