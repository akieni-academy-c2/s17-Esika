import pool from "../../../config/database.ts";
import { selectReports, countReports } from "../queries/admin-report.query.ts";
import type { GetReports, ReportsPage, ReportItem } from "../types/admin-report.type.ts";

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
		createdAt: row.created_at,
		reportCount: row.report_count,
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

export { getReports };