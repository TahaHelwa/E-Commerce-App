import { Router } from "express";
// controllers
import * as orderController from "./order.controller.js";
// middleware
import * as Middlewares from "../../middlewares/index.js";
// utils
import { extensions } from "../../Utils/index.js";
// models
import { order } from "../../../DB/Models/index.js";

const orderRouter = Router();
