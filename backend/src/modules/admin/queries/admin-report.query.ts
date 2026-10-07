const selectReports = `
    SELECT
        r.id,
        r.reason,
        r.status,
        r.created_at,
        r.updated_at,
        r.description,
        r.handled_at,
        r.handled_action,
        a.announce_id,

        a.type,
        a.neighborhood,
        a.city,
        a.rent,
        a.created_at AS announce_created_at,

        (
            SELECT COUNT(*)::int
            FROM reports r2
            WHERE r2.announce_id = r.announce_id
        ) AS report_count

    FROM reports r
    INNER JOIN announces a ON a.announce_id = r.announce_id

    ORDER BY r.created_at DESC
    LIMIT $1 OFFSET $2;
`;

const countReports = `
    SELECT COUNT(*)::int AS total
    FROM reports r
    INNER JOIN announces a ON a.announce_id = r.announce_id;
`;

const updateReportStatus = `
    UPDATE reports
    SET status = $2::report_status,
        updated_at = NOW(),
        handled_at = CASE WHEN $2::report_status = 'processed' THEN NOW() ELSE handled_at END
    WHERE id = $1;
`;

export { selectReports, countReports, updateReportStatus };