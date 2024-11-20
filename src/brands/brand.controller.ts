import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BrandService } from "./brand.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { errorResponse, successResponse } from "../common/response.helper";

@ApiTags('Brands')
@Controller('brands/v1')
export class BrandController {
    constructor(private readonly brandService: BrandService) {}

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Get all brands' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiResponse({ status: 200, description: 'List of brands' })
    async getAllBrands(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 25,
    ) {
        try {
            const brands = await this.brandService.getAllBrands(page, limit);
            return successResponse('Brands fetched successfully', brands);
        } catch (error) {
            return errorResponse('Failed to fetch brands', error.message);
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get a brand by ID' })
    @ApiParam({ name: 'id', description: 'Brand ID', type: 'string' })
    @ApiResponse({ status: 200, description: 'Brand found' })
    @ApiResponse({ status: 404, description: 'Brand not found' })
    async getBrandById(@Param('id') id: string) {
        try {
            const brand = await this.brandService.getBrandById(id);
            return successResponse('Brand fetched successfully', brand);
        } catch (error) {
            return errorResponse('Failed to fetch brand', error.message);
        }
    }
}
