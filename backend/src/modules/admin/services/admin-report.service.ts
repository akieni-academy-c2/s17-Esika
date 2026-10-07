import pool from "../../../config/database.ts";
import AppError from "../../../utils/app-error.ts";
import { selectReports, countReports, updateReportStatus } from "../queries/admin-report.query.ts";
import type { GetReports, ReportsPage, ReportItem, UpdateReportStatus } from "../types/admin-report.type.ts";

const getReports = async ({ page, limit }: GetReports): Promise<ReportsPage> => {
	const offset = (page - 1) * limit;

	const [reportsResult, countResult] = await Promise.all([
		pool.query(selectReports, [limit, offset]),
		pool.query(countReports),
	]);

	const total: number = countResult.rows[0].total;

	const reports: ReportItem[] = reportsResult.rows.map((row) => ({
		id: row.id,
		reason: row.reason,
		status: row.status,
		updatedAt: row.updated_at,
		createdAt: row.created_at,
		description: row.description,
		handledAt: row.handled_at,
		action: row.handled_action,
		announceId: row.announce_id,
		reportCount: row.report_count,
		loyer: Number(row.rent),
		publieLe: row.announce_created_at,
		announce: {
			type: row.type,
			neighborhood: row.neighborhood,
			city: row.city,
		},
	}));

	return {
		reports,
		pagination: {
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

const changeReportStatus = async ({
	reportId,
	status,
}: UpdateReportStatus): Promise<void> => {
	const result = await pool.query(updateReportStatus, [reportId, status]);

	if (result.rowCount === 0) {
		throw new AppError(404, "Signalement introuvable");
	}
};

export { getReports, changeReportStatus };