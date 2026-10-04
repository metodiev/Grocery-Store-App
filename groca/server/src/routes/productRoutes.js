import { Router } from "express";
import {
  createProductHandler,
  deleteProductHandler,
  getProduct,
  listProducts,
  updateProductHandler
} from "../controllers/productController.js";
import { authenticate, authorize } from "../middleware/authenticate.js";
import { productSchema, validateBody } from "../utils/validators.js";

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", authenticate, authorize("ADMIN"), validateBody(productSchema), createProductHandler);
router.put("/:id", authenticate, authorize("ADMIN"), validateBody(productSchema.partial()), updateProductHandler);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteProductHandler);

export default router;
