const selectReports = `
    SELECT
        r.id,
        r.reason,
        r.status,
        r.created_at,

        a.type,
        a.neighborhood,
        a.city,

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

export { selectReports, countReports };