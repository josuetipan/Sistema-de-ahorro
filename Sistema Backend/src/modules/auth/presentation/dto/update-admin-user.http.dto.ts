import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '../../domain/user-role';

const ROLES = [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.ACCOUNTANT];

export class UpdateAdminUserHttpDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  identification?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @IsOptional()
  @IsIn(ROLES)
  roleCode?: string;
}

export class SetUserActiveHttpDto {
  @IsIn([true, false])
  isActive!: boolean;
}