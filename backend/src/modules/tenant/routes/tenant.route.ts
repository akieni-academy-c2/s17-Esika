import { Router } from "express";
import { signUpTenant, signInTenant } from "../controllers/tenant.controller.ts";
import { buyPass } from "../controllers/pass.controller.ts";
import { authenticate } from "../../../middleware/auth.middleware.ts";

const router = Router();

router.post("/signup", signUpTenant);
router.post("/signin", signInTenant);

router.post("/announces/:id/passes", authenticate, buyPass);

export default router;