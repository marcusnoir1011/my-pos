import { Router } from "express";

import { validator } from "./products.validator";
import productsController from "./products.controller";

const router = Router();

router.post(
  "/",
  validator(false),
  productsController.createProduct.bind(productsController),
);
router.put(
  "/:id",
  validator(true),
  productsController.updateProduct.bind(productsController),
);
router.get("/", productsController.getProducts.bind(productsController));
router.get("/:id", productsController.getProductById.bind(productsController));
router.patch(
  "/:id",
  productsController.deactivateProduct.bind(productsController),
);

export default router;
