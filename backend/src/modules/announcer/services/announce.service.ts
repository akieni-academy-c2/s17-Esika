import pool from "../../../config/database.ts";
import supabase from "../../../config/supabase.ts";
import crypto from "node:crypto";
import {
	insertAnnounce,
	selectAnnounces,
	countAnnounces,
	updatedSatusAnnounce,
	updatedRentAnnounce,
} from "../queries/announce.query.ts";
import { insertImage } from "../queries/image.query.ts";
import type {
	CreateAnnounce,
	AnnounceResponse,
	GetAnnouncesParams,
	AnnounceStatus
} from "../types/announce.type.ts";
import { insertEquipment } from "../queries/equipment.query.ts";
import AppError from "../../../utils/app-error.ts";

const createAnnounce = async (
	data: CreateAnnounce,
	files: Express.Multer.File[],
) => {
	if (files.length === 0) {
		const result = await pool.query(insertAnnounce, [
			data.type,
			data.rent,
			data.city,
			data.neighborhood,
			data.deposit,
			data.advance,
			data.announcerId,
			data.description,
			data.availableAt,
			data.sanitary,
			data.kitchen,
			data.address,
			data.landmark,
			data.waterElectricity,
			data.favorTime,
		]);

		const announce = result.rows[0];

		await pool.query(insertEquipment, [
			data.equipment.airConditioning,
			data.equipment.wifi,
			data.equipment.generator,
			data.equipment.parking,
			data.equipment.furnished,
			data.equipment.securityGuard,
			announce.announce_id,
		]);
	}

	const client = await pool.connect();

	const uploadedFiles: string[] = [];

	try {
		await client.query("BEGIN");

		const result = await client.query(insertAnnounce, [
			data.type,
			data.rent,
			data.city,
			data.neighborhood,
			data.deposit,
			data.advance,
			data.announcerId,
			data.description,
			data.availableAt,
			data.sanitary,
			data.kitchen,
			data.address,
			data.landmark,
			data.waterElectricity,
			data.favorTime,
		]);

		const announce = result.rows[0];

		await client.query(insertEquipment, [
			data.equipment.airConditioning,
			data.equipment.wifi,
			data.equipment.generator,
			data.equipment.parking,
			data.equipment.furnished,
			data.equipment.securityGuard,
			announce.announce_id,
		]);

		for (const file of files) {
			// Normaliser le nom d'un fichier
			const safeName = file.originalname
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "")
				.replace(/[^a-zA-Z0-9._-]/g, "_");

			const fileName = `${crypto.randomUUID()}-${safeName}`;
			const storagePath = `${announce.announce_id}/${fileName}`;

			const { error } = await supabase.storage
				.from("announce")
				.upload(storagePath, file.buffer, {
					contentType: file.mimetype,
					upsert: false,
				});

			if (error) {
				throw error;
			}

			const { data } = supabase.storage
				.from("announce")
				.getPublicUrl(storagePath);

			const path = data.publicUrl;

			uploadedFiles.push(path);
		}

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const path = uploadedFiles[i];

			await client.query(insertImage, [
				file.mimetype,
				file.originalname,
				path,
				announce.announce_id,
			]);
		}

		await client.query("COMMIT");

		return announce;
	} catch (error) {
		await client.query("ROLLBACK");

		if (uploadedFiles.length > 0) {
			await supabase.storage.from("announce").remove(uploadedFiles);
		}
		throw error;
	} finally {
		client.release();
	}
};

const getAnnounces = async (
	params: GetAnnouncesParams,
): Promise<AnnounceResponse> => {
	const { announcerId, page, limit, status } = params;

	const conditions: string[] = [];
	const values: (number | string)[] = [];

	const addCondition = (condition: string, value: number | string) => {
		values.push(value);

		conditions.push(condition.replace("?", `$${values.length}`));
	};

	addCondition("a.announcer_id = ?", announcerId);

	if (status) {
		addCondition("a.status = ?", status);
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
        data: announcesResult.rows.map((announce) =>({
            announceId: announce.announce_id,
            image: announce.image,
            type: announce.type,
            neighborhood: announce.neighborhood,
            city: announce.city,
            createdAt: announce.created_at,
            rent: Number(announce.rent),
            total: Number(announce.total),
            status: announce.status,
            updatedAt: announce.updated_at,
        })),
        pagination: {
            total,
            totalPages: Math.ceil(total/limit)
        },
    };
};

const modifyStatusAnnonce = async(status: AnnounceStatus, announceId: number, announcerId: number):Promise<AnnounceStatus> => {
	const result = await pool.query(updatedSatusAnnounce, [status, announceId, announcerId]);

	if (result.rows.length === 0) {
        throw new AppError(404, "Annonce introuvable");
    }

	const statusUpdated = result.rows[0].status as AnnounceStatus

	return statusUpdated;
}

const modifyRentAnnonce = async(rent: number, announceId: number, announcerId: number):Promise<AnnounceStatus> => {
	const result = await pool.query(updatedRentAnnounce, [rent, announceId, announcerId]);

	if (result.rows.length === 0) {
        throw new AppError(404, "Annonce introuvable");
    }

	const rentUpdated = result.rows[0].rent

	return rentUpdated;
}

export { createAnnounce, getAnnounces, modifyStatusAnnonce, modifyRentAnnonce };
