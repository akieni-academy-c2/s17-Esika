type ReportStatus = "to_process" | "in_progress" | "processed";

type GetReports = {
	page: number;
	limit: number;
};

type ReportItem = {
	id: number;
	reason: string;
	status: ReportStatus;
	createdAt: Date;
	reportCount: number;
	announce: {
		type: string;
		neighborhood: string;
		city: string;
	};
};

type ReportsPage = {
	reports: ReportItem[];
	pagination: {
		total: number;
		totalPages: number;
	};
};

type UpdateReportStatus = {
	reportId: number;
	status: ReportStatus;
};

export type { ReportStatus, GetReports, ReportItem, ReportsPage, UpdateReportStatus };