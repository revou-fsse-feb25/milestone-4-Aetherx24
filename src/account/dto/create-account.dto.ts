import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Initial balance for the account',
    example: 1000,
    minimum: 0,
  })
  initialBalance: number;
} 