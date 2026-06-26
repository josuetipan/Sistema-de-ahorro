import type { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import type { RefreshTokenRepositoryPort } from '../../domain/ports/refresh-token.repository.port';
export interface SetUserPasswordInput {
    userId: string;
    newPassword: string;
}
export declare class SetUserPasswordUseCase {
    private readonly users;
    private readonly refreshRepo;
    constructor(users: UserRepositoryPort, refreshRepo: RefreshTokenRepositoryPort);
    execute(input: SetUserPasswordInput): Promise<void>;
}
