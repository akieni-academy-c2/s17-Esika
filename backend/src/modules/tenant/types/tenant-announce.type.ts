import type { City } from "../../../types/register.type.ts";
import type { AnnounceImage } from "../../public/index.ts";

export type UnlockPage = {
	type: string;
	neighborhood: string;
	landmark: string;
	city: City;
	rent: number;
	totalEntry: number;
    image: AnnounceImage
};
