import pool from "../../../config/database.ts";
import { insertReport } from "../queries/report.query.ts";
import type { CreateReport } from "../types/report.type.ts";
import AppError from "../../../utils/app-error.ts";

const createReport = async ({ announceId, tenantId, reason, description }: CreateReport): Promise<void> => {
  const announcement = await pool.query(`SELECT announce_id FROM announces WHERE announce_id = $1 LIMIT 1`, [announceId]);
  if (!announcement.rows.length) throw new AppError(404, "Annonce introuvable");
  const existing = await pool.query(`SELECT id FROM reports WHERE announce_id = $1 AND tenant_id = $2 LIMIT 1`, [announceId, tenantId]);
  if (existing.rows.length) throw new AppError(409, "Vous avez déjà signalé cette annonce");
  await pool.query(insertReport, [reason, announceId, tenantId, description]);
};

export { createReport };
