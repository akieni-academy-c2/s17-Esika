import type { City } from "../../../types/register.type.ts";
import type { Equipment } from "../../announcer/types/announce.type.ts";

export type AnnounceImage = {
    path: string;
    label: string;
};

export type AnnounceFilters = {
    city?: City;
    neighborhood?: string;
    rent?: number;
    totalEntry?: number;
    type?: string;
    furnished?: boolean;
    airConditioning?: boolean;
    wifi?: boolean;
    generator?: boolean;
    parking?: boolean;
    securityGuard?: boolean;
};

export type PaginationParams = {
    page: number;
    limit: number;
};

export type Announce = {
    announceId: number;
    image?: AnnounceImage;
    status: string;
    rent: number;
    type: string;
    neighborhood: string;
    deposit: number;
    advance: number;
    totalEntry: number;
    equipment: Equipment;
    imageCount: number;
};

export type GetAnnouncesParams = PaginationParams & AnnounceFilters;

export type AnnounceResponse = {
    data: Announce[];
    pagination: {
        total: number;
        totalPages: number;
    };
};