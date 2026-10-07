import type { Request, Response } from "express";
import AppError from "../../../utils/app-error.ts";
import { announceContact } from "../services/tenant-announce.service.ts";

const announceContactController = async (req: Request, res: Response) => {
	const announceId = Number(req.params.id);
	const tenantId = req.user!.userId;

	if (!Number.isInteger(announceId) || announceId < 1) {
		throw new AppError(400, "L'identifiant de l'annonce est invalide");
	}

	const announce = await announceContact(announceId, tenantId);

	res.status(200).json({
		message: "informations renvoyées avec succes",
		status: 200,
		data: announce,
	});
};

export { announceContactController };
