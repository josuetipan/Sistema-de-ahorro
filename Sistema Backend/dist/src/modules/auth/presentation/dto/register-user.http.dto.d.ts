import { type UserRoleName } from '../../domain/user-role';
export declare class RegisterUserHttpDto {
    fullName: string;
    identification: string;
    email: string;
    phoneNumber: string;
    roleCode: UserRoleName;
    codigoReferencia?: string;
    password?: string;
    cityId?: string;
}
