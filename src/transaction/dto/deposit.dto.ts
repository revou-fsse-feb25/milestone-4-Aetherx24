import { ApiProperty } from '@nestjs/swagger';

export class DepositDto {
  @ApiProperty({
    description: 'Account ID to deposit to',
    example: 1,
  })
  accountId: number;

  @ApiProperty({
    description: 'Amount to deposit',
    example: 500,
    minimum: 0.01,
  })
  amount: number;
} 