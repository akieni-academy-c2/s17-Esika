import "dotenv/config";
import pg from "pg";
import bcrypt from "bcrypt";
const { Pool } = pg;
const phoneNumber = process.env.ADMIN_PHONE?.trim();
const password = process.env.ADMIN_PASSWORD;
const firstName = process.env.ADMIN_FIRST_NAME?.trim() || "Admin";
const lastName = process.env.ADMIN_LAST_NAME?.trim() || "ESIKA";
const updateExisting = process.env.ADMIN_UPDATE_EXISTING === "true";
if (!phoneNumber || !password) { console.error("ADMIN_PHONE et ADMIN_PASSWORD sont obligatoires."); process.exit(1); }
if (!/^\+?\d{5,15}$/.test(phoneNumber)) { console.error("ADMIN_PHONE doit contenir entre 5 et 15 chiffres, avec + optionnel."); process.exit(1); }
if (password.length < 8) { console.error("ADMIN_PASSWORD doit contenir au moins 8 caractères."); process.exit(1); }
const pool = new Pool({ user: process.env.DB_USER, password: process.env.DB_PASSWORD, host: process.env.DB_HOST, port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined, database: process.env.DB_DATABASE });
try {
  const existing = await pool.query("SELECT admin_id, phone_number FROM admins WHERE phone_number = $1 LIMIT 1", [phoneNumber]);
  if (existing.rows.length > 0 && !updateExisting) {
    console.log(`Un administrateur existe déjà pour ${phoneNumber}. Aucun changement effectué.`);
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    if (existing.rows.length > 0) {
      await pool.query(`UPDATE admins SET first_name = $1, last_name = $2, password = $3 WHERE admin_id = $4`, [firstName, lastName, passwordHash, existing.rows[0].admin_id]);
      console.log(`Administrateur ${phoneNumber} mis à jour avec un mot de passe hashé.`);
    } else {
      await pool.query(`INSERT INTO admins (phone_number, last_name, first_name, password) VALUES ($1, $2, $3, $4)`, [phoneNumber, lastName, firstName, passwordHash]);
      console.log(`Administrateur ${phoneNumber} créé avec succès.`);
    }
  }
} catch (error) { console.error("Impossible de créer l'administrateur :", error instanceof Error ? error.message : error); process.exitCode = 1; }
finally { await pool.end(); }
