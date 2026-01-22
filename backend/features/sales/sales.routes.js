import { Router } from "express";

import salesController from "./sales.controller";
import { validator } from "./sales.validator";

const router = Router();

router.post(
  "/sales",
  validator,
  salesController.createSale.bind(salesController),
);

export default router;
