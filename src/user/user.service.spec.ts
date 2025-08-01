import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should return user profile when user exists', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        createdAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserProfile(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserProfile(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const updateData = { name: 'Updated Name' };
      const mockUpdatedUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Updated Name',
        role: 'USER',
        createdAt: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await service.updateUserProfile(1, updateData);

      expect(result).toEqual(mockUpdatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users with account counts', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'user1@example.com',
          name: 'User 1',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { accounts: 2 },
        },
        {
          id: 2,
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'ADMIN',
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { accounts: 1 },
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
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
    });
  });

  describe('getUserById', () => {
    it('should return user with accounts and transactions when user exists', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        accounts: [
          {
            id: 1,
            balance: 1000,
            createdAt: new Date(),
            transactions: [
              {
                id: 1,
                type: 'DEPOSIT',
                amount: 1000,
                description: 'Initial deposit',
                createdAt: new Date(),
              },
            ],
          },
        ],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserById(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
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
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      const mockUpdatedUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN',
        createdAt: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await service.updateUserRole(1, 'ADMIN');

      expect(result).toEqual(mockUpdatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { role: 'ADMIN' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        accounts: [
          {
            id: 1,
            balance: 1000,
            transactions: [
              { id: 1, type: 'DEPOSIT', amount: 1000, description: 'Deposit' },
            ],
          },
          {
            id: 2,
            balance: 500,
            transactions: [
              { id: 2, type: 'WITHDRAW', amount: 200, description: 'Withdrawal' },
            ],
          },
        ],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserStats(1);

      expect(result).toEqual({
        userId: 1,
        name: 'Test User',
        email: 'test@example.com',
        accountCount: 2,
        totalBalance: 1500,
        totalTransactions: 2,
        accounts: [
          { id: 1, balance: 1000, transactionCount: 1 },
          { id: 2, balance: 500, transactionCount: 1 },
        ],
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserStats(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('searchUsers', () => {
    it('should return users matching search query', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'john@example.com',
          name: 'John Doe',
          role: 'USER',
          createdAt: new Date(),
          _count: { accounts: 1 },
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.searchUsers('john');

      expect(result).toEqual(mockUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'john', mode: 'insensitive' } },
            { email: { contains: 'john', mode: 'insensitive' } },
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
    });
  });

  describe('getUsersByRole', () => {
    it('should return users with specified role', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'admin1@example.com',
          name: 'Admin 1',
          role: 'ADMIN',
          createdAt: new Date(),
          _count: { accounts: 1 },
        },
        {
          id: 2,
          email: 'admin2@example.com',
          name: 'Admin 2',
          role: 'ADMIN',
          createdAt: new Date(),
          _count: { accounts: 2 },
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.getUsersByRole('ADMIN');

      expect(result).toEqual(mockUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: { role: 'ADMIN' },
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
    });
  });

  describe('deleteUser', () => {
    it('should delete user when no account balance', async () => {
      const mockUser = {
        id: 1,
        accounts: [
          { id: 1, balance: 0, transactions: [] },
        ],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.delete.mockResolvedValue({});

      const result = await service.deleteUser(1);

      expect(result).toEqual({ message: 'User deleted successfully' });
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw ForbiddenException when user has account balance', async () => {
      const mockUser = {
        id: 1,
        accounts: [
          { id: 1, balance: 1000, transactions: [] },
        ],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.deleteUser(1)).rejects.toThrow(ForbiddenException);
      expect(mockPrismaService.user.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.deleteUser(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserActivitySummary', () => {
    it('should return user activity summary', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        accounts: [
          {
            id: 1,
            balance: 1000,
            transactions: [
              {
                id: 1,
                type: 'DEPOSIT',
                amount: 1000,
                description: 'Deposit',
                createdAt: new Date(),
              },
            ],
          },
        ],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserActivitySummary(1);

      expect(result).toEqual({
        userId: 1,
        name: 'Test User',
        email: 'test@example.com',
        accountCount: 1,
        totalBalance: 1000,
        totalTransactions: 1,
        recentTransactions: [
          {
            id: 1,
            type: 'DEPOSIT',
            amount: 1000,
            description: 'Deposit',
            createdAt: expect.any(Date),
          },
        ],
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserActivitySummary(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('bulkUpdateUserRoles', () => {
    it('should update multiple user roles successfully', async () => {
      const updates = [
        { userId: 1, role: 'ADMIN' },
        { userId: 2, role: 'USER' },
      ];

      const mockUpdatedUser1 = {
        id: 1,
        email: 'user1@example.com',
        name: 'User 1',
        role: 'ADMIN',
        createdAt: new Date(),
      };

      const mockUpdatedUser2 = {
        id: 2,
        email: 'user2@example.com',
        name: 'User 2',
        role: 'USER',
        createdAt: new Date(),
      };

      mockPrismaService.user.update
        .mockResolvedValueOnce(mockUpdatedUser1)
        .mockResolvedValueOnce(mockUpdatedUser2);

      const result = await service.bulkUpdateUserRoles(updates);

      expect(result).toEqual([
        { userId: 1, success: true, user: mockUpdatedUser1 },
        { userId: 2, success: true, user: mockUpdatedUser2 },
      ]);
    });

    it('should handle partial failures in bulk update', async () => {
      const updates = [
        { userId: 1, role: 'ADMIN' },
        { userId: 999, role: 'USER' }, // Non-existent user
      ];

      const mockUpdatedUser = {
        id: 1,
        email: 'user1@example.com',
        name: 'User 1',
        role: 'ADMIN',
        createdAt: new Date(),
      };

      mockPrismaService.user.update
        .mockResolvedValueOnce(mockUpdatedUser)
        .mockRejectedValueOnce(new Error('User not found'));

      const result = await service.bulkUpdateUserRoles(updates);

      expect(result).toEqual([
        { userId: 1, success: true, user: mockUpdatedUser },
        { userId: 999, success: false, error: 'User not found' },
      ]);
    });
  });
});
