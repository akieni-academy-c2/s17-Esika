const insertEquipment = `INSERT INTO equipments (air_conditioning, wifi, generator, parking, furnished, security_guard, announce_id) VALUES ($1, $2, $3, $4, $5, $6, $7);`;

export {insertEquipment};