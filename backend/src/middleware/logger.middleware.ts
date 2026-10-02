import type { NextFunction, Request, Response } from "express";

const loggerMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
}

export default loggerMiddleware;