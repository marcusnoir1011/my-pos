import { Router } from "express";

import authMiddleware from "./auth.middleware";

const router = Router();

router.get("/register");
router.get("/login");
router.get("/refresh");

export default router;
