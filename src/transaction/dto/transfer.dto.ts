import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty({
    description: 'Source account ID',
    example: 1,
  })
  fromAccountId: number;

  @ApiProperty({
    description: 'Destination account ID',
    example: 2,
  })
  toAccountId: number;

  @ApiProperty({
    description: 'Amount to transfer',
    example: 100,
    minimum: 0.01,
  })
  amount: number;
} 