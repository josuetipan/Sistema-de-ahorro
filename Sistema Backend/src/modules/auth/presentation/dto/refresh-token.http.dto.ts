import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenHttpDto {
  @IsString()
  @IsNotEmpty({ message: 'refreshToken es obligatorio' })
  refreshToken!: string;
}
