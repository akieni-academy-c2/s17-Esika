import pool from "../../../config/database.ts";
import { selectAdminByPhoneNumber } from "../queries/admin.query.ts";
import type { LoginData } from "../../../types/login.type.ts";
import AppError from "../../../utils/app-error.ts";
import jwt from "jsonwebtoken";
import "dotenv/config";

const loginAdmin = async ({
	phoneNumber,
	password,
}: LoginData): Promise<string> => {
	const results = await pool.query(selectAdminByPhoneNumber, [phoneNumber]);

	const admin = results.rows[0];

	if (!admin) {
		throw new AppError(404, "Numéro de téléphone inexistant");
	}

	if (password !== admin.password) {
		throw new AppError(400, "Mot de passe incorrect");
	}

	const token = jwt.sign(
		{
			userId: admin.admin_id,
			role: "admin",
		},
		process.env.JWT_SECRET_KEY!,
		{
			expiresIn: "1h",
		},
	);

    return token;
};

export {loginAdmin}
