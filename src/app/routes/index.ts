import { Router } from "express";

import AuthController from "../controllers/user.controller";

import auth from "../middleware/auth.middleware";

const { register, login, getProfile, updateProfile, deleteAccount } =
  AuthController;

const router = Router();

router.post("/auth/register", register);

router.post("/auth/login", login);

router.get("/user", auth, getProfile);

router.patch("/user", auth, updateProfile);

router.delete("/user", auth, deleteAccount);

export default router;
