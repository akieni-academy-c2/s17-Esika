import type { Request, Response } from "express";
import AppError from "../../../utils/app-error.ts";
import { getAnnounces } from "../services/announce-public.service.ts";
import type { City } from "../../../types/register.type.ts";

const displayAnnounces = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
        throw new AppError(
            400,
            "Les paramètres page et limit doivent être supérieurs à 0",
        );
    }

    const city = req.query.city as City | undefined;
    const neighborhood = req.query.neighborhood as string | undefined;
    const type = req.query.type as string | undefined;

    const rent =
        req.query.rent !== undefined
            ? Number(req.query.rent)
            : undefined;

    const totalEntry =
        req.query.totalEntry !== undefined
            ? Number(req.query.totalEntry)
            : undefined;

    const furnished =
        req.query.furnished !== undefined
            ? req.query.furnished === "true"
            : undefined;

    const airConditioning =
        req.query.airConditioning !== undefined
            ? req.query.airConditioning === "true"
            : undefined;

    const wifi =
        req.query.wifi !== undefined
            ? req.query.wifi === "true"
            : undefined;

    const generator =
        req.query.generator !== undefined
            ? req.query.generator === "true"
            : undefined;

    const parking =
        req.query.parking !== undefined
            ? req.query.parking === "true"
            : undefined;

    const securityGuard =
        req.query.securityGuard !== undefined
            ? req.query.securityGuard === "true"
            : undefined;

    if (rent !== undefined && (isNaN(rent) || rent < 0)) {
        throw new AppError(400, "Le montant du loyer est invalide");
    }

    if (
        totalEntry !== undefined &&
        (isNaN(totalEntry) || totalEntry < 0)
    ) {
        throw new AppError(
            400,
            "Le montant total à l'entrée est invalide",
        );
    }

    const result = await getAnnounces({
        page,
        limit,
        city,
        neighborhood,
        rent,
        totalEntry,
        type,
        furnished,
        airConditioning,
        wifi,
        generator,
        parking,
        securityGuard,
    });

    res.status(200).json({
        message: "Annonces récupérées avec succès",
        status: 200,
        ...result,
    });
};

export { displayAnnounces };