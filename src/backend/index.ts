import { createRouter } from "@varasto/express-crud";
import express from "express";
import {
  authRouter,
  requireAdmin,
  requireAuth,
} from "express-varasto-jwt-auth";
import morgan from "morgan";

import usersRouter from "./routes/users.js";
import { entrySchema } from "./schema.js";
import { storage } from "./storage.js";

const app = express();

// Only setup logging when not running test cases.
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

app.use(express.json());

// Ensure JSON body is always an object before the auth router reads it.
app.use("/api/auth", (req, _res, next) => {
  req.body ??= {};
  next();
});
app.use("/api/auth", authRouter(storage));
app.use("/api/users", requireAuth, requireAdmin, usersRouter);
app.use(
  "/api",
  requireAuth,
  createRouter(storage, "entries", { schema: entrySchema }),
);

export default app;
