export type CreatePass = {
	announceId: number;
	tenantId: number;
};

export type Pass = {
	passId: number;
	createdAt: Date;
	expiredAt: Date;
	announceId: number;
	tenantId: number;
};

export type PassInfo = {
	expiredAt: Date;
	announcer: {
		firstName: string;
		lastName: string;
		phoneNumber: string;
	};
	announce: {
		type: string;
		neighborhood: string;
		rent: number;
		landmark: string;
	};
};
