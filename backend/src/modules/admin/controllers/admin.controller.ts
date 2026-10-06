import type { Request, Response } from "express";
import AppError from "../../../utils/app-error.ts";
import { loginAdmin } from "../services/admin.service.ts";
import type { LoginData } from "../../../types/login.type.ts";

const signInAdmin = async (req: Request, res: Response) => {
	const data: LoginData = req.body;

	// Champs obligatoires
	if (!data.phoneNumber || !data.password) {
		throw new AppError(
			400,
			"Le numéro de téléphone et le mot de passe sont obligatoires",
		);
	}

	// Validation du numéro de téléphone
	const regexNumber = /^\+?\d{5,15}$/;
	if (!regexNumber.test(data.phoneNumber)) {
		throw new AppError(400, "Format numéro de téléphone invalide");
	}

	const token = await loginAdmin(data);

	res.status(200).json({
		message: "Connexion réussie",
		status: 200,
		token,
	});
};

export { signInAdmin };
