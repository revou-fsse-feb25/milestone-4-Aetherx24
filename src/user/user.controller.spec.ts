import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';

describe('UserController', () => {
  let controller: UserController;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const req = {
        user: { userId: 1 },
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        createdAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await controller.getProfile(req);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: req.user.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
      expect(result).toEqual(user);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const req = {
        user: { userId: 1 },
      };

      const body = { name: 'Updated Name' };

      const updatedUser = {
        id: 1,
        email: 'test@example.com',
        name: body.name,
        role: 'USER',
        createdAt: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(req, body);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: req.user.userId },
        data: { name: body.name },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
      expect(result).toEqual(updatedUser);
    });
  });
});
