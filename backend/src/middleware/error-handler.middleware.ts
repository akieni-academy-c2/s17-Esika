import type {
	ErrorRequestHandler,
	Request,
	Response,
	NextFunction,
} from "express";

import multer from "multer";
import AppError from "../utils/app-error.ts";

const errorHandler: ErrorRequestHandler = (
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
    	if (err instanceof AppError) {
		res.status(err.statusCode).json({
			message: err.message,
            status: err.statusCode
		});
		return;
	}

	if (err instanceof multer.MulterError) {
		const messages: Record<string, string> = {
			LIMIT_FILE_SIZE: "Une image dépasse la taille maximale de 5 Mo",
			LIMIT_FILE_COUNT: "Vous pouvez envoyer au maximum 6 images",
			LIMIT_UNEXPECTED_FILE: "Champ de fichier inattendu",
		};
		res.status(400).json({
			message: messages[err.code] ?? "Erreur lors de l'envoi des images",
			status: 400,
		});
		return;
	}

    if (err instanceof SyntaxError && "body" in (err as object)) {
        res.status(400).json({ message: "JSON invalide", status: 400 });
        return;
    }

    if (typeof err === "object" && err !== null && "code" in err) {
        const code = (err as { code?: string }).code;
        if (code === "23505") {
            res.status(409).json({ message: "Cette donnée existe déjà", status: 409 });
            return;
        }
        if (code === "23503") {
            res.status(400).json({ message: "Référence invalide", status: 400 });
            return;
        }
        if (code === "22P02") {
            res.status(400).json({ message: "Valeur invalide", status: 400 });
            return;
        }
    }

    console.error(err);

    res.status(500).json({
        message: "Une erreur interne est survenue",
		status: 500
    })
};

export default errorHandler