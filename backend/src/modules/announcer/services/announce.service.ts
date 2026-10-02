import pool from "../../../config/database.ts";
import supabase from "../../../config/supabase.ts";
import crypto from "node:crypto";
import { insertAnnounce } from "../queries/announce.query.ts";
import { insertImage } from "../queries/image.query.ts";
import type { CreateAnnounce } from "../types/announce.type.ts";

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

		return result.rows[0];
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

		for (const file of files) {
			const fileName = `${crypto.randomUUID()}-${file.originalname}`;
			const path = `${announce.announce_id}/${fileName}`;

			const { error } = await supabase.storage
				.from("announce")
				.upload(path, file.buffer, {
					contentType: file.mimetype,
					upsert: false,
				});

			if (error) {
				throw error;
			}

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

export { createAnnounce };
