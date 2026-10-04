import { Router } from "express";
import { getAdminDashboardStats, getUsersHandler } from "../controllers/adminController.js";
import { authenticate, authorize } from "../middleware/authenticate.js";

const router = Router();

router.use(authenticate, authorize("ADMIN"));
router.get("/stats", getAdminDashboardStats);
router.get("/users", getUsersHandler);

export default router;
