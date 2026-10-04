import { Router } from "express";
import {
  addAddressHandler,
  changePasswordHandler,
  getProfileHandler,
  removeAddressHandler,
  updateProfileHandler
} from "../controllers/userController.js";
import { authenticate } from "../middleware/authenticate.js";
import {
  addAddressSchema,
  changePasswordSchema,
  updateProfileSchema,
  validateBody
} from "../utils/validators.js";

const router = Router();

router.use(authenticate);
router.get("/me", getProfileHandler);
router.put("/me", validateBody(updateProfileSchema), updateProfileHandler);
router.put("/me/password", validateBody(changePasswordSchema), changePasswordHandler);
router.post("/me/addresses", validateBody(addAddressSchema), addAddressHandler);
router.delete("/me/addresses/:addressId", removeAddressHandler);

export default router;
