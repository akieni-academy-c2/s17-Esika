import type { City } from "../../../types/register.type.ts";

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