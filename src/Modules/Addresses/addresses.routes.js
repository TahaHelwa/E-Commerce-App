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
addressRouter.get(
  "/addresses",
  middleware.authenticate,
  middleware.errorHandler(addressControllers.getAddresses)
);

addressRouter.put(
  "/addresses/:addressId",
  middleware.authenticate,
  middleware.errorHandler(addressControllers.updateAddress)
);

addressRouter.delete(
  "/addresses/:addressId",
  middleware.authenticate,
  middleware.errorHandler(addressControllers.deleteAddress)
);

export { addressRouter };
