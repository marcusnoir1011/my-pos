import { Router } from "express";

import authMiddleware from "./auth.middleware";
import authController from "./auth.controller";
import authService from "./auth.service";

const router = Router();

// Public
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

// Protected

export default router;
