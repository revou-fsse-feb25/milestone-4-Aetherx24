import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      const registerData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const hashedPassword = 'hashedPassword';
      const createdUser = {
        id: 1,
        email: registerData.email,
        name: registerData.name,
        password: hashedPassword,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.register(registerData);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerData.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerData.email,
          password: hashedPassword,
          name: registerData.name,
        },
      });
      expect(result).toEqual({
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
      });
    });
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = {
        id: 1,
        email,
        password: 'hashedPassword',
        name: 'Test User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = {
        id: 1,
        email,
        password: 'hashedPassword',
        name: 'Test User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: 1,
        email: loginData.email,
        password: 'hashedPassword',
        name: 'Test User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const token = 'jwt-token';

      jest.spyOn(service, 'validateUser').mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(loginData);

      expect(service.validateUser).toHaveBeenCalledWith(
        loginData.email,
        loginData.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
      expect(result).toEqual({ access_token: token });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
