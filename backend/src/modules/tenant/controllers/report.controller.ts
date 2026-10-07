import type { Request, Response } from "express";
import AppError from "../../../utils/app-error.ts";
import { createReport } from "../services/report.service.ts";

const createReportController = async (req: Request, res: Response) => {
	const announceId = Number(req.params.id);
	const tenantId = req.user!.userId;
	const { reason, description } = req.body;

	if (!Number.isInteger(announceId) || announceId < 1) {
		throw new AppError(400, "L'identifiant de l'annonce est invalide");
	}

	if (typeof reason !== "string" || reason.trim() === "") {
		throw new AppError(400, "Le motif du signalement est obligatoire");
	}

	if (description !== undefined && description !== null && typeof description !== "string") {
		throw new AppError(400, "La description est invalide");
	}

	await createReport({
		announceId,
		tenantId,
		reason: reason.trim(),
		description: description?.trim() || null,
	});

	res.status(201).json({
		message: "Signalement créé avec succès",
		status: 201,
	});
};

export { createReportController };