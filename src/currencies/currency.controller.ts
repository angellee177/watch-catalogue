import { Controller, Get, Post, Body, Param, Put, HttpStatus, UseGuards, Query, Request } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Currency } from './entity/currency.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { successResponse, errorResponse } from '../common/response.helper';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { setLog } from '../common/logger.helper';

@ApiTags('Currencies')  // Swagger Grouping for Currency endpoints
@Controller('currencies/v1')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new currency' })
  @ApiBody({ description: 'Currency creation data', type: CreateCurrencyDto })
  @ApiResponse({ status: 201, description: 'Currency successfully created', type: Currency })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() createCurrencyDto: CreateCurrencyDto) {
      try {
      const currency = await this.currencyService.create(createCurrencyDto);
      return successResponse('Currency successfully created', currency);
      } catch (error) {
      return errorResponse('Failed to create currency', error.message);
      }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all currency'})
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  async findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 25,
  ) {
      return this.currencyService.getAll(page, limit);
  }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get a currency by ID' })
    @ApiParam({ name: 'id', description: 'Currency ID', type: 'string' })
    @ApiResponse({ status: 200, description: 'Currency found', type: Currency })
    @ApiResponse({ status: 404, description: 'Currency not found' })
    async getOne(@Param('id') id: string) {
        try {
                    const currency = await this.currencyService.getOne(id);

          return successResponse('Currency fetched successfully', currency);
        } catch (error) {

          return errorResponse('Failed to fetch currency', error.message);
        }
    }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a currency by ID' })
  @ApiParam({ name: 'id', description: 'Currency ID', type: 'string' })
  @ApiBody({ description: 'Currency update data', type: UpdateCurrencyDto })
  @ApiResponse({ status: 200, description: 'Currency successfully updated', type: Currency })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async update(
    @Param('id') id: string,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ) {
    try {
      const updatedCurrency = await this.currencyService.update(id, updateCurrencyDto);

      return successResponse('Currency successfully updated', updatedCurrency);
    } catch (error) {

      return errorResponse('Failed to update currency', error.message);
    }
  }
}
