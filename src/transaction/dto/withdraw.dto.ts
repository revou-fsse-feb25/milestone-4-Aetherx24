import { ApiProperty } from '@nestjs/swagger';

export class WithdrawDto {
  @ApiProperty({
    description: 'Account ID to withdraw from',
    example: 1,
  })
  accountId: number;

  @ApiProperty({
    description: 'Amount to withdraw',
    example: 200,
    minimum: 0.01,
  })
  amount: number;
} 