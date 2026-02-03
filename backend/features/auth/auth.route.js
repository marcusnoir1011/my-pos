import { Router } from "express";

import authMiddleware from "./auth.middleware";
import authController from "./auth.controller";
import authService from "./auth.service";
import validator from "./auth.validator";

const router = Router();

// Public
router.post("/register", validator, authController.register);
router.post("/login", validator, authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authMiddleware.protect, authController.logout);

// Protected

export default router;
