// Requête de l'inscription d'un annonceur
const insertAnnouncer = `INSERT INTO announcers (phone_number, last_name, first_name, email, password, city) VALUES ($1, $2, $3, $4, $5, $6);`;

export { insertAnnouncer };
