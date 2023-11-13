import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserJwtPayload } from '../auth/jwt.strategy';

import { User } from './user.entity';

import { hashPassword } from '@/utils/hash';

export interface UserTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private jwtService: JwtService,
  ) {}

  async createUser(user: User): Promise<User> {
    user.password = hashPassword(user.password);
    return this.usersRepository.save(user);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async isEmailRegistered(email: string): Promise<boolean> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    return !!existingUser;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && user.password === hashPassword(password)) {
      return user;
    }
    return undefined;
  }

  async saveUser(user: User) {
    return await this.usersRepository.save(user);
  }

  async refreshToken(
    accessToken: string,
    refreshToken: string,
  ): Promise<UserTokens | null> {
    let res: UserJwtPayload | undefined;
    try {
      res = await this.jwtService.verifyAsync<UserJwtPayload>(accessToken, {
        ignoreExpiration: true,
      });
    } catch (error) {
      throw new UnauthorizedException('无效的令牌');
    }
    if (!res?.sub) {
      throw new UnauthorizedException('无效的令牌');
    }

    const user = await this.usersRepository.findOne({
      where: { id: res.sub },
    });

    if (!user) {
      throw new UnauthorizedException('无效的令牌');
    }

    if (user.refreshToken !== refreshToken) {
      throw new Error('无效的刷新令牌');
    }

    // 验证 refreshToken 是否有效（这里需要实现 JWT 验证逻辑）
    // 如果有效，生成新的 accessToken
    const newPayload = { email: user.email, sub: user.id };
    const newAccessToken = await this.jwtService.signAsync(newPayload);
    const newRefreshToken = await this.jwtService.signAsync(newPayload, {
      expiresIn: '14d',
    });

    user.refreshToken = newRefreshToken;
    await this.usersRepository.save(user);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
