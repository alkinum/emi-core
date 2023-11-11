import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';

import { TurnstileService } from './turnstile.service';

interface TurnstileRequest extends FastifyRequest {
  body: {
    t_token?: string;
  };
}

@Injectable()
export class TurnstileGuard implements CanActivate {
  constructor(private turnstileService: TurnstileService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<TurnstileRequest>();
    // the key of the token should be t_token
    const token = request.body.t_token;

    if (!token) {
      throw new UnauthorizedException('验证码信息错误，请重试 (Token missing)');
    }

    return this.turnstileService.verifyToken(token).then((isValid) => {
      if (!isValid) {
        throw new UnauthorizedException(
          '验证码信息错误，请重试 (Invalid token)',
        );
      }
      return true;
    });
  }
}
