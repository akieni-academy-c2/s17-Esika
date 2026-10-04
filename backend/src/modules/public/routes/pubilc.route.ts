import { Router } from "express";
import { displayAnnounces, detailAnnounceById } from "../controllers/announce-public.controller.ts";

const router = Router();

router.get('/announces', displayAnnounces);
router.get('/announces/:id', detailAnnounceById)

export default router