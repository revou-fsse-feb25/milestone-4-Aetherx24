import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

describe('AccountController', () => {
  let controller: AccountController;
  let accountService: AccountService;

  const mockAccountService = {
    createAccount: jest.fn(),
    getAccounts: jest.fn(),
    getAccountById: jest.fn(),
    updateAccount: jest.fn(),
    deleteAccount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: mockAccountService,
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    accountService = module.get<AccountService>(AccountService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new account', async () => {
      const req = {
        user: { userId: 1 },
      };

      const body = { initialBalance: 1000 };

      const createdAccount = {
        id: 1,
        userId: req.user.userId,
        balance: body.initialBalance,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAccountService.createAccount.mockResolvedValue(createdAccount);

      const result = await controller.create(req, body);

      expect(accountService.createAccount).toHaveBeenCalledWith(
        req.user.userId,
        body.initialBalance,
      );
      expect(result).toEqual(createdAccount);
    });
  });

  describe('findAll', () => {
    it('should return all accounts for a user', async () => {
      const req = {
        user: { userId: 1 },
      };

      const accounts = [
        {
          id: 1,
          userId: req.user.userId,
          balance: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          userId: req.user.userId,
          balance: 2000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockAccountService.getAccounts.mockResolvedValue(accounts);

      const result = await controller.findAll(req);

      expect(accountService.getAccounts).toHaveBeenCalledWith(req.user.userId);
      expect(result).toEqual(accounts);
    });
  });

  describe('findOne', () => {
    it('should return a specific account', async () => {
      const req = {
        user: { userId: 1 },
      };

      const accountId = '1';

      const account = {
        id: 1,
        userId: req.user.userId,
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAccountService.getAccountById.mockResolvedValue(account);

      const result = await controller.findOne(req, accountId);

      expect(accountService.getAccountById).toHaveBeenCalledWith(
        req.user.userId,
        Number(accountId),
      );
      expect(result).toEqual(account);
    });
  });

  describe('update', () => {
    it('should update an account', async () => {
      const req = {
        user: { userId: 1 },
      };

      const accountId = '1';
      const body = { balance: 2000 };

      const updateResult = { count: 1 };

      mockAccountService.updateAccount.mockResolvedValue(updateResult);

      const result = await controller.update(req, accountId, body);

      expect(accountService.updateAccount).toHaveBeenCalledWith(
        req.user.userId,
        Number(accountId),
        body,
      );
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should delete an account', async () => {
      const req = {
        user: { userId: 1 },
      };

      const accountId = '1';

      const deleteResult = { count: 1 };

      mockAccountService.deleteAccount.mockResolvedValue(deleteResult);

      const result = await controller.remove(req, accountId);

      expect(accountService.deleteAccount).toHaveBeenCalledWith(
        req.user.userId,
        Number(accountId),
      );
      expect(result).toEqual(deleteResult);
    });
  });
});
