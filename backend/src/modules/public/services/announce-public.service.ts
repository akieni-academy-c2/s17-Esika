import pool from "../../../config/database.ts";
import type {
	AnnounceResponse,
	GetAnnouncesParams,
	AnnounceDetail,
	Announce,
} from "../types/announce-public.type.ts";
import {
	selectAnnounces,
	countAnnounces,
	selectAnnounceById,
	selectLatestAnnounces,
} from "../queries/announce-public.query.ts";
import AppError from "../../../utils/app-error.ts";

const getAnnounces = async (
	params: GetAnnouncesParams,
): Promise<AnnounceResponse> => {
	const {
		page,
		limit,
		city,
		neighborhood,
		rent,
		totalEntry,
		type,
		furnished,
		airConditioning,
		wifi,
		generator,
		parking,
		securityGuard,
	} = params;

	const conditions: string[] = ["COALESCE(c.hidden, FALSE) = FALSE", "COALESCE(c.paused, FALSE) = FALSE", "a.status = 'available'"];
	const values: (string | number | boolean)[] = [];

	const addCondition = (
		condition: string,
		value: string | number | boolean,
	) => {
		values.push(value);
		conditions.push(condition.replace("?", `$${values.length}`));
	};

	if (city) {
		addCondition("a.city = ?", city);
	}

	if (neighborhood) {
		addCondition("a.neighborhood = ?", neighborhood);
	}

	if (rent !== undefined) {
		addCondition("a.rent = ?", rent);
	}

	if (totalEntry !== undefined) {
		addCondition("(a.rent * a.advance) + (a.rent * a.deposit) = ?", totalEntry);
	}

	if (type) {
		addCondition("a.type = ?", type);
	}

	if (furnished !== undefined) {
		addCondition("e.furnished = ?", furnished);
	}

	if (airConditioning !== undefined) {
		addCondition("e.air_conditioning = ?", airConditioning);
	}

	if (wifi !== undefined) {
		addCondition("e.wifi = ?", wifi);
	}

	if (generator !== undefined) {
		addCondition("e.generator = ?", generator);
	}

	if (parking !== undefined) {
		addCondition("e.parking = ?", parking);
	}

	if (securityGuard !== undefined) {
		addCondition("e.security_guard = ?", securityGuard);
	}

	const whereClause =
		conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";

	const offset = (page - 1) * limit;

	const query = `
        ${selectAnnounces}
        ${whereClause}
        ORDER BY a.created_at DESC
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
    `;

	const queryValues = [...values, limit, offset];

	const countQuery = `
        ${countAnnounces}
        ${whereClause}
    `;

	const [announcesResult, countResult] = await Promise.all([
		pool.query(query, queryValues),
		pool.query(countQuery, values),
	]);

	const total = Number(countResult.rows[0].count);

	return {
		data: announcesResult.rows.map((announce) => ({
			announceId: announce.announce_id,
			city: announce.city,
			image: announce.image,
			status: announce.effective_status ?? announce.status,
			rent: Number(announce.rent),
			type: announce.type,
			neighborhood: announce.neighborhood,
			landmark: announce.landmark,
			availableAt: announce.available_at,
			deposit: Number(announce.deposit),
			advance: Number(announce.advance),
			totalEntry: Number(announce.total_entry),
			equipment: announce.equipment,
			imageCount: Number(announce.image_count),
		})),
		pagination: {
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

const getAnnounceById = async (announceId: number): Promise<AnnounceDetail> => {
	const result = await pool.query(selectAnnounceById, [announceId]);

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
		announceId,
		city: announce.city,
		status: announce.effective_status ?? announce.status,
		neighborhood: announce.neighborhood,
		type: announce.type,
		availableAt: announce.available_at,
		updatedAt: announce.updated_at,
		landmark: announce.landmark,
		images: announce.images,
		equipment: announce.equipment,
		rent,
		caution,
		advance,
		description: announce.description,
		firstName: announce.first_name,
		lastName: announce.last_name,
		announceCount: Number(announce.announce_count),
		proprietaire: { firstName: announce.first_name, lastName: announce.last_name },
		favorTime: announce.favor_time,
		advanceAmount,
		cautionAmount,
		totalEntry,
	};
};

const getLastestAnnounce = async (): Promise<Announce[]> => {
	const results = await pool.query(`${selectLatestAnnounces} WHERE a.status = 'available' AND COALESCE(c.paused,FALSE) = FALSE AND COALESCE(c.hidden,FALSE) = FALSE ORDER BY a.created_at DESC LIMIT 4`);

	const announces = results.rows.map((announce) => ({
		announceId: announce.announce_id,
		city: announce.city,
		image: announce.image,
		status: announce.effective_status ?? announce.status,
		rent: Number(announce.rent),
		type: announce.type,
		neighborhood: announce.neighborhood,
		landmark: announce.landmark,
		availableAt: announce.available_at,
		deposit: Number(announce.deposit),
		advance: Number(announce.advance),
		totalEntry: Number(announce.total_entry),
		equipment: announce.equipment,
		imageCount: Number(announce.image_count),
	}));

    return announces;
};

export { getAnnounces, getAnnounceById, getLastestAnnounce };
