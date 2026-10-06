import type { Request, Response } from "express";
import { createPass } from "../services/pass.service.ts";
import AppError from "../../../utils/app-error.ts";

const buyPass = async (req: Request, res: Response) => {
	const announceId = Number(req.params.id);
	const tenantId = req.user!.userId;
	const { phoneNumber } = req.body;

    if (!phoneNumber) {
        throw new AppError(400, "Le numéro de téléphone et le mot de passe sont obligatoires");
    }

    // Validation du numéro de téléphone
	const regexNumber = /^\+?\d{5,15}$/;
	if (!regexNumber.test(phoneNumber)) {
		throw new AppError(400, "Format numéro de téléphone invalide");
	}

	if (!Number.isInteger(announceId) || announceId < 1) {
		throw new AppError(400, "L'identifiant de l'annonce est invalide");
	}

	await createPass({ announceId, tenantId });

	res.status(201).json({
		message: "Pass créé avec succès",
		status: 201,
	});
};

export { buyPass };
