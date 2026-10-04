const selectAnnounces = `
    SELECT
        a.announce_id,
        a.status,
        a.rent,
        a.type,
        a.city,
        a.neighborhood,
        a.deposit,
        a.advance,
        a.landmark,

        (a.rent * a.advance) + (a.rent * a.deposit) AS total_entry,

        json_build_object(
            'airConditioning', e.air_conditioning,
            'wifi', e.wifi,
            'generator', e.generator,
            'parking', e.parking,
            'furnished', e.furnished,
            'securityGuard', e.security_guard
        ) AS equipment,

        (
            SELECT json_build_object(
                'path', i.path,
                'label', i.label
            )
            FROM images i
            WHERE i.announce_id = a.announce_id
            ORDER BY i.image_id
            LIMIT 1
        ) AS image,

        (
            SELECT COUNT(*)
            FROM images i
            WHERE i.announce_id = a.announce_id
        ) AS image_count

    FROM announces a

    LEFT JOIN equipments e
        ON e.announce_id = a.announce_id
`;

const countAnnounces = `
    SELECT COUNT(*)
    FROM announces a

    LEFT JOIN equipments e
        ON e.announce_id = a.announce_id
`;

export {selectAnnounces, countAnnounces}