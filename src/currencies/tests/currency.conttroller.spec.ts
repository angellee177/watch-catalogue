import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from '../currency.controller';
import { CurrencyService } from '../currency.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';

describe('CurrencyController', () => {
  let controller: CurrencyController;
  let service: CurrencyService;

  const mockCurrency = {
    id: '1',
    name: 'US Dollar',
    code: 'USD',
    symbol: '$',
    countryId: '123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockCurrency),
    getAll: jest.fn().mockResolvedValue({
      data: [mockCurrency],
      meta: { total: 1, page: 1, limit: 25 },
    }),
    getOne: jest.fn().mockImplementation((id: string) =>
      id === '1' ? Promise.resolve(mockCurrency) : Promise.reject(new NotFoundException()),
    ),
    update: jest.fn().mockImplementation((id: string, dto: any) =>
      id === '1' ? Promise.resolve({ ...mockCurrency, ...dto }) : Promise.reject(new NotFoundException()),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [
        {
          provide: CurrencyService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<CurrencyController>(CurrencyController);
    service = module.get<CurrencyService>(CurrencyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a currency', async () => {
      const createDto = { name: 'US Dollar', code: 'USD', symbol: '$', countryId: '123' };
      const result = await controller.create(createDto);

      expect(result).toEqual({
        success: true,
        message: 'Currency successfully created',
        result: mockCurrency
      })
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all currencies', async () => {
      const result = await controller.findAll(1, 25);
      expect(result).toEqual({
        data: [mockCurrency],
        meta: { total: 1, page: 1, limit: 25 },
      });
      expect(service.getAll).toHaveBeenCalledWith(1, 25);
    });
  });

  describe('getOne', () => {
    it('should return a single currency', async () => {
      const result = await controller.getOne('1');
      expect(result).toEqual({
        success: true,
        message: 'Currency fetched successfully',
        result: mockCurrency
      })
      expect(service.getOne).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if the currency is not found', async () => {
        mockService.getOne.mockRejectedValue(
            new NotFoundException('Currency not found'),
        );

        const result = await controller.getOne('1');
        expect(result).toEqual({
            success: false,
            message: 'Failed to fetch currency',
            error: 'Currency not found',
        })
    });
  });

  describe('update', () => {
    const updateDto = { name: 'Euro', code: 'EUR', symbol: '€.' };

    it('should update a currency', async () => {
      const result = await controller.update('1', updateDto);
      expect(result).toEqual({
        success: true,
        message: 'Currency successfully updated',
        result:  {
            id: '1',
            name: updateDto.name,
            code: updateDto.code,
            symbol: updateDto.symbol,
            countryId: '123',
            createdAt: mockCurrency.createdAt,
            updatedAt: mockCurrency.updatedAt,
          }
      })
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });

    it('should throw a NotFoundException if the currency is not found', async () => {
        mockService.update.mockRejectedValue(
            new NotFoundException('Currency not found'),
        );

        const result = await controller.update('3', updateDto);
        expect(result).toEqual({
            success: false,
            message: 'Failed to update currency',
            error: 'Currency not found',
        })
    });
  });
});
