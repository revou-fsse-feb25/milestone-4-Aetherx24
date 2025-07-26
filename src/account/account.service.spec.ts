import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AccountService', () => {
  let service: AccountService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    account: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    it('should create a new account', async () => {
      const userId = 1;
      const initialBalance = 1000;

      const createdAccount = {
        id: 1,
        userId,
        balance: initialBalance,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.account.create.mockResolvedValue(createdAccount);

      const result = await service.createAccount(userId, initialBalance);

      expect(mockPrismaService.account.create).toHaveBeenCalledWith({
        data: {
          userId,
          balance: initialBalance,
        },
      });
      expect(result).toEqual(createdAccount);
    });
  });

  describe('getAccounts', () => {
    it('should return all accounts for a user', async () => {
      const userId = 1;

      const accounts = [
        {
          id: 1,
          userId,
          balance: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          userId,
          balance: 2000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.account.findMany.mockResolvedValue(accounts);

      const result = await service.getAccounts(userId);

      expect(mockPrismaService.account.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual(accounts);
    });
  });

  describe('getAccountById', () => {
    it('should return a specific account for a user', async () => {
      const userId = 1;
      const accountId = 1;

      const account = {
        id: accountId,
        userId,
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.account.findFirst.mockResolvedValue(account);

      const result = await service.getAccountById(userId, accountId);

      expect(mockPrismaService.account.findFirst).toHaveBeenCalledWith({
        where: { id: accountId, userId },
      });
      expect(result).toEqual(account);
    });
  });

  describe('updateAccount', () => {
    it('should update an account', async () => {
      const userId = 1;
      const accountId = 1;
      const updateData = { balance: 2000 };

      const updateResult = { count: 1 };

      mockPrismaService.account.updateMany.mockResolvedValue(updateResult);

      const result = await service.updateAccount(userId, accountId, updateData);

      expect(mockPrismaService.account.updateMany).toHaveBeenCalledWith({
        where: { id: accountId, userId },
        data: updateData,
      });
      expect(result).toEqual(updateResult);
    });
  });

  describe('deleteAccount', () => {
    it('should delete an account', async () => {
      const userId = 1;
      const accountId = 1;

      const deleteResult = { count: 1 };

      mockPrismaService.account.deleteMany.mockResolvedValue(deleteResult);

      const result = await service.deleteAccount(userId, accountId);

      expect(mockPrismaService.account.deleteMany).toHaveBeenCalledWith({
        where: { id: accountId, userId },
      });
      expect(result).toEqual(deleteResult);
    });
  });
});
