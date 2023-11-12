import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TurnstileService {
  private logger: Logger;

  constructor(private httpService: HttpService) {
    this.logger = new Logger('turnstile');
  }

  async verifyToken(token: string): Promise<boolean> {
    this.logger.debug('Turnstile token:' + token);

    const response = await lastValueFrom(
      this.httpService.post(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
        },
      ),
    );

    this.logger.debug(
      'Turnstile service response:' + JSON.stringify(response.data),
    );

    return response.data.success;
  }
}
