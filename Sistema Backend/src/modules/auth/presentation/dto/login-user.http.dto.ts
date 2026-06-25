import { Transform } from 'class-transformer';
import { IsString, MinLength, ValidateIf } from 'class-validator';

export class LoginUserHttpDto {
  @ValidateIf((o: LoginUserHttpDto) => !o.email)
  @IsString()
  @MinLength(1, { message: 'El usuario es obligatorio' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  usuario?: string;

  @ValidateIf((o: LoginUserHttpDto) => !o.usuario)
  @IsString()
  @MinLength(1, { message: 'El correo es obligatorio' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  email?: string;

  @IsString()
  @MinLength(1, { message: 'La contraseña es obligatoria' })
  password!: string;
}
