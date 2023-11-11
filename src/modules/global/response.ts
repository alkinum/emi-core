import { ApiProperty } from '@nestjs/swagger';

export class Response<T> {
  @ApiProperty({ example: 0 })
  code: number;

  @ApiProperty({ example: '' })
  msg: string;

  @ApiProperty()
  data: T;
}
