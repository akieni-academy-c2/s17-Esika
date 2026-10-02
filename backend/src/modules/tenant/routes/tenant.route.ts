import { Router } from "express";
import { signUpTenant, signInTenant } from "../controllers/tenant.controller.ts";

const router = Router();

router.post("/signup", signUpTenant);
router.post("/signin", signInTenant);

export default router;