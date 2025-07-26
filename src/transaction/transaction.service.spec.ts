import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    account: {
      findFirst: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deposit', () => {
    it('should deposit money to an account', async () => {
      const userId = 1;
      const accountId = 1;
      const amount = 500;

      const account = {
        id: accountId,
        userId,
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const transaction = {
        id: 1,
        accountId,
        type: 'DEPOSIT',
        amount,
        description: 'Deposit',
        createdAt: new Date(),
      };

      mockPrismaService.account.findFirst.mockResolvedValue(account);
      mockPrismaService.account.update.mockResolvedValue({});
      mockPrismaService.transaction.create.mockResolvedValue(transaction);

      const result = await service.deposit(userId, accountId, amount);

      expect(mockPrismaService.account.findFirst).toHaveBeenCalledWith({
        where: { id: accountId, userId },
      });
      expect(mockPrismaService.account.update).toHaveBeenCalledWith({
        where: { id: accountId },
        data: { balance: { increment: amount } },
      });
      expect(mockPrismaService.transaction.create).toHaveBeenCalledWith({
        data: {
          accountId,
          type: 'DEPOSIT',
          amount,
          description: 'Deposit',
        },
      });
      expect(result).toEqual(transaction);
    });

    it('should throw error if account not found', async () => {
      const userId = 1;
      const accountId = 1;
      const amount = 500;

      mockPrismaService.account.findFirst.mockResolvedValue(null);

      await expect(service.deposit(userId, accountId, amount)).rejects.toThrow(
        'Account not found',
      );
    });
  });

  describe('withdraw', () => {
    it('should withdraw money from an account', async () => {
      const userId = 1;
      const accountId = 1;
      const amount = 200;

      const account = {
        id: accountId,
        userId,
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const transaction = {
        id: 1,
        accountId,
        type: 'WITHDRAW',
        amount,
        description: 'Withdraw',
        createdAt: new Date(),
      };

      mockPrismaService.account.findFirst.mockResolvedValue(account);
      mockPrismaService.account.update.mockResolvedValue({});
      mockPrismaService.transaction.create.mockResolvedValue(transaction);

      const result = await service.withdraw(userId, accountId, amount);

      expect(mockPrismaService.account.findFirst).toHaveBeenCalledWith({
        where: { id: accountId, userId },
      });
      expect(mockPrismaService.account.update).toHaveBeenCalledWith({
        where: { id: accountId },
        data: { balance: { decrement: amount } },
      });
      expect(mockPrismaService.transaction.create).toHaveBeenCalledWith({
        data: {
          accountId,
          type: 'WITHDRAW',
          amount,
          description: 'Withdraw',
        },
      });
      expect(result).toEqual(transaction);
    });

    it('should throw error if insufficient funds', async () => {
      const userId = 1;
      const accountId = 1;
      const amount = 2000;

      const account = {
        id: accountId,
        userId,
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.account.findFirst.mockResolvedValue(account);

      await expect(service.withdraw(userId, accountId, amount)).rejects.toThrow(
        'Insufficient funds',
      );
    });
  });

  describe('transfer', () => {
    it('should transfer money between accounts', async () => {
      const userId = 1;
      const fromAccountId = 1;
      const toAccountId = 2;
      const amount = 100;

      const fromAccount = {
        id: fromAccountId,
        userId,
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const toAccount = {
        id: toAccountId,
        userId: 2,
        balance: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const transaction = {
        id: 1,
        accountId: toAccountId,
        type: 'TRANSFER',
        amount,
        description: `Transfer from account ${fromAccountId}`,
        createdAt: new Date(),
      };

      mockPrismaService.account.findFirst.mockResolvedValue(fromAccount);
      mockPrismaService.account.findUnique.mockResolvedValue(toAccount);
      mockPrismaService.account.update.mockResolvedValue({});
      mockPrismaService.transaction.create.mockResolvedValue(transaction);

      const result = await service.transfer(userId, fromAccountId, toAccountId, amount);

      expect(mockPrismaService.account.findFirst).toHaveBeenCalledWith({
        where: { id: fromAccountId, userId },
      });
      expect(mockPrismaService.account.findUnique).toHaveBeenCalledWith({
        where: { id: toAccountId },
      });
      expect(result).toEqual(transaction);
    });
  });

  describe('getTransactions', () => {
    it('should return all transactions for a user', async () => {
      const userId = 1;

      const transactions = [
        {
          id: 1,
          accountId: 1,
          type: 'DEPOSIT',
          amount: 500,
          description: 'Deposit',
          createdAt: new Date(),
          account: {
            id: 1,
            userId,
            balance: 1000,
          },
        },
      ];

      mockPrismaService.transaction.findMany.mockResolvedValue(transactions);

      const result = await service.getTransactions(userId);

      expect(mockPrismaService.transaction.findMany).toHaveBeenCalledWith({
        where: {
          account: { userId },
        },
        include: { account: true },
      });
      expect(result).toEqual(transactions);
    });
  });

  describe('getTransactionById', () => {
    it('should return a specific transaction', async () => {
      const userId = 1;
      const transactionId = 1;

      const transaction = {
        id: transactionId,
        accountId: 1,
        type: 'DEPOSIT',
        amount: 500,
        description: 'Deposit',
        createdAt: new Date(),
        account: {
          id: 1,
          userId,
          balance: 1000,
        },
      };

      mockPrismaService.transaction.findFirst.mockResolvedValue(transaction);

      const result = await service.getTransactionById(userId, transactionId);

      expect(mockPrismaService.transaction.findFirst).toHaveBeenCalledWith({
        where: {
          id: transactionId,
          account: { userId },
        },
        include: { account: true },
      });
      expect(result).toEqual(transaction);
    });
  });
});
