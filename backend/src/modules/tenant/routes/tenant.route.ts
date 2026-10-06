import { Router } from "express";
import {
	signUpTenant,
	signInTenant,
} from "../controllers/tenant.controller.ts";
import { announceContactController as announceContact } from "../controllers/tenant-announce.controller.ts";
import { authenticate } from "../../../middleware/auth.middleware.ts";

const router = Router();

router.post("/signup", signUpTenant);
router.post("/signin", signInTenant);
router.get("/announces/:id/contact", authenticate, announceContact);

export default router;
