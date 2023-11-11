import { IsString } from 'class-validator';

export class RevokeApiKeyDto {
  @IsString()
  apiKey: string;
}
