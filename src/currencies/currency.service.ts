import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './entity/currency.entity';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { setLog } from '../common/logger.helper';  // Assuming the setLog helper is in the common directory

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

    async create(createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
        try {
        // Log the attempt to create a new currency
        setLog({
            level: 'info',
            method: 'CurrencyService.create',
            message: `Creating currency with name: ${createCurrencyDto.name}`,
        });

        const currency = this.currencyRepository.create(createCurrencyDto);
        const savedCurrency = await this.currencyRepository.save(currency);

        // Log success
        setLog({
            level: 'info',
            method: 'CurrencyService.create',
            message: `Currency created successfully: ${savedCurrency.id}`,
        });

        return savedCurrency;
        } catch (error) {
            // Log error
            setLog({
                level: 'error',
                method: 'CurrencyService.create',
                message: 'Error while creating currency',
                error,
            });

            throw error;
        }
    }

    /**
     * Get all currency
     * 
     * @param page 
     * @param limit 
     * @returns 
     */
    async getAll(page: number = 1, limit: number = 25) {
        const [currencies, total] = await this.currencyRepository.findAndCount({
            relations: ['country'], // Include the related 'country' entity
            skip: (page - 1) * limit, // Skip based on the page
            take: limit, // Limit the results
        });

        return {
            data: currencies.map((currency) => ({
                id: currency.id,
                name: currency.name,
                code: currency.code,
                symbol: currency.symbol,
                countryId: currency.country ? currency.country.id : null,
                countryName: currency.country ? currency.country.name : null,
                countryCode: currency.country ? currency.country.code : null,
                createdAt: currency.createdAt,
                updatedAt: currency.updatedAt,
            })),
            meta: {
                total,
                page,
                limit,
            },
        };
    }

    /**
     * Get currency Detail
     * 
     * @param id 
     * @returns 
     */
    async getOne(id: string): Promise<Currency> {
        try {
        // Log the attempt to fetch a currency by ID
        setLog({
            level: 'info',
            method: 'CurrencyService.getOne',
            message: `Fetching currency with ID: ${id}`,
        });

        const currency = await this.currencyRepository.findOne({ where: { id } });
        if (!currency) {
            // Log warning if currency not found
            setLog({
                level: 'warn',
                method: 'CurrencyService.getOne',
                message: `Currency with ID: ${id} not found`,
            });

            throw new NotFoundException(`Currency with ID ${id} not found`);
        }

        return currency;
        } catch (error) {
        // Log error
        setLog({
            level: 'error',
            method: 'CurrencyService.getOne',
            message: 'Error while fetching currency',
            error,
        });
        throw error;
        }
    }

    /**
     * Update a currency
     * 
     * @param id 
     * @param updateCurrencyDto 
     * @returns 
     */
    async update(id: string, updateCurrencyDto: UpdateCurrencyDto): Promise<Currency> {
        try {
            // Log the attempt to update the currency
            setLog({
                level: 'info',
                method: 'CurrencyService.update',
                message: `Updating currency with ID: ${id}`,
            });

            const result = await this.currencyRepository.update(id, updateCurrencyDto);
            // Handle cases where the update doesn't find a matching currency
            if (result.affected === 0) {
                setLog({
                    level: 'warn',
                    method: 'CurrencyService.update',
                    message: `Currency with ID: ${id} not found`,
                });

                throw new Error('Currency not found');
            }

            // Retrieve the updated currency
            const updatedCurrency = await this.currencyRepository.findOne({ where: { id } });
            if (!updatedCurrency) {
                setLog({
                    level: 'warn',
                    method: 'CurrencyService.update',
                    message: `Currency with ID: ${id} not found`,
                });

                throw new Error('Currency not found');
            }

            // Log success
            setLog({
                level: 'info', 
                method: 'CurrencyService.update',
                message: `Currency updated successfully: ${updatedCurrency}`,
            });

            return updatedCurrency;
        } catch (error) {
            // Log error
            setLog({
                level: 'error',
                method: 'CurrencyService.update',
                message: 'Error while updating currency',
                error,
            });

            throw error;
        }
    }
}
