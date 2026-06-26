import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateRoleHttpDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name!: string;

  @IsString()
  @MinLength(2, { message: 'El código debe tener al menos 2 caracteres' })
  @Matches(/^[A-Za-z0-9_]+$/, {
    message: 'codeRole solo permite letras, números y guion bajo',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  codeRole!: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() || undefined : value,
  )
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
