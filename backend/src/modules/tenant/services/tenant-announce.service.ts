import pool from "../../../config/database.ts";
import { selectAnnounceContact } from "../queries/tenant-announce.query.ts";
import type { UnlockPage } from "../types/tenant-announce.type.ts";
import AppError from "../../../utils/app-error.ts";

const announceContact = async (announceId: number, tenantId: number): Promise<UnlockPage> => {
  const pass = await pool.query(
    `SELECT 1 FROM passes WHERE announce_id = $1 AND tenant_id = $2 AND expired_at > NOW() LIMIT 1`,
    [announceId, tenantId],
  );
  if (pass.rows.length === 0) throw new AppError(403, "Un Pass Contact actif est requis");

  const result = await pool.query(selectAnnounceContact, [announceId]);

	if (result.rows.length === 0) {
		throw new AppError(404, "Annonce introuvable");
	}

	const announce = result.rows[0];

	const rent = Number(announce.rent);
	const advance = Number(announce.advance);
	const caution = Number(announce.deposit);

	const advanceAmount = rent * advance;
	const cautionAmount = rent * caution;
	const totalEntry = advanceAmount + cautionAmount;

	return {
		type: announce.type,
		neighborhood: announce.neighborhood,
		landmark: announce.landmark,
		city: announce.city,
		rent,
		totalEntry,
		image: announce.image,
	};
};

export { announceContact };
