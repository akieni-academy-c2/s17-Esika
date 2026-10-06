import { Router } from "express";
import { signInAdmin } from "../controllers/admin.controller.ts";
import { getReportsController as getReports } from "../controllers/admin-report.controller.ts";
import { authenticate } from "../../../middleware/auth.middleware.ts";

const router = Router();

router.post('/signin', signInAdmin);
router.get("/reports", authenticate, getReports);

export default router