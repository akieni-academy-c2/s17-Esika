import { Router } from "express";
import {
	signUpTenant,
	signInTenant,
} from "../controllers/tenant.controller.ts";
import { announceContactController as announceContact } from "../controllers/tenant-announce.controller.ts";
import { buyPass, passInfoController as passInfo } from "../controllers/pass.controller.ts";
import { authenticate } from "../../../middleware/auth.middleware.ts";
import { authorize } from "../../../middleware/authorize.middleware.ts";
import { createReportController as createReport } from "../controllers/report.controller.ts";

const router = Router();

router.post("/signup", signUpTenant);

router.post("/signin", signInTenant);

router.get("/announces/:id/passes/active", authenticate, authorize("tenant"), passInfo);
router.post("/announces/:id/passes", authenticate, authorize("tenant"), buyPass);

router.get("/announces/:id/contact", authenticate, authorize("tenant"), announceContact);

router.post("/announces/:id/reports", authenticate, authorize("tenant"), createReport)

export default router;
