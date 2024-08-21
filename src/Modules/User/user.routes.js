import { Router } from "express";
//controller
import * as userController from "./user.controller.js";
//middleware
import * as middleware from "../../middlewares/index.js";

const userRouter = Router();

userRouter.post(
  "/register",
  middleware.errorHandler(userController.registerUser)
);
userRouter.post("/login", middleware.errorHandler(userController.loginUser));
userRouter.get(
  "/profile",
  middleware.authenticate,
  middleware.errorHandler(userController.getUserProfile)
);
userRouter.put(
  "/update",
  middleware.authenticate,
  middleware.errorHandler(userController.updateUserProfile)
);
userRouter.delete(
  "/delete",
  middleware.authenticate,
  middleware.errorHandler(userController.deleteUserProfile)
);

export { userRouter };
