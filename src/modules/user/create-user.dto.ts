import { IsString, IsEmail, Length } from 'class-validator';

// import { IsSameAs } from '@/decorators/is-same-as';

export class CreateUserDto {
  @IsEmail()
  @Length(5, 100)
  email: string;

  @IsString()
  @Length(64)
  password: string;

  @IsString()
  @Length(64)
  // @IsSameAs('password', { message: 'Passwords are not same.' })
  confirmPassword: string;

  @IsString()
  t_token: string;
}
