import pool from "../../../config/database.ts";
import { insertAnnouncer } from "../queries/announcer.query.ts";
import type { QueryAnnouncerCreate as RegisterData } from "../types/announcer.type.ts";

const registerAnnouncer = async ({
	phoneNumber,
	lastName,
	firstName,
	email,
	password,
	city,
}: RegisterData) => {
	await pool.query(insertAnnouncer, [
		phoneNumber,
		lastName,
		firstName,
		email,
		password,
		city,
	]);
};

export { registerAnnouncer };
