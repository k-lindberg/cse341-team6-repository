import { Router } from "express";
import {
  listUsers,
  updateUser,
  deleteUser,
} from "../controllers/users.js";
import { requirePageLogin, requireApiLogin } from "../middleware/auth.js";

const usersRouter = Router();

// Protected users page
usersRouter.get("/", requirePageLogin, (req, res) => {
  res.render("users", { title: "User Management" });
});

// Protected users API
usersRouter.get("/api", requireApiLogin, listUsers);
usersRouter.put("/api/:id", requireApiLogin, updateUser);
usersRouter.delete("/api/:id", requireApiLogin, deleteUser);

export default usersRouter;