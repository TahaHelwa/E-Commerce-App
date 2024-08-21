import * as middleware from "../../middlewares/index.js";
import Router from "express";

import * as addressControllers from "./addresses.controller.js";

const addressRouter = Router();

// routes
addressRouter.post(
  "/addAddress",
  middleware.authenticate,
  middleware.errorHandler(addressControllers.addAddress)
);

export { addressRouter };
