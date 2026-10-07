import type { Request, Response } from "express";
import validator from "validator";
import type {
	City,
	BodyRegisterCreate as registerData,
} from "../../../types/register.type.ts";
import AppError from "../../../utils/app-error.ts";
import { registerAnnouncer, loginAnnouncer } from "../services/announcer.service.ts";
import bcrypt from "bcrypt";
import type { LoginData } from "../../../types/login.type.ts";

const signUpAnnouncer = async (req: Request, res: Response) => {
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

	const city = String(data.city).trim().toLowerCase();
	if (city !== "brazzaville" && city !== "pointe-noire") {
		throw new AppError(400, "Ville invalide");
	}
	if (String(data.password).length < 8) {
		throw new AppError(400, "Le mot de passe doit contenir au moins 8 caractères");
	}

	// Validation du numéro de téléphone
	const regexNumber = /^\+?\d{5,15}$/;
	if (!regexNumber.test(data.phoneNumber)) {
		throw new AppError(400, "Format numéro de téléphone invalide");
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

	// La ville a déjà été normalisée et validée ci-dessus.
	const cityTyped = city as City;

	// Enregistrement de l'annonceur
	await registerAnnouncer({
		phoneNumber: data.phoneNumber,
		lastName: data.lastName,
		firstName: data.firstName,
		email: data.email,
		password: passwordHash,
		city: cityTyped,
	});

	res.status(201).json({
		message: "Vous êtes inscrit avec succès",
		status: 201,
	});
};

const signInAnnouncer = async (req: Request, res: Response) => {
	const data: LoginData = req.body;

	// Champs obligatoires
	if (!data.phoneNumber || !data.password) {
		throw new AppError(400, "Le numéro de téléphone et le mot de passe sont obligatoires");
	}

	// Validation du numéro de téléphone
	const regexNumber = /^\+?\d{5,15}$/;
	if (!regexNumber.test(data.phoneNumber)) {
		throw new AppError(400, "Format numéro de téléphone invalide");
	}

	const result = await loginAnnouncer(data);

	res.status(200).json({ message: "Connexion réussie", status: 200, token: result.token, user: result.user });
}

export { signUpAnnouncer, signInAnnouncer };
