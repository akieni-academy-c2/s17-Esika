import type {
	ErrorRequestHandler,
	Request,
	Response,
	NextFunction,
} from "express";

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
		})

		return;
	}

    console.error(err);

    res.status(500).json({
        error: "InternalServerError",
        message: "An unexpected error occurred",
    })
};

export default errorHandler