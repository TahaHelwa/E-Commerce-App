import express from "express";
import { config } from "dotenv";
import { routerHandler } from "./router-handler.js";
// Importing required modules and files
import db_connection from "./DB/connection.js";
import { cronJobOne } from "./src/Utils/crons.utils.js";

export const main = () => {
  config();

  const app = express();
  const port = process.env.PORT || 5000;

  // router handler
  routerHandler(app);

  db_connection();

  // crons
  cronJobOne();
  // gracefulShutdown();

  app.get("/", (req, res) => res.send("Hello World!"));

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
};
