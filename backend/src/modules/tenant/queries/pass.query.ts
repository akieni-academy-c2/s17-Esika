const insertPass = `INSERT INTO passes (created_at, expired_at, announce_id, tenant_id) VALUES(NOW(), NOW() + INTERVAL '7 days', $1, $2);`

export {insertPass}