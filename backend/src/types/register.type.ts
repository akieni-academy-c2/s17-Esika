export type City = "brazzaville" | "pointe-noire";

export type BodyRegisterCreate = {
	lastName: string;
	firstName: string;
	phoneNumber: string;
	password: string;
	passwordVerify: string;
	email?: string;
	city: City;
};

export type QueryRegisterCreate = {
	lastName: string;
	firstName: string;
	phoneNumber: string;
	password: string;
	email?: string;
	city: City;
};
