import type { City } from "../../../types/register.type.ts";
import type { Equipment } from "../../announcer/index.ts";

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
    availableAt?: Date;
    landmark: string
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

export type AnnounceDetail = {
    announceId: number;
    city: City;
    neighborhood: string;
    type: string;
    availableAt?: Date;
    updatedAt: Date;
    landmark: string;

    images: AnnounceImage[];

    equipment: Equipment;

    rent: number;
    caution: number;
    advance: number;
    description?: string;

    lastName: string;
    firstName: string;
    announceCount: number;

    favorTime: string;

    advanceAmount: number;
    cautionAmount: number;
    totalEntry: number;
};