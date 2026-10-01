import { Router } from "express";
import { signUpAnnoncer } from "../controllers/announcer.controller.ts";

const router = Router();

router.post("/signup", signUpAnnoncer);

export default router;