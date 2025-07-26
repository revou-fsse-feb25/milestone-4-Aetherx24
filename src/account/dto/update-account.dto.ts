import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountDto {
  @ApiProperty({
    description: 'New balance for the account',
    example: 2000,
    minimum: 0,
    required: false,
  })
  balance?: number;
} 