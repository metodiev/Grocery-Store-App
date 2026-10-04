import { Router } from "express";
import {
  createOrderHandler,
  getOrderByIdHandler,
  getOrdersHandler,
  updateOrderStatusHandler
} from "../controllers/orderController.js";
import { authenticate, authorize } from "../middleware/authenticate.js";
import { checkoutSchema, updateOrderStatusSchema, validateBody } from "../utils/validators.js";

const router = Router();

router.use(authenticate);
router.post("/", validateBody(checkoutSchema), createOrderHandler);
router.get("/", getOrdersHandler);
router.get("/:id", getOrderByIdHandler);
router.put("/:id/status", authorize("ADMIN"), validateBody(updateOrderStatusSchema), updateOrderStatusHandler);

export default router;
