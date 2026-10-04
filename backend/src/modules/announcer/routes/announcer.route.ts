import { Router } from "express";
import upload from "../../../middleware/upload.middleware.ts";
import { authenticate } from "../../../middleware/auth.middleware.ts";
import {
	signUpAnnouncer,
	signInAnnouncer,
} from "../controllers/announcer.controller.ts";
import {
	sharedAnnounce,
	getMyAnnounces,
	updateStatusAnnonce,
} from "../controllers/announce.controller.ts";

const router = Router();

router.post("/signup", signUpAnnouncer);
router.post("/signin", signInAnnouncer);
router.post(
	"/announce",
	authenticate,
	upload.array("images", 6),
	sharedAnnounce,
);
router.get("/announces", authenticate, getMyAnnounces);
router.patch("/announces/:id/status", authenticate, updateStatusAnnonce);

export default router;
