import pool from "../../../config/database.ts";
import { insertPass, selectPassInfo } from "../queries/pass.query.ts";
import type { CreatePass, PassInfo } from "../types/pass.type.ts";
import AppError from "../../../utils/app-error.ts";

const createPass = async ({
	announceId,
	tenantId,
}: CreatePass): Promise<void> => {
	await pool.query(insertPass, [announceId, tenantId]);
};

const passInfo = async (
	announceId: number,
	tenantId: number,
): Promise<PassInfo> => {
	const result = await pool.query(selectPassInfo, [announceId, tenantId]);

	if (result.rows.length === 0) {
		throw new AppError(404, "Aucun pass trouvé pour cette annonce");
	}

	const pass = result.rows[0];

	if (!pass.is_active) {
		throw new AppError(403, "Le pass a expiré");
	}

	return {
		expiredAt: pass.expired_at,
		announcer: {
			firstName: pass.first_name,
			lastName: pass.last_name,
			phoneNumber: pass.phone_number,
		},
		announce: {
			type: pass.type,
			neighborhood: pass.neighborhood,
			rent: Number(pass.rent),
			landmark: pass.landmark,
		},
	};
};

export { createPass, passInfo };
