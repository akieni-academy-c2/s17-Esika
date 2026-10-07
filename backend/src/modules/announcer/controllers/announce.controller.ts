import type { Request, Response } from "express";
import AppError from "../../../utils/app-error.ts";
import type { AnnounceStatus } from "../types/announce.type.ts";
import {
	createAnnounce,
	getAnnounces,
	modifyRentAnnonce,
	modifyStatusAnnonce,
} from "../services/announce.service.ts";
import type { City } from "../../../types/register.type.ts";
import pool from "../../../config/database.ts";

const sharedAnnounce = async (req: Request, res: Response) => {
	const data = req.body;

	const equipment = {
		airConditioning: data.airConditioning === "true",
		wifi: data.wifi === "true",
		generator: data.generator === "true",
		parking: data.parking === "true",
		furnished: data.furnished === "true",
		securityGuard: data.securityGuard === "true",
	};

	// Champs indispensables dans le parcours actuel.
	// sanitary, kitchen et favorTime ne sont pas encore demandés par l'interface ;
	// on leur applique donc une valeur neutre plutôt que de rejeter la publication.
	if (
		!String(data.type ?? "").trim() ||
		data.rent === undefined || data.rent === "" ||
		!String(data.city ?? "").trim() ||
		!String(data.neighborhood ?? "").trim() ||
		data.deposit === undefined || data.deposit === "" ||
		data.advance === undefined || data.advance === "" ||
		!String(data.landmark ?? "").trim()
	) {
		throw new AppError(400, "Champ(s) obligatoire(s) manquant(s)");
	}

	// Validation du prix
	const rent = Number(data.rent);

	if (isNaN(rent) || rent <= 0) {
		throw new AppError(400, "Le montant du loyer est invalide");
	}

	// Validation de la caution
	const deposit = Number(data.deposit);

	if (isNaN(deposit) || deposit < 0) {
		throw new AppError(400, "Le montant de la caution est invalide");
	}

	// Validation de l'avance
	const advance = Number(data.advance);

	if (isNaN(advance) || advance < 0) {
		throw new AppError(400, "Le montant de l'avance est invalide");
	}

	// Formatage et validation de la ville avant PostgreSQL.
	const cityValue = String(data.city).trim().toLowerCase();
	if (cityValue !== "brazzaville" && cityValue !== "pointe-noire") {
		throw new AppError(400, "Ville invalide");
	}
	const city = cityValue as City;

	// Récupération de l'annonceur connecté
	const announcerId = req.user!.userId;

	// Récupération des images
	const files = (req.files as Express.Multer.File[]) || [];

	let availableAt: Date | undefined;
	if (data.availableAt) {
		const parsedDate = new Date(data.availableAt);
		if (Number.isNaN(parsedDate.getTime())) {
			throw new AppError(400, "La date de disponibilité est invalide");
		}
		availableAt = parsedDate;
	}

	const sanitary = String(data.sanitary ?? "").trim() || "À préciser";
	const kitchen = String(data.kitchen ?? "").trim() || "À préciser";
	const favorTime = String(data.favorTime ?? "").trim() || "À préciser";

	// Création de l'annonce
	const created = await createAnnounce(
		{
			type: data.type,
			rent,
			city,
			neighborhood: data.neighborhood,
			deposit,
			advance,
			announcerId,
			description: data.description,
			availableAt,
			sanitary,
			kitchen,
			address: data.address,
			landmark: data.landmark,
			waterElectricity: data.waterElectricity,
			favorTime,
			equipment,
		},
		files,
	);

	res.status(201).json({
		message: "Annonce créée avec succès",
		status: 201,
		data: { id: created.id, announceId: created.announce_id },
	});
};

const getMyAnnounces = async (req: Request, res: Response) => {
	const announcerId = req.user!.userId;

	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;

	if (page < 1 || limit < 1) {
		throw new AppError(
			400,
			"Les paramètres page et limit doivent être supérieurs à 0",
		);
	}

	const status = req.query.status as AnnounceStatus | undefined;

	if (status !== undefined && status !== "available" && status !== "rented") {
		throw new AppError(400, "Le statut doit être available ou rented");
	}

	const result = await getAnnounces({
		announcerId,
		page,
		limit,
		status,
	});

	res.status(200).json({
		message: "Vos annonces ont été récupérées avec succès",
		status: 200,
		...result,
	});
};

const updateStatusAnnonce = async (req: Request, res: Response) => {
	const announceId = Number(req.params.id);
	const announcerId = req.user!.userId;
	const rawStatus = req.body.status ?? req.body.statut;

	if (!Number.isInteger(announceId) || announceId < 1) {
		throw new AppError(400, "L'identifiant de l'annonce est invalide");
	}

	const statusMap: Record<string, "available" | "rented"> = {
		available: "available", rented: "rented", disponible: "available", loue: "rented",
	};
	const status = statusMap[String(rawStatus ?? "")];
	if (!status) throw new AppError(400, "Statut invalide");

	const statusUpdated = await modifyStatusAnnonce(status, announceId, announcerId);
	await pool.query(`INSERT INTO announce_controls (announce_id, paused) VALUES ($1, FALSE) ON CONFLICT (announce_id) DO UPDATE SET paused = FALSE, updated_at = NOW()`, [announceId]);

	res.status(200).json({
		message: "Le statut de l'annonce a été mis à jour avec succès",
		status: 200,
		data: { status: statusUpdated, statut: statusUpdated === "rented" ? "loue" : "disponible" },
	});
};

const updateRentAnnonce = async (req: Request, res: Response) => {
	const announceId = Number(req.params.id);
	const announcerId = req.user!.userId;
	const rent = Number(req.body.rent);

	if (!Number.isInteger(announceId) || announceId < 1) {
		throw new AppError(400, "L'identifiant de l'annonce est invalide");
	}

	if (!Number.isInteger(rent) || rent < 1) {
        throw new AppError(400, "Le loyer doit être un nombre entier supérieur à 0");
    }

	const rentUpdated = await modifyRentAnnonce(
		rent,
		announceId,
		announcerId,
	);

	res.status(200).json({
		message: "Le loyer de l'annonce a été mis à jour avec succès",
		status: 200,
		data: rentUpdated,
	});
};

const updatePauseAnnonce = async (req: Request, res: Response) => {
	const announceId = Number(req.params.id);
	const announcerId = req.user!.userId;
	const paused = req.body.paused !== false;
	if (!Number.isInteger(announceId) || announceId < 1) throw new AppError(400, "L'identifiant de l'annonce est invalide");
	const result = await pool.query(`UPDATE announces SET updated_at = NOW() WHERE announce_id = $1 AND announcer_id = $2 RETURNING announce_id`, [announceId, announcerId]);
	if (result.rowCount === 0) throw new AppError(404, "Annonce introuvable");
	await pool.query(`INSERT INTO announce_controls (announce_id, paused) VALUES ($1, $2) ON CONFLICT (announce_id) DO UPDATE SET paused = EXCLUDED.paused, updated_at = NOW()`, [announceId, paused]);
	res.status(200).json({ message: paused ? "Annonce mise en pause" : "Annonce remise en ligne", status: 200, data: { paused } });
};

export { sharedAnnounce, getMyAnnounces, updateStatusAnnonce, updateRentAnnonce, updatePauseAnnonce };
