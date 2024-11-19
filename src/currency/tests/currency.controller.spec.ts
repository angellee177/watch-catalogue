import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from '../currency.controller';
import { CurrencyService } from '../currency.service';
import { CreateCurrencyDto } from '../dto/create-currency.dto';
import { UpdateCurrencyDto } from '../dto/update-currency.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CurrencyController', () => {
  let currencyController: CurrencyController;
  let currencyService: CurrencyService;

  const mockCurrencyService = {
    create: jest.fn(),
    getAll: jest.fn(),
    getOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [
        { provide: CurrencyService, useValue: mockCurrencyService },
      ],
    }).compile();

    currencyController = module.get<CurrencyController>(CurrencyController);
    currencyService = module.get<CurrencyService>(CurrencyService);
  });

  describe('create', () => {
    it('should successfully create a currency', async () => {
      const createCurrencyDto: CreateCurrencyDto = {
        name: 'USD',
        code: 'USD',
        countryId: 'fdd72c5e-11db-4f94-b54d-7b70c2fa12cd',
        symbol: '$',
      };

      const result = { id: '1', ...createCurrencyDto };

      // Mock service method
      currencyService.create = jest.fn().mockResolvedValue(result);

      const response = await currencyController.create(createCurrencyDto);

      expect(response).toEqual({
        statusCode: 201,
        message: 'Currency successfully created',
        data: result,
      });
      expect(currencyService.create).toHaveBeenCalledWith(createCurrencyDto);
    });

    it('should throw BadRequestException if currency creation fails', async () => {
      const createCurrencyDto: CreateCurrencyDto = {
        name: 'USD',
        code: 'USD',
        countryId: 'fdd72c5e-11db-4f94-b54d-7b70c2fa12cd',
      };

      // Mock service method to throw error
      currencyService.create = jest.fn().mockRejectedValue(new Error('Failed to create currency'));

      await expect(currencyController.create(createCurrencyDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if validation fails', async () => {
      const createCurrencyDto: CreateCurrencyDto = {
        name: '',
        code: 'USD',
        countryId: 'invalid-uuid',
      };

      await expect(currencyController.create(createCurrencyDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return a list of currencies with pagination', async () => {
      const currencies = [
        { id: '1', name: 'USD', code: 'USD', countryId: 'uuid' },
        { id: '2', name: 'EUR', code: 'EUR', countryId: 'uuid' },
      ];

      const paginationMeta = { total: 100, page: 1, limit: 25 };

      // Mock service method
      currencyService.getAll = jest.fn().mockResolvedValue({
        data: currencies,
        meta: paginationMeta,
      });

      const response = await currencyController.findAll();

      expect(response).toEqual({
        statusCode: 200,
        message: 'Currencies fetched successfully',
        data: currencies,
        meta: paginationMeta,
      });
      expect(currencyService.getAll).toHaveBeenCalledWith(1, 25);
    });

    it('should throw BadRequestException if unable to fetch currencies', async () => {
      // Mock service method to throw error
      currencyService.getAll = jest.fn().mockRejectedValue(new Error('Failed to fetch currencies'));

      await expect(currencyController.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('getOne', () => {
    it('should return a currency by ID', async () => {
      const currencyId = '1';
      const currency = { id: currencyId, name: 'USD', code: 'USD', countryId: 'uuid' };

      // Mock service method
      currencyService.getOne = jest.fn().mockResolvedValue(currency);

      const response = await currencyController.getOne(currencyId);

      expect(response).toEqual({
        statusCode: 200,
        message: 'Currency fetched successfully',
        data: currency,
      });
      expect(currencyService.getOne).toHaveBeenCalledWith(currencyId);
    });

    it('should throw NotFoundException if currency not found', async () => {
      const currencyId = '1';

      // Mock service method to throw error
      currencyService.getOne = jest.fn().mockRejectedValue(new NotFoundException('Currency not found'));

      await expect(currencyController.getOne(currencyId)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if ID is invalid', async () => {
      const currencyId = 'invalid-id';

      await expect(currencyController.getOne(currencyId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should successfully update a currency', async () => {
      const updateCurrencyDto: UpdateCurrencyDto = { name: 'Updated USD' };
      const currencyId = '1';
      const result = { id: currencyId, name: 'Updated USD', code: 'USD', countryId: 'uuid' };

      // Mock service method
      currencyService.update = jest.fn().mockResolvedValue(result);

      const response = await currencyController.update(currencyId, updateCurrencyDto);

      expect(response).toEqual({
        statusCode: 200,
        message: 'Currency successfully updated',
        data: result,
      });
      expect(currencyService.update).toHaveBeenCalledWith(currencyId, updateCurrencyDto);
    });

    it('should throw NotFoundException if currency to update is not found', async () => {
      const updateCurrencyDto: UpdateCurrencyDto = { name: 'Updated USD' };
      const currencyId = '1';

      // Mock service method to throw error
      currencyService.update = jest.fn().mockRejectedValue(new NotFoundException('Currency not found'));

      await expect(currencyController.update(currencyId, updateCurrencyDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if validation fails during update', async () => {
      const updateCurrencyDto: UpdateCurrencyDto = { name: '' };
      const currencyId = '1';

      await expect(currencyController.update(currencyId, updateCurrencyDto)).rejects.toThrow(BadRequestException);
    });
  });
});
