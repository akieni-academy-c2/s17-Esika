import { Router } from "express";
import { signInAdmin } from "../controllers/admin.controller.ts";
import { getReportsController as getReports, updateReportStatusController as updateReportStatus } from "../controllers/admin-report.controller.ts";
import { authenticate } from "../../../middleware/auth.middleware.ts";

const router = Router();

router.post('/signin', signInAdmin);
router.get("/reports", authenticate, getReports);
router.patch("/reports/:id/status", authenticate, updateReportStatus)

export default router