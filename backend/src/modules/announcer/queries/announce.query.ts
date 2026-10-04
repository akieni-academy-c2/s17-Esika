const insertAnnounce = `INSERT INTO announces (type, rent, city, neighborhood, deposit, advance, announcer_id, description, available_at, sanitary, kitchen, address, landmark, water_electricity, favor_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING announce_id`;

const selectAnnounces = `
    SELECT
        a.announce_id,
        a.type,
        a.neighborhood,
        a.city,
        a.created_at,
        a.rent,

        (a.rent * a.advance) + (a.rent * a.deposit) AS total,

        a.status,
        a.updated_at,

        (
            SELECT json_build_object(
                'path', i.path,
                'label', i.label
            )
            FROM images i
            WHERE i.announce_id = a.announce_id
            ORDER BY i.image_id
            LIMIT 1
        ) AS image

    FROM announces a
`;

const countAnnounces = `
    SELECT COUNT(*)
    FROM announces a
`;

const updatedSatusAnnounce = `
    UPDATE announces 
    SET status = $1, updated_at = NOW() 
    WHERE announce_id = $2
    RETURNING status;
`;

export { insertAnnounce, selectAnnounces, countAnnounces, updatedSatusAnnounce };
