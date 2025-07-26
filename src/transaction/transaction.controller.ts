import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionService } from './transaction.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit money to an account' })
  @ApiBody({ type: DepositDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Deposit successful',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        accountId: { type: 'number', example: 1 },
        type: { type: 'string', example: 'DEPOSIT' },
        amount: { type: 'number', example: 500 },
        description: { type: 'string', example: 'Deposit' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  deposit(@Request() req, @Body() body: DepositDto) {
    return this.transactionService.deposit(req.user.userId, body.accountId, body.amount);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw money from an account' })
  @ApiBody({ type: WithdrawDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Withdrawal successful',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        accountId: { type: 'number', example: 1 },
        type: { type: 'string', example: 'WITHDRAW' },
        amount: { type: 'number', example: 200 },
        description: { type: 'string', example: 'Withdraw' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 400, description: 'Insufficient funds' })
  withdraw(@Request() req, @Body() body: WithdrawDto) {
    return this.transactionService.withdraw(req.user.userId, body.accountId, body.amount);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer money between accounts' })
  @ApiBody({ type: TransferDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Transfer successful',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        accountId: { type: 'number', example: 2 },
        type: { type: 'string', example: 'TRANSFER' },
        amount: { type: 'number', example: 100 },
        description: { type: 'string', example: 'Transfer from account 1' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 400, description: 'Insufficient funds' })
  transfer(@Request() req, @Body() body: TransferDto) {
    return this.transactionService.transfer(req.user.userId, body.fromAccountId, body.toAccountId, body.amount);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user transactions' })
  @ApiResponse({ 
    status: 200, 
    description: 'Transactions retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          accountId: { type: 'number', example: 1 },
          type: { type: 'string', example: 'DEPOSIT' },
          amount: { type: 'number', example: 500 },
          description: { type: 'string', example: 'Deposit' },
          createdAt: { type: 'string', format: 'date-time' },
          account: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              userId: { type: 'number', example: 1 },
              balance: { type: 'number', example: 1000 },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    return this.transactionService.getTransactions(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific transaction' })
  @ApiParam({ name: 'id', description: 'Transaction ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Transaction retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        accountId: { type: 'number', example: 1 },
        type: { type: 'string', example: 'DEPOSIT' },
        amount: { type: 'number', example: 500 },
        description: { type: 'string', example: 'Deposit' },
        createdAt: { type: 'string', format: 'date-time' },
        account: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            userId: { type: 'number', example: 1 },
            balance: { type: 'number', example: 1000 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.transactionService.getTransactionById(req.user.userId, Number(id));
  }
}