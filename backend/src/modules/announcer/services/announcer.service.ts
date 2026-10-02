import pool from "../../../config/database.ts";
import {
	insertAnnouncer,
	selectAnnouncerByPhoneNumber,
} from "../queries/announcer.query.ts";
import type { QueryRegisterCreate as RegisterData } from "../../../types/register.type.ts";
import type { LoginData } from "../../../types/login.type.ts";
import AppError from "../../../utils/app-error.ts";
import bcrypt from "bcrypt"

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

const LoginAnnouncer = async ({phoneNumber, password}: LoginData) => {
	const results = await pool.query(selectAnnouncerByPhoneNumber, [phoneNumber]);

	const announcer = results.rows[0];

	if (!announcer) {
		throw new AppError(404, "Numéro de téléphone inexistant");
	}

	const isPasswordValid = bcrypt.compare(password, announcer.password);

	if(!isPasswordValid) {
		throw new AppError(400, "Mot de passe incorrect")
	}
};

export { registerAnnouncer, LoginAnnouncer };
