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