import { Test } from '@nestjs/testing';
import { UsersController } from '../user.controller';
import { UsersService } from '../user.service';
import { successResponse, errorResponse } from '../../common/response.helper';
import { UserResultDto } from '../dto/user.dto';
import { UpdateUserDto } from 'users/dto/update-user.dto';

describe('UsersController', () => {
  let usersService: UsersService;
  let usersController: UsersController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            // Mocking UsersService methods
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Mocked result
      const users: UserResultDto[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
        {
          id: '2',
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
        },
      ];

      jest.spyOn(usersService, 'findAll').mockResolvedValue(users);

      const result = await usersController.findAll();
      expect(result).toEqual(successResponse('Get all user', users));
      expect(usersService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a user successfully', async () => {
      const user: UserResultDto = { id: '1', name: 'John Doe', email: 'john@example.com' };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      const result = await usersController.findOne('1');
      expect(result).toEqual(successResponse('User successfully retrieved.', user));
    });

    it('should return an error if the user does not exist', async () => {
      jest.spyOn(usersService, 'findOne').mockRejectedValue(new Error('User not found'))

      const result = await usersController.findOne('5');
      expect(result).toEqual(errorResponse('Failed to retrieve user', 'User not found'));
    });

    it('should handle unexpected errors', async () => {
      jest.spyOn(usersService, 'findOne').mockRejectedValue(new Error('Database error'));

      const result = await usersController.findOne('1');
      expect(result).toEqual(errorResponse('Failed to retrieve user', 'Database error'));
    });
  });

  describe('update', () => {
    it('should update the user successfully', async () => {
      const userId = '1';
      const userDto: UpdateUserDto = { name: 'Updated Name', email: 'updated@example.com' };
      const updatedUser: UserResultDto = {
        id: userId,
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      jest.spyOn(usersService, 'update').mockResolvedValue(updatedUser);

      // Mock the request with a userId from JWT token
      const req = { user: { userId: userId } };

      const result = await usersController.update(req, userDto);

      expect(result).toEqual(successResponse('User updated successfully', updatedUser));
      expect(usersService.update).toHaveBeenCalledWith(userId, userDto);
      expect(usersService.update).toHaveBeenCalledTimes(1);
    });

    it('should return an error if the user ID is missing in the token', async () => {
      const userDto: UpdateUserDto = { name: 'Updated Name', email: 'updated@example.com' };
      
      // Mock the request without a userId
      const req = { user: {} };

      const result = await usersController.update(req, userDto);

      expect(result).toEqual(errorResponse('User updated failed', 'User ID not found in token.'));
    });

    it('should return an error if update fails due to no valid fields provided', async () => {
      const userId = '1';
      const userDto: UpdateUserDto = {}; // Empty DTO, no fields to update

      jest.spyOn(usersService, 'update').mockRejectedValue(new Error('No valid fields provided for update.'));

      const req = { user: { userId: userId } };

      const result = await usersController.update(req, userDto);

      expect(result).toEqual(errorResponse('User updated failed', 'No valid fields provided for update.'));
      expect(usersService.update).toHaveBeenCalledWith(userId, userDto);
    });

    it('should return an error if the user is not found for update', async () => {
      const userId = '1';
      const userDto: UpdateUserDto = { name: 'Updated Name', email: 'updated@example.com' };

      jest.spyOn(usersService, 'update').mockRejectedValue(new Error('User not found'));

      const req = { user: { userId: userId } };

      const result = await usersController.update(req, userDto);

      expect(result).toEqual(errorResponse('User updated failed', 'User not found'));
    });

    it('should handle unexpected errors', async () => {
      const userId = '1';
      const userDto: UpdateUserDto = { name: 'Updated Name', email: 'updated@example.com' };

      jest.spyOn(usersService, 'update').mockRejectedValue(new Error('Database error'));

      const req = { user: { userId: userId } };

      const result = await usersController.update(req, userDto);

      expect(result).toEqual(errorResponse('User updated failed', 'Database error'));
    });
  });
});
