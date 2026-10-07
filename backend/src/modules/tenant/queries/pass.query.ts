const insertPass = `INSERT INTO passes (created_at, expired_at, announce_id, tenant_id) VALUES(NOW(), NOW() + INTERVAL '7 days', $1, $2) RETURNING expired_at;`

const selectPassInfo = `
    SELECT
        p.expired_at,
        p.expired_at > NOW() AS is_active,

        an.first_name,
        an.last_name,
        an.phone_number,

        a.type,
        a.neighborhood,
        a.rent,
        a.landmark

    FROM passes p

    INNER JOIN announces a ON a.announce_id = p.announce_id
    INNER JOIN announcers an ON an.announcer_id = a.announcer_id

    WHERE p.announce_id = $1 AND p.tenant_id = $2

    ORDER BY p.expired_at DESC
    LIMIT 1;
`

export {insertPass, selectPassInfo}