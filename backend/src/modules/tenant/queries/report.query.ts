const insertReport = `
    INSERT INTO reports (created_at, reason, announce_id, tenant_id, status, description) VALUES (NOW(), $1, $2, $3, 'to_process', $4);  
`;

export { insertReport };
