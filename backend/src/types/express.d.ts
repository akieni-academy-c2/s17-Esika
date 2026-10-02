import type { JwtPayload } from "./jwt.type.ts";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export {};