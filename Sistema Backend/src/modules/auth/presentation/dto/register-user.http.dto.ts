import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole, type UserRoleName } from '../../domain/user-role';

function collapseInternalSpaces(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

const ASSIGNABLE_ROLES: UserRoleName[] = [
  UserRole.ADMIN,
  UserRole.OPERATOR,
  UserRole.CUSTOMER,
];

export class RegisterUserHttpDto {
  @IsString()
  @MinLength(1, { message: 'El nombre completo es requerido' })
  @MaxLength(60, {
    message: 'El nombre completo admite como máximo 60 caracteres',
  })
  @Matches(/^[\p{L} ]+$/u, {
    message: 'El nombre completo solo permite letras y espacios',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? collapseInternalSpaces(value) : value,
  )
  fullName!: string;

  @IsString()
  @MinLength(1, { message: 'La cédula es obligatoria' })
  @MaxLength(20, {
    message: 'La cédula admite como máximo 20 caracteres',
  })
  @Matches(/^[\p{L}\p{N}]+$/u, {
    message: 'La cédula solo permite letras y números',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  identification!: string;

  @IsEmail({}, { message: 'El correo no es válido' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email!: string;

  @IsString()
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres' })
  @MaxLength(20, { message: 'El teléfono admite como máximo 20 caracteres' })
  @Matches(/^[\d+\s()-]+$/, {
    message: 'El teléfono solo permite números, espacios, +, - y paréntesis',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  phoneNumber!: string;

  @IsIn(ASSIGNABLE_ROLES, {
    message: `roleCode debe ser uno de: ${ASSIGNABLE_ROLES.join(', ')}`,
  })
  roleCode!: UserRoleName;

  @IsOptional()
  @IsString()
  @MaxLength(20, {
    message: 'El código de referencia admite como máximo 20 caracteres',
  })
  @Matches(/^SOC-[A-Z0-9]{4,12}$/i, {
    message: 'El código debe tener el formato SOC-XXXXXX (letras y números)',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  codigoReferencia?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(20, {
    message: 'La contraseña admite como máximo 20 caracteres',
  })
  @Matches(/^[\p{L}\p{N}\p{P}\p{S}]+$/u, {
    message:
      'La contraseña solo permite letras, números y caracteres especiales (sin emojis)',
  })
  password?: string;

  @IsOptional()
  @IsUUID('4', { message: 'cityId debe ser un UUID válido' })
  cityId?: string;
}
