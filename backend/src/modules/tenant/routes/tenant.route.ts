import { Router } from "express";
import { signUpTenant } from "../controllers/tenant.controller.ts";

const router = Router();

router.post("/signup", signUpTenant);

export default router;