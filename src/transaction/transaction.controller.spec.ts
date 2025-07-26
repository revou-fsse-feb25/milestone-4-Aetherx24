import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionService: TransactionService;

  const mockTransactionService = {
    deposit: jest.fn(),
    withdraw: jest.fn(),
    transfer: jest.fn(),
    getTransactions: jest.fn(),
    getTransactionById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deposit', () => {
    it('should deposit money to an account', async () => {
      const req = {
        user: { userId: 1 },
      };

      const body = { accountId: 1, amount: 500 };

      const transaction = {
        id: 1,
        accountId: body.accountId,
        type: 'DEPOSIT',
        amount: body.amount,
        description: 'Deposit',
        createdAt: new Date(),
      };

      mockTransactionService.deposit.mockResolvedValue(transaction);

      const result = await controller.deposit(req, body);

      expect(transactionService.deposit).toHaveBeenCalledWith(
        req.user.userId,
        body.accountId,
        body.amount,
      );
      expect(result).toEqual(transaction);
    });
  });

  describe('withdraw', () => {
    it('should withdraw money from an account', async () => {
      const req = {
        user: { userId: 1 },
      };

      const body = { accountId: 1, amount: 200 };

      const transaction = {
        id: 1,
        accountId: body.accountId,
        type: 'WITHDRAW',
        amount: body.amount,
        description: 'Withdraw',
        createdAt: new Date(),
      };

      mockTransactionService.withdraw.mockResolvedValue(transaction);

      const result = await controller.withdraw(req, body);

      expect(transactionService.withdraw).toHaveBeenCalledWith(
        req.user.userId,
        body.accountId,
        body.amount,
      );
      expect(result).toEqual(transaction);
    });
  });

  describe('transfer', () => {
    it('should transfer money between accounts', async () => {
      const req = {
        user: { userId: 1 },
      };

      const body = { fromAccountId: 1, toAccountId: 2, amount: 100 };

      const transaction = {
        id: 1,
        accountId: body.toAccountId,
        type: 'TRANSFER',
        amount: body.amount,
        description: `Transfer from account ${body.fromAccountId}`,
        createdAt: new Date(),
      };

      mockTransactionService.transfer.mockResolvedValue(transaction);

      const result = await controller.transfer(req, body);

      expect(transactionService.transfer).toHaveBeenCalledWith(
        req.user.userId,
        body.fromAccountId,
        body.toAccountId,
        body.amount,
      );
      expect(result).toEqual(transaction);
    });
  });

  describe('findAll', () => {
    it('should return all transactions for a user', async () => {
      const req = {
        user: { userId: 1 },
      };

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
            userId: req.user.userId,
            balance: 1000,
          },
        },
      ];

      mockTransactionService.getTransactions.mockResolvedValue(transactions);

      const result = await controller.findAll(req);

      expect(transactionService.getTransactions).toHaveBeenCalledWith(req.user.userId);
      expect(result).toEqual(transactions);
    });
  });

  describe('findOne', () => {
    it('should return a specific transaction', async () => {
      const req = {
        user: { userId: 1 },
      };

      const transactionId = '1';

      const transaction = {
        id: 1,
        accountId: 1,
        type: 'DEPOSIT',
        amount: 500,
        description: 'Deposit',
        createdAt: new Date(),
        account: {
          id: 1,
          userId: req.user.userId,
          balance: 1000,
        },
      };

      mockTransactionService.getTransactionById.mockResolvedValue(transaction);

      const result = await controller.findOne(req, transactionId);

      expect(transactionService.getTransactionById).toHaveBeenCalledWith(
        req.user.userId,
        Number(transactionId),
      );
      expect(result).toEqual(transaction);
    });
  });
});
