import { Test, TestingModule } from '@nestjs/testing';
import { BrandController } from '../brand.controller';
import { BrandService } from '../brand.service';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';

describe('BrandController', () => {
  let controller: BrandController;
  let service: BrandService;

  const mockBrandService = {
    createBrand: jest.fn(),
    getAllBrands: jest.fn(),
    getBrandById: jest.fn(),
    updateBrand: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandController],
      providers: [{ provide: BrandService, useValue: mockBrandService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // Mock JWT guard to always allow
      .compile();

    controller = module.get<BrandController>(BrandController);
    service = module.get<BrandService>(BrandService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('createBrand', () => {
    it('should create a new brand', async () => {
      const createBrandDto: CreateBrandDto = { name: 'TestBrand', originCountryId: '1' };
      const mockResponse = { id: 'uuid', ...createBrandDto };
      mockBrandService.createBrand.mockResolvedValue(mockResponse);

      const result = await controller.create(createBrandDto);
      expect(result).toEqual({
        success: true,
        message: 'Brand successfully created',
        result: mockResponse,
      });
      expect(mockBrandService.createBrand).toHaveBeenCalledWith(createBrandDto);
    });

    it('should return an error response if creation fails', async () => {
      const createBrandDto: CreateBrandDto = { name: 'TestBrand', originCountryId: '1' };
      mockBrandService.createBrand.mockRejectedValue(new Error('Creation failed'));

      const result = await controller.create(createBrandDto);
      expect(result).toEqual({
        success: false,
        message: 'Failed to create brand',
        error: 'Creation failed',
      });
    });
  });

  describe('getAllBrands', () => {
    it('should fetch all brands with pagination', async () => {
      const mockResponse = {
        data: [{ id: 'uuid', name: 'TestBrand', countryId: '1' }],
        meta: { total: 1, page: 1, limit: 25 },
      };
      mockBrandService.getAllBrands.mockResolvedValue(mockResponse);

      const result = await controller.getAllBrands(1, 25);
      expect(result).toEqual({
        success: true,
        message: 'Brands fetched successfully',
        result: mockResponse,
      });
      expect(mockBrandService.getAllBrands).toHaveBeenCalledWith(1, 25);
    });

    it('should return an error response if fetching fails', async () => {
      mockBrandService.getAllBrands.mockRejectedValue(new Error('Fetch failed'));

      const result = await controller.getAllBrands(1, 25);
      expect(result).toEqual({
        success: false,
        message: 'Failed to fetch brands',
        error: 'Fetch failed',
      });
    });
  });

  describe('getBrandById', () => {
    it('should fetch a brand by ID', async () => {
      const mockResponse = { id: 'uuid', name: 'TestBrand', countryId: '1' };
      mockBrandService.getBrandById.mockResolvedValue(mockResponse);

      const result = await controller.getBrandById('uuid');
      expect(result).toEqual({
        success: true,
        message: 'Brand fetched successfully',
        result: mockResponse,
      });
      expect(mockBrandService.getBrandById).toHaveBeenCalledWith('uuid');
    });

    it('should return an error response if the brand is not found', async () => {
      mockBrandService.getBrandById.mockRejectedValue(
        new NotFoundException('Brand not found'),
      );

      const result = await controller.getBrandById('nonexistent-id');
      expect(result).toEqual({
        success: false,
        message: 'Failed to fetch brand',
        error: 'Brand not found',
      });
    });
  });

  describe('updateBrand', () => {
    it('should update a brand', async () => {
      const updateBrandDto: UpdateBrandDto = { name: 'UpdatedBrand', originCountryId: '1' };
      const mockResponse = { id: 'uuid', ...updateBrandDto };
      mockBrandService.updateBrand.mockResolvedValue(mockResponse);

      const result = await controller.update('uuid', updateBrandDto);
      expect(result).toEqual({
        success: true,
        message: 'Brand successfully updated',
        result: mockResponse,
      });
      expect(mockBrandService.updateBrand).toHaveBeenCalledWith('uuid', updateBrandDto);
    });

    it('should return an error response if updating fails', async () => {
      const updateBrandDto: UpdateBrandDto = { name: 'UpdatedBrand', originCountryId: '1' };
      mockBrandService.updateBrand.mockRejectedValue(new Error('Update failed'));

      const result = await controller.update('uuid', updateBrandDto);
      expect(result).toEqual({
        success: false,
        message: 'Failed to update brand',
        error: 'Update failed',
      });
    });
  });
});
