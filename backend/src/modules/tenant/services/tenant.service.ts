import pool from "../../../config/database.ts";
import { insertTenant } from "../queries/tenant.query.ts";
import type { QueryRegisterCreate as RegisterData } from "../../../types/register.type.ts";

const registerTenant = async ({
	phoneNumber,
	lastName,
	firstName,
	email,
	password,
	city,
}: RegisterData) => {
	await pool.query(insertTenant, [
		phoneNumber,
		lastName,
		firstName,
		email,
		password,
		city,
	]);
};

export { registerTenant };
