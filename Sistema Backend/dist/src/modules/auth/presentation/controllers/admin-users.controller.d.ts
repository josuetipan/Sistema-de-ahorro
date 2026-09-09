import { ManageAdminUsersUseCase } from '../../application/use-cases/manage-admin-users.use-case';
import { SetUserActiveHttpDto, UpdateAdminUserHttpDto } from '../dto/update-admin-user.http.dto';
export declare class AdminUsersController {
    private readonly manageUsers;
    constructor(manageUsers: ManageAdminUsersUseCase);
    list(): Promise<import("../../domain/ports/user.repository.port").AdminUserRecord[]>;
    update(id: string, body: UpdateAdminUserHttpDto): Promise<import("../../domain/ports/user.repository.port").AdminUserRecord>;
    setActive(id: string, body: SetUserActiveHttpDto): Promise<import("../../domain/ports/user.repository.port").AdminUserRecord>;
}
