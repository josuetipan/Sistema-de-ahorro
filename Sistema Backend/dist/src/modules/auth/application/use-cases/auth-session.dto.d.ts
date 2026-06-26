export interface AuthSessionDto {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: {
        id: string;
        usuario: string;
        identification: string | null;
        email: string | null;
        fullName: string;
        cityId: string;
        cityName: string;
        roles: string[];
        isActive: boolean;
        pending_password_reset: boolean;
        maturityAt: string;
    };
}
