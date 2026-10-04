import { Router } from "express";
import {
  addToCart,
  clearCartHandler,
  getCart,
  removeCartItemHandler,
  updateCartItemHandler
} from "../controllers/cartController.js";
import { authenticate } from "../middleware/authenticate.js";
import { cartItemSchema, updateCartItemSchema, validateBody } from "../utils/validators.js";

const router = Router();

router.use(authenticate);
router.get("/", getCart);
router.post("/", validateBody(cartItemSchema), addToCart);
router.put("/:itemId", validateBody(updateCartItemSchema), updateCartItemHandler);
router.delete("/:itemId", removeCartItemHandler);
router.delete("/", clearCartHandler);

export default router;
