import { Router } from "express";
import {
  login,
  loginPage,
  logout,
  register,
  registerPage,
} from "../controllers/auth.js";

const authRouter = Router();

// Page routes
authRouter.get("/register", registerPage);
authRouter.post("/register", register);
authRouter.get("/login", loginPage);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;
