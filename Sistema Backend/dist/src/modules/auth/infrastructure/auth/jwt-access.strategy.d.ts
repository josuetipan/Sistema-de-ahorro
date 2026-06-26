import { Strategy } from 'passport-jwt';
import { type UserRepositoryPort } from '../../domain/ports/user.repository.port';
declare const JwtAccessStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtAccessStrategy extends JwtAccessStrategy_base {
    private readonly users;
    constructor(users: UserRepositoryPort);
    validate(payload: {
        sub: string;
    }): Promise<{
        id: string;
        usuario: string;
        email: string | null;
        fullName: string;
        cityId: string;
        cityName: string;
        roles: string[];
    }>;
}
export {};
