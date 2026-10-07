import pool from "./database.ts";

export async function ensureCompatSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS announce_controls (
      announce_id INTEGER PRIMARY KEY,
      paused BOOLEAN NOT NULL DEFAULT FALSE,
      hidden BOOLEAN NOT NULL DEFAULT FALSE,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_announce_controls_paused ON announce_controls(paused)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_announce_controls_hidden ON announce_controls(hidden)`);
  // Compatibilité back-office : mémorise l'action choisie par l'administrateur
  // sans changer les routes ni l'enum de statut existants.
  await pool.query(`ALTER TABLE reports ADD COLUMN IF NOT EXISTS handled_action TEXT`);
}
