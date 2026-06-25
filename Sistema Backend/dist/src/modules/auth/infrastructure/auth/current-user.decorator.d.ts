export interface AuthUserPayload {
    id: string;
    usuario: string;
    email: string | null;
    fullName: string;
    cityId: string;
    cityName: string;
    roles: string[];
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
