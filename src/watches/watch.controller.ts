import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WatchService } from './watch.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorResponse, successResponse } from '../common/response.helper';
import { UpdateWatchDto } from './dto/update-watch.dto';
import { CreateWatchDto } from './dto/create-watch.dto';

@ApiTags('Watches')
@Controller('watches/v1')
export class WatchController {
  constructor(private readonly watchService: WatchService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all watches' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiResponse({ status: 200, description: 'List of watches' })
  async getAllWatches(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 25,
  ) {
    try {
      const watches = await this.watchService.getAll(page, limit);
      return successResponse('Watches fetched successfully', watches);
    } catch (error) {
      return errorResponse('Failed to fetch watches', error.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a watch by ID' })
  @ApiParam({ name: 'id', description: 'Watch ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Watch found' })
  @ApiResponse({ status: 404, description: 'Watch not found' })
  async getWatchById(@Param('id') id: string) {
    try {
      const watch = await this.watchService.getWatchById(id);
      return successResponse('Watch fetched successfully', watch);
    } catch (error) {
      return errorResponse('Failed to fetch watch', error.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new watch' })
  @ApiResponse({ status: 201, description: 'Watch created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createWatchDto: CreateWatchDto) {
    try {
      const watch = await this.watchService.createWatch(createWatchDto);
      return successResponse('Watch created successfully', watch);
    } catch (error) {
      return errorResponse('Failed to create watch', error.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a watch by ID' })
  @ApiResponse({ status: 200, description: 'Watch updated successfully' })
  @ApiResponse({ status: 404, description: 'Watch not found' })
  async update(
    @Param('id') id: string,
    @Body() updateWatchDto: UpdateWatchDto,
  ) {
    try {
      const watch = await this.watchService.update(id, updateWatchDto);
      return successResponse('Watch updated successfully', watch);
    } catch (error) {
      return errorResponse('Failed to update watch', error.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/search')
  @ApiOperation({ summary: 'Search watches by brand, name, or reference number' })
  @ApiQuery({ name: 'query', required: true, type: String, description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async searchWatches(@Query('query') query: string) {
    try {
      const watches = await this.watchService.searchWatches(query);
      return successResponse('Watches found', watches);
    } catch (error) {
      return errorResponse('Failed to search watches', error.message);
    }
  }
}
