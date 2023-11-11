import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { TurnstileGuard } from '../turnstile/turnstile.guard';

import { CreateUserDto } from './create-user.dto';
import { LoginUserDto } from './login.dto';
import { RefreshTokenDto } from './refresh-token.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  @UseGuards(TurnstileGuard)
  @ApiExcludeEndpoint()
  async register(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<User> {
    const user = new User();

    user.nickname = createUserDto.nickname;
    user.password = createUserDto.password;
    user.email = createUserDto.email;

    return this.userService.createUser(user);
  }

  @Post('login')
  @UseGuards(TurnstileGuard)
  @ApiExcludeEndpoint()
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('登录信息错误，请检查后重试');
    }

    const payload = { username: user.email, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '14d',
    });

    user.refreshToken = refreshToken;
    await this.userService.saveUser(user);

    return {
      access_token: accessToken,
      refreshToken,
    };
  }

  @Post('refresh-token')
  @UseGuards(JwtAuthGuard)
  @ApiExcludeEndpoint()
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<any> {
    const { refreshToken } = refreshTokenDto;
    const newTokens = await this.userService.refreshToken(refreshToken);

    if (!newTokens) {
      throw new UnauthorizedException('无效的刷新令牌');
    }

    return newTokens;
  }
}
