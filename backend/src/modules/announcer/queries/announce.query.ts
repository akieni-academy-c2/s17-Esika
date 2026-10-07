const insertAnnounce = `INSERT INTO announces (type, rent, city, neighborhood, deposit, advance, announcer_id, description, available_at, sanitary, kitchen, address, landmark, water_electricity, favor_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING announce_id`;

const selectAnnounces = `
    SELECT
        a.announce_id,
        a.type,
        a.neighborhood,
        a.city,
        a.created_at,
        a.rent,
        a.deposit,
        a.advance,
        a.available_at,
        a.landmark,
        a.description,
        a.favor_time,

        (a.rent * a.advance) + (a.rent * a.deposit) AS total,

        a.status,
        COALESCE(c.paused, FALSE) AS paused,
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
    LEFT JOIN announce_controls c ON c.announce_id = a.announce_id
`;

const countAnnounces = `
    SELECT COUNT(*)
    FROM announces a
    LEFT JOIN announce_controls c ON c.announce_id = a.announce_id
`;

const updatedSatusAnnounce = `
    UPDATE announces 
    SET status = $1, updated_at = NOW() 
    WHERE announce_id = $2 AND announcer_id = $3
    RETURNING status;
`;

const updatedRentAnnounce = `
    UPDATE announces 
    SET rent = $1, updated_at = NOW() 
    WHERE announce_id = $2 AND announcer_id = $3
    RETURNING rent;
`;

export { insertAnnounce, selectAnnounces, countAnnounces, updatedSatusAnnounce, updatedRentAnnounce };
