export declare const UserRole: {
    readonly ADMIN: "ADMIN";
    readonly CUSTOMER: "CUSTOMER";
    readonly ACCOUNTANT: "ACCOUNTANT";
};
export type UserRoleName = (typeof UserRole)[keyof typeof UserRole];
