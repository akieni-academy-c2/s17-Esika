import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
	user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    database: process.env.DB_DATABASE
});

export default pool;
