import type { Request, Response } from "express";
import AppError from "../../../utils/app-error.ts";
import type { AnnounceStatus } from "../types/announce.type.ts";
import { createAnnounce, getAnnounces } from "../services/announce.service.ts";
import type { City } from "../../../types/register.type.ts";

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
            equipment,
		},
		files,
	);

	res.status(201).json({
		message: "Annonce créée avec succès",
		status: 201,
	});
};

const getMyAnnounces = async (req: Request, res: Response) => {
    const announcerId = req.user!.userId;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
        throw new AppError(400, "Les paramètres page et limit doivent être supérieurs à 0");
    }

    const status = req.query.status as AnnounceStatus | undefined

    if (status !== undefined && status !== "available" && status !== "rented"
    ) {
        throw new AppError(400, "Le statut doit être available ou rented");
    }

    const result = await getAnnounces({
        announcerId,
        page,
        limit,
        status
    });

    res.status(200).json({
        message: "Vos annonces ont été récupérées avec succès",
        status: 200,
        ...result
    });
}

export { sharedAnnounce, getMyAnnounces };
