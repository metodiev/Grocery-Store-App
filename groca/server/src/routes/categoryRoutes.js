import { Router } from "express";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategory,
  listCategories,
  updateCategoryHandler
} from "../controllers/categoryController.js";
import { authenticate, authorize } from "../middleware/authenticate.js";
import { categorySchema, validateBody } from "../utils/validators.js";

const router = Router();

router.get("/", listCategories);
router.get("/:id", getCategory);
router.post("/", authenticate, authorize("ADMIN"), validateBody(categorySchema), createCategoryHandler);
router.put("/:id", authenticate, authorize("ADMIN"), validateBody(categorySchema.partial()), updateCategoryHandler);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteCategoryHandler);

export default router;
