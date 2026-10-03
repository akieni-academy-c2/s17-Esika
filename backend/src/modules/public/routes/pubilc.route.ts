import { Router } from "express";
import { displayAnnounces } from "../controllers/announce-public.controller.ts";

const router = Router();

router.get('/announces', displayAnnounces);

export default router