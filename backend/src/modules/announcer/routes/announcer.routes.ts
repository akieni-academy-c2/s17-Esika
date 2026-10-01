import { Router } from "express";
import { signUpAnnouncer } from "../controllers/announcer.controller.ts";

const router = Router();

router.post("/signup", signUpAnnouncer);

export default router;