import pool from "../../../config/database.ts";
import { insertPass, selectPassInfo } from "../queries/pass.query.ts";
import type { CreatePass, PassInfo } from "../types/pass.type.ts";
import AppError from "../../../utils/app-error.ts";

const createPass = async ({
  announceId,
  tenantId,
}: CreatePass) => {
  const announcement = await pool.query(
    `SELECT a.announce_id
       FROM announces a
       LEFT JOIN announce_controls c ON c.announce_id = a.announce_id
      WHERE a.announce_id = $1
        AND a.status = 'available'
        AND COALESCE(c.paused, FALSE) = FALSE
        AND COALESCE(c.hidden, FALSE) = FALSE
      LIMIT 1`,
    [announceId],
  );
  if (announcement.rows.length === 0) throw new AppError(404, "Annonce indisponible ou introuvable");

  const active = await pool.query(
    `SELECT expired_at FROM passes WHERE announce_id = $1 AND tenant_id = $2 AND expired_at > NOW() ORDER BY expired_at DESC LIMIT 1`,
    [announceId, tenantId],
  );
  if (active.rows.length) return { expiredAt: active.rows[0].expired_at };

  const result = await pool.query(insertPass, [announceId, tenantId]);
  return { expiredAt: result.rows[0]?.expired_at ?? null };
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
