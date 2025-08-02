import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserIdDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @IsNumberString()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  id: string;
} 