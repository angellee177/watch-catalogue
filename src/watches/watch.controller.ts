import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WatchService } from './watch.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorResponse, successResponse } from '../common/response.helper';
import { UpdateWatchDto } from './dto/update-watch.dto';
import { CreateWatchDto } from './dto/create-watch.dto';
import { SearchWatchDto } from './dto/search-watch.dto';

@ApiTags('Watches')
@Controller('watches/v1')
export class WatchController {
  constructor(private readonly watchService: WatchService) {}

  @Get()
  @ApiOperation({ summary: 'Get all watches with optional filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page', example: 25 })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Name of the watch' })
  @ApiQuery({ name: 'brand', required: false, type: String, description: 'Brand of the watch' })
  @ApiQuery({ name: 'country', required: false, type: String, description: 'Country of the watch' })
  @ApiQuery({ name: 'priceMin', required: false, type: Number, description: 'Minimum price of the watch' })
  @ApiQuery({ name: 'priceMax', required: false, type: Number, description: 'Maximum price of the watch' })
  @ApiQuery({ name: 'referenceNumber', required: false, type: String, description: 'Reference number of the watch' })
  @ApiResponse({ status: 200, description: 'List of watches' })
  @ApiResponse({ status: 400, description: 'Invalid parameters' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllWatches(
     // Use DTO to keep the structure of query parameters
    @Query() searchWatchDto: SearchWatchDto,
  ) {
    try {
      const watches = await this.watchService.getAll(searchWatchDto);
      return successResponse('Watches fetched successfully', watches);
    } catch (error) {
      return errorResponse('Failed to fetch watches', error.message);
    }
  }

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
}
