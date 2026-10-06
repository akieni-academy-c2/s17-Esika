import { Router } from "express";
import { signInAdmin } from "../controllers/admin.controller.ts";

const router = Router();

router.post('/signin', signInAdmin);

export default router