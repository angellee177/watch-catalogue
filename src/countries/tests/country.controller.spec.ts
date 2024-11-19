import { Test, TestingModule } from '@nestjs/testing';
import { CountryController } from '../countries.controller';
import { CountryService } from '../countries.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCountryDto } from '../dto/create-country.dto';

describe('CountryController', () => {
  let countryController: CountryController;
  let countryService: CountryService;

  const mockCountryService = {
    createCountry: jest.fn(),
    getAllCountries: jest.fn(),
    getCountryById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [
        { provide: CountryService, useValue: mockCountryService },
      ],
    }).compile();

    countryController = module.get<CountryController>(CountryController);
    countryService = module.get<CountryService>(CountryService);
  });

  describe('createCountry', () => {
    it('should create a country successfully', async () => {
      const createCountryDto: CreateCountryDto = {
        name: 'Country Name',
        code: 'CN',
      };

      const result = { id: '1', name: 'Country Name', code: 'CN' };

      // Mock service
      countryService.createCountry = jest.fn().mockResolvedValue(result);

      const response = await countryController.createCountry(createCountryDto);

      expect(response).toEqual({
        statusCode: 201,
        message: 'Country successfully created',
        data: result,
      });
      expect(countryService.createCountry).toHaveBeenCalledWith(createCountryDto.name, createCountryDto.code);
    });

    it('should throw BadRequestException if country creation fails', async () => {
      const createCountryDto: CreateCountryDto = {
        name: 'Country Name',
        code: 'CN',
      };

      // Mock service to throw error
      countryService.createCountry = jest.fn().mockRejectedValue(new Error('Failed to create country'));

      await expect(countryController.createCountry(createCountryDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAllCountries', () => {
    it('should return a list of countries', async () => {
      const countries = [
        { id: '1', name: 'Country 1', code: 'C1' },
        { id: '2', name: 'Country 2', code: 'C2' },
      ];

      // Mock service
      countryService.getAllCountries = jest.fn().mockResolvedValue(countries);

      const response = await countryController.getAllCountries();

      expect(response).toEqual({
        statusCode: 200,
        message: 'Countries fetched successfully',
        data: countries,
      });
      expect(countryService.getAllCountries).toHaveBeenCalled();
    });

    it('should throw error if unable to fetch countries', async () => {
      // Mock service to throw error
      countryService.getAllCountries = jest.fn().mockRejectedValue(new Error('Failed to fetch countries'));

      await expect(countryController.getAllCountries()).rejects.toThrow(BadRequestException);
    });
  });

  describe('getCountryById', () => {
    it('should return a country by id', async () => {
      const countryId = '1';
      const country = { id: countryId, name: 'Country 1', code: 'C1' };

      // Mock service
      countryService.getCountryById = jest.fn().mockResolvedValue(country);

      const response = await countryController.getCountryById(countryId);

      expect(response).toEqual({
        statusCode: 200,
        message: 'Country fetched successfully',
        data: country,
      });
      expect(countryService.getCountryById).toHaveBeenCalledWith(countryId);
    });

    it('should throw NotFoundException if country not found', async () => {
      const countryId = '1';

      // Mock service to throw error
      countryService.getCountryById = jest.fn().mockRejectedValue(new NotFoundException('Country not found'));

      await expect(countryController.getCountryById(countryId)).rejects.toThrow(NotFoundException);
    });
  });
});
