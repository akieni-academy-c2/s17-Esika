const selectAnnounceContact = `
    SELECT
        a.rent,
        a.type,
        a.city,
        a.neighborhood,
        a.landmark,
        a.deposit,
        a.advance,

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

    WHERE a.announce_id = $1;
`

export {selectAnnounceContact}