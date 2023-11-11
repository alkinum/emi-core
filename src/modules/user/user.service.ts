import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async refreshToken(refreshToken: string): Promise<UserTokens | null> {
    const user = await this.usersRepository.findOne({
      where: { refreshToken },
    });

    if (!user) {
      return null;
    }

    // 验证 refreshToken 是否有效（这里需要实现 JWT 验证逻辑）
    // 如果有效，生成新的 accessToken
    const newPayload = { email: user.email, sub: user.id };
    const newAccessToken = await this.jwtService.signAsync(newPayload);
    const newRefreshToken = await this.jwtService.signAsync(newPayload, {
      expiresIn: '14d',
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
