import type { Request, Response } from "express";
import AppError from "../../../utils/app-error.ts";
import { getReports, changeReportStatus } from "../services/admin-report.service.ts";
import { REPORT_STATUSES } from "../constant.ts";

const getReportsController = async (req: Request, res: Response) => {
	const page = req.query.page ? Number(req.query.page) : 1;
	const limit = req.query.limit ? Number(req.query.limit) : 10;

	if (!Number.isInteger(page) || page < 1) {
		throw new AppError(400, "Le numéro de page est invalide");
	}

	if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
		throw new AppError(400, `La limite doit être comprise entre 1 et 50`);
	}

	const reports = await getReports({ page, limit });

	res.status(200).json({
		message: "Signalements renvoyés avec succès",
		status: 200,
		data: reports,
	});
};

const updateReportStatusController = async (req: Request, res: Response) => {
	const reportId = Number(req.params.id);
	const { status } = req.body;

	if (!Number.isInteger(reportId) || reportId < 1) {
		throw new AppError(400, "L'identifiant du signalement est invalide");
	}

	if (!REPORT_STATUSES.includes(status)) {
		throw new AppError(400, "Le statut est invalide");
	}

	await changeReportStatus({ reportId, status });

	res.status(200).json({
		message: "Statut du signalement mis à jour avec succès",
		status: 200,
	});
};

export { getReportsController, updateReportStatusController };
