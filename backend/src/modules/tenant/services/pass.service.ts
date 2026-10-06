import pool from "../../../config/database.ts";
import { insertPass } from "../queries/pass.query.ts";
import type { CreatePass } from "../types/pass.type.ts";

const createPass = async ({
	announceId,
	tenantId,
}: CreatePass): Promise<void> => {
	await pool.query(insertPass, [announceId, tenantId]);
};

export { createPass };
