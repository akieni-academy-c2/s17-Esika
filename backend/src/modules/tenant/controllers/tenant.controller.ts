import type { Request, Response } from "express";
import validator from "validator";
import type {
	City,
	BodyRegisterCreate as registerData,
} from "../../../types/register.type.ts";
import AppError from "../../../utils/app-error.ts";
import { registerTenant } from "../services/tenant.service.ts";
import bcrypt from "bcrypt";

const signUpTenant = async (req: Request, res: Response) => {
	const data: registerData = req.body;

	// Champs obligatoires
	if (
		!data.firstName ||
		!data.lastName ||
		!data.phoneNumber ||
		!data.password ||
		!data.passwordVerify ||
		!data.city
	) {
		throw new AppError(400, "Champ(s) obligatoire(s) manquant(s)");
	}

	// Validation du numéro de téléphone
	const regexNumber = /^\+?\d{5,15}$/;
	if (!regexNumber.test(data.phoneNumber)) {
		throw new AppError(400, "Numéro de téléphone invalide");
	}

	// Validation du mot de passe
	if (data.password !== data.passwordVerify) {
		throw new AppError(400, "Les mots de passe ne correspondent pas");
	}

	// Validation de l'email
	if (data.email && !validator.isEmail(data.email)) {
		throw new AppError(400, "Adresse email invalide");
	}

	// Hashage du mot de passe
	const passwordHash = await bcrypt.hash(data.password, 10);

	// Formater le nom de la ville en minuscules
	const city = data.city.toLowerCase() as City;

	// Enregistrement de l'annonceur
	await registerTenant({
		phoneNumber: data.phoneNumber,
		lastName: data.lastName,
		firstName: data.firstName,
		email: data.email,
		password: passwordHash,
		city,
	});

	res.status(201).json({
		message: "Vous êtes inscrit avec succès",
		status: 201,
	});
};

export { signUpTenant };
