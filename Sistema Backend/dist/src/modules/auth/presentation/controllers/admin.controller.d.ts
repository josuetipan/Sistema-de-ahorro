import { CreateAdminUserUseCase } from '../../application/use-cases/create-admin-user.use-case';
import { CreateAdminUserHttpDto } from '../dto/create-admin-user.http.dto';
export declare class AdminController {
    private readonly createAdminUser;
    constructor(createAdminUser: CreateAdminUserUseCase);
    create(body: CreateAdminUserHttpDto): Promise<import("../../application/use-cases/create-admin-user.use-case").CreateAdminUserResult>;
}
