import { Router } from "express";
import { displayAnnounces, detailAnnounceById, displayLatestAnnounces } from "../controllers/announce-public.controller.ts";

const router = Router();

router.get('/announces', displayAnnounces);
router.get('/lastest-announces', displayLatestAnnounces);
router.get('/latest-announces', displayLatestAnnounces)
router.get('/announces/latest', displayLatestAnnounces)
router.get('/announces/:id', detailAnnounceById);

export default router