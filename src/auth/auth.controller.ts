import { Controller, Post, Body, UnauthorizedException, BadRequestException, Request, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserResultDto } from 'users/dto/user.dto';

@ApiTags('auth/v1') // Group endpoints under the "auth" tag
@Controller('auth/v1')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' }) // Describes the operation in Swagger UI
  @ApiBody({
    description: 'User registration data',
    type: RegisterUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (Validation Error)',
  })
  async register(@Body() registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto;

    // Check if the email already exists
    const existingUser = await this.usersService.findUserByEmail(email);

    if (existingUser) {
    throw new BadRequestException('Email already exists');
    }
    
    return this.authService.register(name, email, password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user and return JWT token' })
  @ApiBody({ 
    description: 'User login credentials', 
    type: LoginUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully, returns JWT token',
    schema: {
      example: {
        access_token: 'your.jwt.token.here' // Example token
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (Invalid credentials)',
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.authService.login(email, password);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth() // Adds the Authorization header in Swagger
  @ApiOperation({ summary: 'Retrieve the profile of the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'User profile successfully retrieved.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123456' },
        email: { type: 'string', example: 'test@example.com' },
        name: { type: 'string', example: 'John Doe' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized. User is not authenticated.' })
  async getProfile(@Request() req): Promise<UserResultDto> {
    // Extract user information from JWT
    const email = req.user.email;

    // Retrieve user details based on email
    const user = await this.authService.getUserByEmail(email);

    // Return user profile or handle errors
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return user; // Ensure the returned object matches `UserResultDto`
  }
}

