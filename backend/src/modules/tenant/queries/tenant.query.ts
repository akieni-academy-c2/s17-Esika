// Requête de l'inscription d'un locataire
const insertTenant = `INSERT INTO tenants (phone_number, last_name, first_name, email, password, city) VALUES ($1, $2, $3, $4, $5, $6);`;

const selectTenantByPhoneNumber = `SELECT * FROM tenants WHERE phone_number = $1;`

export { insertTenant, selectTenantByPhoneNumber };