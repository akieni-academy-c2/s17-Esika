import pool from "../../../config/database.ts";
import { insertTenant, selectTenantByPhoneNumber } from "../queries/tenant.query.ts";
import type { QueryRegisterCreate as RegisterData } from "../../../types/register.type.ts";
import type { LoginData } from "../../../types/login.type.ts";
import AppError from "../../../utils/app-error.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

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

const loginTenant = async ({ phoneNumber, password }: LoginData): Promise<string> => {
	const results = await pool.query(selectTenantByPhoneNumber, [phoneNumber]);

	const tenant = results.rows[0];

	if (!tenant) {
		throw new AppError(404, "Numéro de téléphone inexistant");
	}

	const isPasswordValid = await bcrypt.compare(password, tenant.password);

	if (!isPasswordValid) {
		throw new AppError(400, "Mot de passe incorrect");
	}

	const token = jwt.sign(
		{
			userId: tenant.tenant_id,
			role: "tenant",
		},
		process.env.JWT_SECRET_KEY!,
		{
			expiresIn: "1h",
		},
	);

	return token;
};

export { registerTenant, loginTenant };
