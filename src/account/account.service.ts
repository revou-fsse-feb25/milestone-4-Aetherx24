import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async createAccount(userId: number, initialBalance: number) {
    return this.prisma.account.create({
      data: {
        userId,
        balance: initialBalance,
      },
    });
  }

  async getAccounts(userId: number) {
    return this.prisma.account.findMany({
      where: { userId },
    });
  }

  async getAccountById(userId: number, accountId: number) {
    return this.prisma.account.findFirst({
      where: { id: accountId, userId },
    });
  }

  async updateAccount(userId: number, accountId: number, data: { balance?: number }) {
    return this.prisma.account.updateMany({
      where: { id: accountId, userId },
      data,
    });
  }

  async deleteAccount(userId: number, accountId: number) {
    return this.prisma.account.deleteMany({
      where: { id: accountId, userId },
    });
  }
}