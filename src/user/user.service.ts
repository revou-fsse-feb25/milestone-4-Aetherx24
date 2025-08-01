import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Get user profile
  async getUserProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        email: true, 
        name: true, 
        role: true, 
        createdAt: true 
      },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  // Update user profile
  async updateUserProfile(userId: number, updateData: { name?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { 
        id: true, 
        email: true, 
        name: true, 
        role: true, 
        createdAt: true 
      },
    });
    
    return user;
  }

  // Get all users (admin only)
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            accounts: true,
          },
        },
      },
    });
  }

  // Get user by ID (admin only)
  async getUserById(id: number) {
    console.log('getUserById called with id:', id, typeof id);
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        accounts: {
          select: {
            id: true,
            balance: true,
            createdAt: true,
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
        },
      },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  // Update user role (admin only)
  async updateUserRole(id: number, role: string) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { role },
      select: { 
        id: true, 
        email: true, 
        name: true, 
        role: true, 
        createdAt: true 
      },
    });
    
    return user;
  }

  // NEW SERVICES - Additional functionality

  // Get user statistics
  async getUserStats(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          include: {
            transactions: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const totalBalance = user.accounts.reduce((sum, account) => sum + account.balance, 0);
    const totalTransactions = user.accounts.reduce((sum, account) => sum + account.transactions.length, 0);
    const accountCount = user.accounts.length;

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      accountCount,
      totalBalance,
      totalTransactions,
      accounts: user.accounts.map(account => ({
        id: account.id,
        balance: account.balance,
        transactionCount: account.transactions.length,
      })),
    };
  }

  // Search users (admin only)
  async searchUsers(query: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            accounts: true,
          },
        },
      },
    });
  }

  // Get users by role (admin only)
  async getUsersByRole(role: string) {
    return this.prisma.user.findMany({
      where: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            accounts: true,
          },
        },
      },
    });
  }

  // Delete user (admin only)
  async deleteUser(id: number) {
    console.log('deleteUser called with id:', id, typeof id);
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        accounts: {
          include: {
            transactions: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user has accounts with balance
    const hasBalance = user.accounts.some(account => account.balance > 0);
    if (hasBalance) {
      throw new ForbiddenException('Cannot delete user with account balance');
    }

    // Delete user and all related data
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }

  // Get user activity summary (admin only)
  async getUserActivitySummary(userId: number) {
    console.log('getUserActivitySummary called with userId:', userId, typeof userId);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' },
              take: 10, // Last 10 transactions
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const allTransactions = user.accounts.flatMap(account => account.transactions);
    const recentTransactions = allTransactions.slice(0, 10);

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      accountCount: user.accounts.length,
      totalBalance: user.accounts.reduce((sum, account) => sum + account.balance, 0),
      totalTransactions: allTransactions.length,
      recentTransactions: recentTransactions.map(tx => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        description: tx.description,
        createdAt: tx.createdAt,
      })),
    };
  }

  // Bulk update user roles (admin only)
  async bulkUpdateUserRoles(updates: Array<{ userId: number; role: string }>) {
    const results: Array<{
      userId: number;
      success: boolean;
      user?: any;
      error?: string;
    }> = [];

    for (const update of updates) {
      try {
        const user = await this.updateUserRole(update.userId, update.role);
        results.push({ userId: update.userId, success: true, user });
      } catch (error) {
        results.push({ 
          userId: update.userId, 
          success: false, 
          error: error.message 
        });
      }
    }

    return results;
  }
}
