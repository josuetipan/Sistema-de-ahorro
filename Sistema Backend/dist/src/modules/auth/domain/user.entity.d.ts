export declare class User {
    readonly id: string;
    readonly usuario: string;
    readonly email: string | null;
    readonly passwordHash: string;
    readonly fullName: string;
    readonly roleId: string;
    readonly roles: readonly string[];
    readonly isActive: boolean;
    readonly cityId: string;
    readonly cityName: string;
    readonly maturityAt: Date;
    readonly phoneNumber: string | null;
    readonly identification: string | null;
    readonly pendingPasswordReset: boolean;
    constructor(id: string, usuario: string, email: string | null, passwordHash: string, fullName: string, roleId: string, roles: readonly string[], isActive: boolean, cityId: string, cityName: string, maturityAt: Date, phoneNumber?: string | null, identification?: string | null, pendingPasswordReset?: boolean);
}
