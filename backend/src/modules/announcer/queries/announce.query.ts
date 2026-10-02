const insertAnnounce = `INSERT INTO announces (type, rent, city, neighborhood, deposit, advance, announcer_id, description, available_at, sanitary, kitchen, address, landmark, water_electricity, favor_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING announce_id`;

export { insertAnnounce };
