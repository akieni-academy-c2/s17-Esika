import pool from "../../../config/database.ts";
import { insertReport } from "../queries/report.query.ts";
import type { CreateReport } from "../types/report.type.ts";

const createReport = async ({
	announceId,
	tenantId,
	reason,
	description,
}: CreateReport): Promise<void> => {
	await pool.query(insertReport, [reason, announceId, tenantId, description]);
};

export { createReport };
