import { Controller, Get, Post, Param, Body, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CountryService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { successResponse, errorResponse } from '../common/response.helper';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Countries')
@Controller('countries/v1')
export class CountryController {
    constructor(private readonly countryService: CountryService) {}

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create a new country' })
    @ApiBody({ description: 'Country creation data', type: CreateCountryDto })
    @ApiResponse({ status: 201, description: 'Country successfully created' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async createCountry(@Body() createCountryDto: CreateCountryDto) {
        try {
            const country = await this.countryService.createCountry(
                createCountryDto.name, 
                createCountryDto.code,
            );

            return successResponse('Country successfully created', country);
        } catch (error) {
            return errorResponse('Failed to create country', error.message);
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Get all countries' })
    @ApiResponse({ status: 200, description: 'List of countries' })
    async getAllCountries() {
        try {
            const countries = await this.countryService.getAllCountries();
            return successResponse('Countries fetched successfully', countries);
        } catch (error) {
            return errorResponse('Failed to fetch countries', error.message);
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get a country by ID' })
    @ApiParam({ name: 'id', description: 'Country ID', type: 'string' })
    @ApiResponse({ status: 200, description: 'Country found' })
    @ApiResponse({ status: 404, description: 'Country not found' })
    async getCountryById(@Param('id') id: string) {
        try {
            const country = await this.countryService.getCountryById(id);
            return successResponse('Country fetched successfully', country);
        } catch (error) {
            return errorResponse('Failed to fetch country', error.message);
        }
    }
}
