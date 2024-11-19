import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from '../../users/dto/login-user.dto';
import { RegisterUserDto } from '../../users/dto/register-user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    validateUser: jest.fn(),
    getUserByEmail: jest.fn(),
  };

  const mockUsersService = {
    findUserByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const registerUserDto: RegisterUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const result = { access_token: 'your.jwt.token.here' };

      // Mock services
      usersService.findUserByEmail = jest.fn().mockResolvedValue(null); // No existing user
      authService.register = jest.fn().mockResolvedValue(result);

      const response = await authController.register(registerUserDto);

      expect(response).toEqual(result);
      expect(usersService.findUserByEmail).toHaveBeenCalledWith(registerUserDto.email);
      expect(authService.register).toHaveBeenCalledWith(
        registerUserDto.name,
        registerUserDto.email,
        registerUserDto.password,
      );
    });

    it('should throw BadRequestException if email exists', async () => {
      const registerUserDto: RegisterUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      // Mock services
      usersService.findUserByEmail = jest.fn().mockResolvedValue({}); // Simulate existing user

      await expect(authController.register(registerUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should successfully login and return JWT token', async () => {
      const loginUserDto: LoginUserDto = { email: 'john.doe@example.com', password: 'password123' };

      const result = { access_token: 'your.jwt.token.here' };

      // Mock services
      authService.validateUser = jest.fn().mockResolvedValue({}); // Valid user
      authService.login = jest.fn().mockResolvedValue(result);

      const response = await authController.login(loginUserDto);

      expect(response).toEqual(result);
      expect(authService.validateUser).toHaveBeenCalledWith(loginUserDto.email, loginUserDto.password);
      expect(authService.login).toHaveBeenCalledWith(loginUserDto.email, loginUserDto.password);
    });

    it('should throw UnauthorizedException if user is invalid', async () => {
      const loginUserDto: LoginUserDto = { email: 'john.doe@example.com', password: 'wrongpassword' };

      // Mock services
      authService.validateUser = jest.fn().mockResolvedValue(null); // Invalid user

      await expect(authController.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return user profile successfully', async () => {
      const user = { id: '123456', email: 'john.doe@example.com', name: 'John Doe' };

      const req = { user: { email: 'john.doe@example.com' } };

      // Mock services
      authService.getUserByEmail = jest.fn().mockResolvedValue(user);

      const response = await authController.getProfile(req);

      expect(response).toEqual(user);
      expect(authService.getUserByEmail).toHaveBeenCalledWith(req.user.email);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const req = { user: { email: 'john.doe@example.com' } };

      // Mock services
      authService.getUserByEmail = jest.fn().mockResolvedValue(null); // User not found

      await expect(authController.getProfile(req)).rejects.toThrow(UnauthorizedException);
    });
  });
});
