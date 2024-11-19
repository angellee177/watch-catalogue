import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserResultDto } from './dto/user.dto';
import { setLog, transformToUserResultDto } from '../common/logger.helper';

@Injectable()
export class UsersService {
    constructor(
        // to tell NestJs that we want to inject the repository of the User Entity.
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    /**
     * Create new user.
     * @param user 
     * @returns 
     */
    async create(user: Partial<User>): Promise<UserResultDto> {
        const newUser = this.userRepository.create(user);

        // Save the new user entity to the database
        const savedUser = await this.userRepository.save(newUser);

        setLog({
            level: 'info',
            method: 'UsersService.create',
            message: 'User create successful',
        });

        // Return the transformed result as UserResultDto
        return transformToUserResultDto(savedUser);
    }

    /**
     * Find user by email
     * 
     * @param email 
     * @returns 
     */
    async findUserByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email } }); // Correct implementation
    }

    /**
     * Update User
     * 
     * @param id 
     * @param user 
     * @returns single user data
     */
    async update(id: string, user: Partial<User>): Promise<UserResultDto> {
        // Filter out undefined or null values
        const updateData: Partial<User> = {};

        // Dynamically add fields that are provided
        if (user.name !== undefined) updateData.name = user.name;
        if (user.email !== undefined) updateData.email = user.email;

        // Check if there are fields to update
        if (Object.keys(updateData).length === 0) {
            setLog({
                level: 'error',
                method: 'UsersService.update',
                message: 'No data are provided for update.',
            });

            throw new Error('No valid fields provided for update.');
        }

        // Update the user record
        const updateResult = await this.userRepository.update(id, updateData);

        // Handle cases where the update doesn't find a matching user
        if (updateResult.affected === 0) {
            throw new Error('User not found');
        }

        // Retrieve the updated user
        const updatedUser = await this.userRepository.findOne({ where: { id } });

        if (!updatedUser) {
            throw new Error('Failed to retrieve updated user');
        }

        setLog({
            level: 'info',
            method: 'UsersService.update',
            message: 'User updated successfully.',
        });

        // Transform and return the result
        return transformToUserResultDto(updatedUser);
    }
    
    /**
     * Get all user
     * 
     * @returns list of User
     */
    async findAll() {
        const users = await this.userRepository.find({
            select: ['id', 'name', 'email'],
            where: { deletedAt: null }, // Exclude soft-deleted records
            order: { name: 'ASC' }, // Optional: sort by name
        });

        return users.map(transformToUserResultDto);
    }

    /**
     * Get single User
     * 
     * @param userId 
     * @returns a single user
     */
    async findOne(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            // add logger later
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        return transformToUserResultDto(user);
    }
}
