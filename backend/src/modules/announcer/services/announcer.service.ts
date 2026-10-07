import pool from "../../../config/database.ts";
import {
	insertAnnouncer,
	selectAnnouncerByPhoneNumber,
} from "../queries/announcer.query.ts";
import type { QueryRegisterCreate as RegisterData } from "../../../types/register.type.ts";
import type { LoginData } from "../../../types/login.type.ts";
import AppError from "../../../utils/app-error.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const registerAnnouncer = async ({
	phoneNumber,
	lastName,
	firstName,
	email,
	password,
	city,
}: RegisterData): Promise<void> => {
	await pool.query(insertAnnouncer, [
		phoneNumber,
		lastName,
		firstName,
		email,
		password,
		city,
	]);
};

const loginAnnouncer = async ({ phoneNumber, password }: LoginData) => {
	const results = await pool.query(selectAnnouncerByPhoneNumber, [phoneNumber]);

	const announcer = results.rows[0];

	if (!announcer) {
		throw new AppError(404, "Numéro de téléphone inexistant");
	}

	const isPasswordValid = await bcrypt.compare(password, announcer.password);


	if (!isPasswordValid) {
		throw new AppError(400, "Mot de passe incorrect");
	}

	const token = jwt.sign(
		{
			userId: announcer.announcer_id,
			role: "announcer",
		},
		process.env.JWT_SECRET_KEY!,
		{
			expiresIn: "1h",
		},
	);

	return { token, user: { id: announcer.announcer_id, firstName: announcer.first_name, lastName: announcer.last_name, city: announcer.city, phoneNumber: announcer.phone_number } };
};

export { registerAnnouncer, loginAnnouncer };
