import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/app-error.ts";

export const authorize = (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      throw new AppError(403, "Accès interdit");
    }
    next();
  };
