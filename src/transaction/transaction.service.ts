import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async deposit(userId: number, accountId: number, amount: number) {
    // Ensure account belongs to user
    const account = await this.prisma.account.findFirst({ where: { id: accountId, userId } });
    if (!account) throw new Error('Account not found');

    await this.prisma.account.update({
      where: { id: accountId },
      data: { balance: { increment: amount } },
    });

    return this.prisma.transaction.create({
      data: {
        accountId,
        type: 'DEPOSIT',
        amount,
        description: 'Deposit',
      },
    });
  }

  async withdraw(userId: number, accountId: number, amount: number) {
    const account = await this.prisma.account.findFirst({ where: { id: accountId, userId } });
    if (!account) throw new Error('Account not found');
    if (account.balance < amount) throw new Error('Insufficient funds');

    await this.prisma.account.update({
      where: { id: accountId },
      data: { balance: { decrement: amount } },
    });

    return this.prisma.transaction.create({
      data: {
        accountId,
        type: 'WITHDRAW',
        amount,
        description: 'Withdraw',
      },
    });
  }

  async transfer(userId: number, fromAccountId: number, toAccountId: number, amount: number) {
    const fromAccount = await this.prisma.account.findFirst({ where: { id: fromAccountId, userId } });
    const toAccount = await this.prisma.account.findUnique({ where: { id: toAccountId } });
    if (!fromAccount || !toAccount) throw new Error('Account not found');
    if (fromAccount.balance < amount) throw new Error('Insufficient funds');

    await this.prisma.account.update({
      where: { id: fromAccountId },
      data: { balance: { decrement: amount } },
    });
    await this.prisma.account.update({
      where: { id: toAccountId },
      data: { balance: { increment: amount } },
    });

    await this.prisma.transaction.create({
      data: {
        accountId: fromAccountId,
        type: 'TRANSFER',
        amount,
        description: `Transfer to account ${toAccountId}`,
      },
    });

    return this.prisma.transaction.create({
      data: {
        accountId: toAccountId,
        type: 'TRANSFER',
        amount,
        description: `Transfer from account ${fromAccountId}`,
      },
    });
  }

  async getTransactions(userId: number) {
    return this.prisma.transaction.findMany({
      where: {
        account: { userId },
      },
      include: { account: true },
    });
  }

  async getTransactionById(userId: number, transactionId: number) {
    return this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        account: { userId },
      },
      include: { account: true },
    });
  }
}