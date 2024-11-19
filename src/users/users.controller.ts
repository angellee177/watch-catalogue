import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, ParseUUIDPipe, UnauthorizedException, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { errorResponse, successResponse } from '../common/response.helper';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { setLog } from '../common/logger.helper';

@ApiTags('users') // Group endpoints under the "users" tag
@Controller('users/v1')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users successfully retrieved.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occurred.',
  })
  async findAll() {
    const result = await this.usersService.findAll();

    return successResponse('Get all user', result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single user by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The UUID of the user to retrieved',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully retrieved.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occurred.',
  })
  async findOne(@Param('id') id: string){
    try {
      const user = await this.usersService.findOne(id);

      return successResponse('User successfully retrieved.', user);
    } catch (error) {

      return errorResponse('Failed to retrieve user', error.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@Request() req, @Body() user: UpdateUserDto) {
    try {
      // Extract the `Authorization` token from the request headers
      const authToken = req.headers['authorization'];
  
      // Check if the auth token is missing or null
      if (!authToken) {
        throw new UnauthorizedException('Authorization token is missing or empty.');
      }
      
      setLog
      // Extract `id` from the JWT token payload
      const userId = req.user.id;
  
      if (!userId) {
        throw new UnauthorizedException('User ID not found in token.');
      }
  
      const result = await this.usersService.update(userId, user);
      return successResponse('User updated successfully', result);
    } catch (error) {
      return errorResponse('User update failed', error.message);
    }
  }
}