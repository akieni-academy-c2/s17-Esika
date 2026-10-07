import { Router } from "express";
import upload from "../../../middleware/upload.middleware.ts";
import { authenticate } from "../../../middleware/auth.middleware.ts";
import { authorize } from "../../../middleware/authorize.middleware.ts";
import {
	signUpAnnouncer,
	signInAnnouncer,
} from "../controllers/announcer.controller.ts";
import {
	sharedAnnounce,
	getMyAnnounces,
	updateStatusAnnonce,
	updateRentAnnonce,
	updatePauseAnnonce,
} from "../controllers/announce.controller.ts";

const router = Router();

router.post("/signup", signUpAnnouncer);
router.post("/signin", signInAnnouncer);
router.post(
	"/announce",
	authenticate,
	authorize("announcer"),
	upload.array("images", 6),
	sharedAnnounce,
);
router.get("/announces", authenticate, authorize("announcer"), getMyAnnounces);
router.patch("/announces/:id/status", authenticate, authorize("announcer"), updateStatusAnnonce);
router.patch("/announces/:id/rent", authenticate, authorize("announcer"), updateRentAnnonce);
router.patch("/announces/:id/pause", authenticate, authorize("announcer"), updatePauseAnnonce);

export default router;
