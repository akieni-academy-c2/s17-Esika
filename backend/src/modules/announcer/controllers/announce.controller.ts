import type { Request, Response } from "express";
import AppError from "../../../utils/app-error.ts";
import type { CreateAnnounce } from "../types/announce.type.ts";
import { createAnnounce } from "../services/announce.service.ts";
import type { City } from "../../../types/register.type.ts";

const sharedAnnounce = async (req: Request, res: Response) => {
	const data: CreateAnnounce = req.body;

	// Champs obligatoires
	if (
		!data.type ||
		!data.rent ||
		!data.city ||
		!data.neighborhood ||
		!data.deposit ||
		!data.advance ||
		!data.sanitary ||
		!data.kitchen ||
		!data.landmark ||
		!data.favorTime
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

	// Formatage de la ville
	const city = data.city.toLowerCase() as City;

	// Récupération de l'annonceur connecté
	const announcerId = req.user!.userId;

	// Récupération des images
	const files = (req.files as Express.Multer.File[]) || [];

	const availableAt = data.availableAt ? new Date(data.availableAt) : undefined;

	// Création de l'annonce
	await createAnnounce(
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
			sanitary: data.sanitary,
			kitchen: data.kitchen,
			address: data.address,
			landmark: data.landmark,
			waterElectricity: data.waterElectricity,
			favorTime: data.favorTime,
		},
		files,
	);

	res.status(201).json({
		message: "Annonce créée avec succès",
		status: 201,
	});
};

export { sharedAnnounce };
