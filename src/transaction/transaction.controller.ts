import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionService } from './transaction.service';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit')
  deposit(@Request() req, @Body() body: { accountId: number; amount: number }) {
    return this.transactionService.deposit(req.user.userId, body.accountId, body.amount);
  }

  @Post('withdraw')
  withdraw(@Request() req, @Body() body: { accountId: number; amount: number }) {
    return this.transactionService.withdraw(req.user.userId, body.accountId, body.amount);
  }

  @Post('transfer')
  transfer(@Request() req, @Body() body: { fromAccountId: number; toAccountId: number; amount: number }) {
    return this.transactionService.transfer(req.user.userId, body.fromAccountId, body.toAccountId, body.amount);
  }

  @Get()
  findAll(@Request() req) {
    return this.transactionService.getTransactions(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.transactionService.getTransactionById(req.user.userId, Number(id));
  }
}