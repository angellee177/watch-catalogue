import { Test, TestingModule } from '@nestjs/testing';
import { CountryController } from '../countries.controller';
import { CountryService } from '../countries.service';
import { CreateCountryDto } from '../dto/create-country.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';

describe('CountryController', () => {
  let controller: CountryController;
  let service: CountryService;

  const mockCountryService = {
    createCountry: jest.fn(),
    getAllCountries: jest.fn(),
    getCountryById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [{ provide: CountryService, useValue: mockCountryService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // Mock JWT guard to always allow
      .compile();

    controller = module.get<CountryController>(CountryController);
    service = module.get<CountryService>(CountryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('createCountry', () => {
    it('should create a new country', async () => {
      const createCountryDto: CreateCountryDto = { name: 'Testland', code: 'TL' };
      const mockResponse = { id: '1', ...createCountryDto };
      mockCountryService.createCountry.mockResolvedValue(mockResponse);

      const result = await controller.createCountry(createCountryDto);
      expect(result).toEqual({
        success: true,
        message: 'Country successfully created',
        result: mockResponse,
      });
      expect(mockCountryService.createCountry).toHaveBeenCalledWith('Testland', 'TL');
    });

    it('should return an error response if creation fails', async () => {
      const createCountryDto: CreateCountryDto = { name: 'Testland', code: 'TL' };
      mockCountryService.createCountry.mockRejectedValue(new Error('Creation failed'));

      const result = await controller.createCountry(createCountryDto);
      expect(result).toEqual({
        success: false,
        message: 'Failed to create country',
        error: 'Creation failed',
      });
    });
  });

  describe('getAllCountries', () => {
    it('should fetch all countries with pagination', async () => {
      const mockResponse = {
        data: [{ id: '1', name: 'Testland', code: 'TL' }],
        meta: { total: 1, page: 1, limit: 25 },
      };
      mockCountryService.getAllCountries.mockResolvedValue(mockResponse);

      const result = await controller.getAllCountries(1, 25);
      expect(result).toEqual({
        success: true,
        message: 'Countries fetched successfully',
        result: mockResponse,
      });
      expect(mockCountryService.getAllCountries).toHaveBeenCalledWith(1, 25);
    });

    it('should return an error response if fetching fails', async () => {
      mockCountryService.getAllCountries.mockRejectedValue(new Error('Fetch failed'));

      const result = await controller.getAllCountries(1, 25);
      expect(result).toEqual({
        success: false,
        message: 'Failed to fetch countries',
        error: 'Fetch failed',
      });
    });
  });

  describe('getCountryById', () => {
    it('should fetch a country by ID', async () => {
      const mockResponse = { id: '1', name: 'Testland', code: 'TL' };
      mockCountryService.getCountryById.mockResolvedValue(mockResponse);

      const result = await controller.getCountryById('1');
      expect(result).toEqual({
        success: true,
        message: 'Country fetched successfully',
        result: mockResponse,
      });
      expect(mockCountryService.getCountryById).toHaveBeenCalledWith('1');
    });

    it('should return an error response if the country is not found', async () => {
      mockCountryService.getCountryById.mockRejectedValue(
        new NotFoundException('Country not found'),
      );

      const result = await controller.getCountryById('999');
      expect(result).toEqual({
        success: false,
        message: 'Failed to fetch country',
        error: 'Country not found',
      });
    });
  });
});
