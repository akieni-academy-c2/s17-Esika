import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware.ts";
import { authorize } from "../../../middleware/authorize.middleware.ts";
import pool from "../../../config/database.ts";
import AppError from "../../../utils/app-error.ts";

const router = Router();

// v4 compatibility: decision-based admin action, while Virgil's /status route remains intact.
router.patch("/reports/:id", authenticate, authorize("admin"), async (req, res) => {
  const id = Number(req.params.id);
  const decision = req.body?.decision;
  if (!Number.isInteger(id) || id < 1) throw new AppError(400, "Identifiant de signalement invalide");
  const found = await pool.query(`SELECT announce_id FROM reports WHERE id = $1`, [id]);
  if (!found.rows.length) throw new AppError(404, "Signalement introuvable");

  if (decision === "masquer") {
    await pool.query(`INSERT INTO announce_controls (announce_id, hidden) VALUES ($1, TRUE) ON CONFLICT (announce_id) DO UPDATE SET hidden = TRUE, updated_at = NOW()`, [found.rows[0].announce_id]);
  }

  const status = decision === "en_cours" || decision === "contact" ? "in_progress" : "processed";
  const action = ["masquer", "contact", "sans_suite"].includes(decision) ? decision : null;
  await pool.query(`UPDATE reports SET status = $2::report_status, handled_action = COALESCE($3, handled_action), updated_at = NOW(), handled_at = CASE WHEN $2::report_status = 'processed' THEN NOW() ELSE handled_at END WHERE id = $1`, [id, status, action]);
  res.status(200).json({ message: "Signalement traité", status: 200, data: { id, decision, status } });
});

export default router;
