import type { City } from "../../../types/register.type.ts";
import type { AnnounceImage } from "../../public/index.ts";

export type Equipment = {
    airConditioning: boolean;
    wifi: boolean;
    generator: boolean;
    parking: boolean;
    furnished: boolean;
    securityGuard: boolean;
};

export type CreateAnnounce = {
    type: string;
    rent: number;
    city: City;
    neighborhood: string;
    deposit: number;
    advance: number;
    announcerId: number;
    description?: string;
    availableAt?: Date;
    sanitary: string;
    kitchen: string;
    address?: string;
    landmark: string;
    waterElectricity?: string;
    favorTime: string;
    equipment: Equipment
}

export type AnnounceStatus = "available" | "rented";

export type Announce = {
    announceId: number;
    image?: AnnounceImage;
    type: string;
    neighborhood: string;
    city: City;
    createdAt: Date;
    rent: number;
    total: number;
    status: string;
    updatedAt: Date;
};

export type GetAnnouncesParams = {
    announcerId: number;
    page: number;
    limit: number;
    status?: AnnounceStatus;
};

export type AnnounceResponse = {
    data: Announce[];
    pagination: {
        total: number;
        totalPages: number;
    };
};