export type City = "brazzaville" | "pointe-noire";

export type BodyAnnouncerCreate = {
	lastName: string;
	firstName: string;
	phoneNumber: string;
	password: string;
	passwordVerify: string;
	email?: string;
	city: City;
};

export type QueryAnnouncerCreate = {
	lastName: string;
	firstName: string;
	phoneNumber: string;
	password: string;
	email?: string;
	city: City;
};
