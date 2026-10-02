import { Router } from "express";
import { signUpAnnouncer, signInAnnouncer } from "../controllers/announcer.controller.ts";

const router = Router();

router.post("/signup", signUpAnnouncer);
router.post("/signin", signInAnnouncer);

export default router;