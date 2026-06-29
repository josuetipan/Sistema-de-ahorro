import type { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import type { RefreshTokenRepositoryPort } from '../../domain/ports/refresh-token.repository.port';
export interface ChangePasswordInput {
    userId: string;
    currentPassword?: string;
    newPassword: string;
}
export declare class ChangePasswordUseCase {
    private readonly users;
    private readonly refreshRepo;
    constructor(users: UserRepositoryPort, refreshRepo: RefreshTokenRepositoryPort);
    execute(input: ChangePasswordInput): Promise<void>;
}
