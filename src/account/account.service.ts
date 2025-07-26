import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
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

  async getAccounts(userId: number, userRole: string) {
    if (userRole === 'ADMIN') {
      // Admins can see all accounts
      return this.prisma.account.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });
    } else {
      // Users can only see their own accounts
      return this.prisma.account.findMany({
        where: { userId },
      });
    }
  }

  async getAccountById(userId: number, accountId: number, userRole: string) {
    if (userRole === 'ADMIN') {
      // Admins can access any account
      const account = await this.prisma.account.findUnique({
        where: { id: accountId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });
      if (!account) {
        throw new NotFoundException('Account not found');
      }
      return account;
    } else {
      // Users can only access their own accounts
      const account = await this.prisma.account.findFirst({
        where: { id: accountId, userId },
      });
      if (!account) {
        throw new NotFoundException('Account not found');
      }
      return account;
    }
  }

  async updateAccount(userId: number, accountId: number, data: { balance?: number }, userRole: string) {
    if (userRole === 'ADMIN') {
      // Admins can update any account
      const account = await this.prisma.account.findUnique({
        where: { id: accountId },
      });
      if (!account) {
        throw new NotFoundException('Account not found');
      }
      return this.prisma.account.update({
        where: { id: accountId },
        data,
      });
    } else {
      // Users can only update their own accounts
      const account = await this.prisma.account.findFirst({
        where: { id: accountId, userId },
      });
      if (!account) {
        throw new NotFoundException('Account not found');
      }
      return this.prisma.account.update({
        where: { id: accountId },
        data,
      });
    }
  }

  async deleteAccount(userId: number, accountId: number, userRole: string) {
    if (userRole === 'ADMIN') {
      // Admins can delete any account
      const account = await this.prisma.account.findUnique({
        where: { id: accountId },
      });
      if (!account) {
        throw new NotFoundException('Account not found');
      }
      return this.prisma.account.delete({
        where: { id: accountId },
      });
    } else {
      // Users can only delete their own accounts
      const account = await this.prisma.account.findFirst({
        where: { id: accountId, userId },
      });
      if (!account) {
        throw new NotFoundException('Account not found');
      }
      return this.prisma.account.delete({
        where: { id: accountId },
      });
    }
  }

  // Admin-only methods
  async getAllAccountsForAdmin() {
    return this.prisma.account.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
        transactions: {
          select: {
            id: true,
            type: true,
            amount: true,
            description: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async createAccountForUser(userId: number, initialBalance: number) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.account.create({
      data: {
        userId,
        balance: initialBalance,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }
}