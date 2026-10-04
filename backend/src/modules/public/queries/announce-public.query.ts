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

const selectAnnounceById = `
    SELECT
        a.announce_id,
        a.city,
        a.neighborhood,
        a.type,
        a.available_at,
        a.updated_at,
        a.landmark,
        a.rent,
        a.deposit,
        a.advance,
        a.description,
        a.favor_time,

        json_build_object(
            'airConditioning', e.air_conditioning,
            'wifi', e.wifi,
            'generator', e.generator,
            'parking', e.parking,
            'furnished', e.furnished,
            'securityGuard', e.security_guard
        ) AS equipment,

        (
            SELECT COALESCE(
                json_agg(
                    json_build_object(
                        'label', i.label,
                        'path', i.path
                    )
                    ORDER BY i.image_id
                ),
                '[]'::json
            )
            FROM images i
            WHERE i.announce_id = a.announce_id
        ) AS images,

        an.last_name,
        an.first_name,

        (
            SELECT COUNT(*)
            FROM announces a2
            WHERE a2.announcer_id = a.announcer_id
        ) AS announce_count

    FROM announces a

    LEFT JOIN equipments e
        ON e.announce_id = a.announce_id

    INNER JOIN announcers an
        ON an.announcer_id = a.announcer_id

    WHERE a.announce_id = $1
`;

export {selectAnnounces, countAnnounces, selectAnnounceById}