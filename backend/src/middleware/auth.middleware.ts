import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/app-error.ts";
import type { JwtPayload } from "../types/jwt.type.ts";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        throw new AppError(401, "Token manquant");
    }

    const [type, token] = authorization.split(" ");

    if(type !== "Bearer" || !token) {
        throw new AppError(401, "Format du token invalide");
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;

        req.user = decoded;

        next();
    } catch {
        throw new AppError(401, "Token invalide ou expiré");
    }
}