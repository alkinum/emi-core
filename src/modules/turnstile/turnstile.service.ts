import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TurnstileService {
  constructor(private httpService: HttpService) {}

  async verifyToken(token: string): Promise<boolean> {
    const response = await lastValueFrom(
      this.httpService.post(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
        },
      ),
    );

    return response.data.success;
  }
}
