export declare const UserRole: {
    readonly ADMIN: "ADMIN";
    readonly OPERATOR: "OPERATOR";
    readonly CUSTOMER: "CUSTOMER";
};
export type UserRoleName = (typeof UserRole)[keyof typeof UserRole];
