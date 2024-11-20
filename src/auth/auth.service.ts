import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entity/user.entity';
import { setLog, transformToUserResultDto } from '../common/logger.helper';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { UserResultDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

    /**
     * Register new email
     * 
     * @param email 
     * @param name 
     * @param password 
     * @returns 
     */
    async register(name: string, email: string, password: string): Promise<any> {
      try {
        setLog({
            level: 'info',
            method: 'AuthService.register',
            message: 'Starting user registration',
            others: `name: ${name}, email: ${email}`,
        });

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);
        setLog({
            level: 'info',
            method: 'AuthService.register',
            message: 'Password hashed successfully',
        });

        // Create the new user object
        const newUser = new User();
        newUser.name = name;
        newUser.email = email;
        newUser.password = hashedPassword;

        setLog({
            level: 'info',
            method: 'AuthService.register',
            message: 'New user object created',
        });

        // Save the new user to the database
        const user = await this.usersService.create(newUser);
        setLog({
            level: 'info',
            method: 'AuthService.register',
            message: 'User saved to the database successfully',
        });

        // Prepare the payload to include the userId and email
        const payload = { userId: user.id, email: user.email };
        setLog({
          level: 'info',
          method: 'AuthService.register',
          message: 'JWT token generated successfully',
        });

        // Return the JWT token with userId and email as payload
        return { access_token: this.jwtService.sign(payload) };
      } catch (error) {
          setLog({
              level: 'error',
              method: 'AuthService.register',
              message: 'User registration failed',
              error: error,
          });
          throw error; // Rethrow the error after logging
      }
    }

  /**
   * Login new user
   * 
   * @param email 
   * @param password 
   * @returns 
   */
  async login(email: string, password: string) {
    // Find user by email
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      setLog({
          level: 'error',
          method: 'AuthService.login',
          message: `User login failed, user with email ${email} not found`,
      });

      throw new UnauthorizedException('User not found');
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);    
    
    if (!isMatch) {
      setLog({
        level: 'error',
        method: 'AuthService.login',
        message: `User login failed, Invalid credentials`,
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    // Prepare the payload to include the userId and email
    const payload = { userId: user.id, email: user.email };

    // Return the JWT token with userId and email as payload
    return { access_token: this.jwtService.sign(payload) };
  }

  /**
   * Validate User 
   * 
   * @param email 
   * @param password 
   * @returns 
   */
  async validateUser(email: string, password: string): Promise<UserResultDto> {
    const user: User = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return transformToUserResultDto(user);
  }

  /**
   * Get User by Email
   * 
   * @param email 
   * @returns 
   */
  async getUserByEmail(email: string): Promise<UserResultDto> {
    const user = await this.usersService.findUserByEmail(email);
  
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    return transformToUserResultDto(user); // Transform entity to DTO
  }  
}
