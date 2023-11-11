import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UserProfileDto {
  @IsString()
  @MaxLength(5000)
  @ApiProperty({
    description:
      'A pure JSON string which contains the profile of the user, it will be merged into the stored profile in the database. The max length of the JSON string that Emi can submit is 1000.',
  })
  userProfile: string;
}
