import type { NextFunction, Request, Response } from "express";

// Limitation des tentatives de connexion : 3 mots de passe incorrects => numéro bloqué 15 minutes.
// Cette protection DOIT exister côté serveur : le blocage affiché par le frontend se contourne facilement.
//
// Limites connues : les compteurs sont gardés en mémoire (ils repartent à zéro si le serveur redémarre, et ne
// sont pas partagés entre plusieurs instances). Pour la production, les stocker en base ou dans Redis.

const MAX_ESSAIS = 3;
const DUREE_BLOCAGE_MS = 15 * 60 * 1000;

type Etat = { echecs: number; dernier: number; bloqueJusqua: number };
const etats = new Map<string, Etat>();

// Nettoyage des numéros dont le blocage est terminé (le minuteur ne retient pas l'arrêt du serveur)
setInterval(() => {
	const maintenant = Date.now();
	for (const [cle, e] of etats) {
		const termine = e.bloqueJusqua ? e.bloqueJusqua <= maintenant : maintenant - e.dernier > DUREE_BLOCAGE_MS;
		if (termine) etats.delete(cle);
	}
}, 10 * 60 * 1000).unref();

const cleDe = (req: Request) => String(req.body?.phoneNumber ?? "").replace(/\s/g, "");

/**
 * À placer devant les routes de connexion :
 *   router.post("/signin", limiteConnexion, signinController);
 * Les routes de connexion sont appelées l'une après l'autre par le frontend (locataire puis propriétaire) :
 * seules les réponses 400 / 401 (mot de passe incorrect) comptent comme échec, pas le 404 « numéro inconnu ».
 */
export const limiteConnexion = (req: Request, res: Response, next: NextFunction) => {
	const cle = cleDe(req);
	if (!cle) return next();

	const maintenant = Date.now();
	const etat = etats.get(cle);
	if (etat && etat.bloqueJusqua > maintenant) {
		const retryAfter = Math.ceil((etat.bloqueJusqua - maintenant) / 1000);
		res.set("Retry-After", String(retryAfter));
		return res.status(429).json({
			message: "Trop de tentatives échouées. Réessayez plus tard.",
			status: 429,
			retryAfter,
		});
	}

	res.on("finish", () => {
		const fin = Date.now();
		if (res.statusCode >= 200 && res.statusCode < 300) {
			etats.delete(cle); // connexion réussie : on repart de zéro
			return;
		}
		if (res.statusCode !== 400 && res.statusCode !== 401) return;

		const courant = etats.get(cle);
		const recent = courant && courant.bloqueJusqua <= fin && fin - courant.dernier <= DUREE_BLOCAGE_MS;
		const suivant: Etat = recent ? courant : { echecs: 0, dernier: fin, bloqueJusqua: 0 };
		suivant.echecs += 1;
		suivant.dernier = fin;
		if (suivant.echecs >= MAX_ESSAIS) suivant.bloqueJusqua = fin + DUREE_BLOCAGE_MS;
		etats.set(cle, suivant);
	});

	next();
};