import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error.ts";

const notFoundMiddleware = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	next(new AppError(404, `Route ${req.method} ${req.originalUrl} not found`));
};

export default notFoundMiddleware;
