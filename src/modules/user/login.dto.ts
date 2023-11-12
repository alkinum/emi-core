import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  t_token: string;
}
