import { Router } from "express";
import { signInAdmin } from "../controllers/admin.controller.ts";
import { getReportsController as getReports, updateReportStatusController as updateReportStatus } from "../controllers/admin-report.controller.ts";
import { authenticate } from "../../../middleware/auth.middleware.ts";
import { authorize } from "../../../middleware/authorize.middleware.ts";

const router = Router();

router.post('/signin', signInAdmin);
router.get("/reports", authenticate, authorize("admin"), getReports);
router.patch("/reports/:id/status", authenticate, authorize("admin"), updateReportStatus)

export default router