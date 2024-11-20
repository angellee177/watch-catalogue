import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entity/country.entity';
import { setLog } from '../common/logger.helper';

@Injectable()
export class CountryService {
    constructor(
        @InjectRepository(Country)
        private readonly countryRepository: Repository<Country>,
    ) {}

    async createCountry(name: string, code: string): Promise<Country> {
        try {
            setLog({
                level: 'info',
                method: 'CountryService.createCountry',
                message: `Creating country with name: ${name}`,
            });

            const country = this.countryRepository.create({ name, code });
            const savedCountry = await this.countryRepository.save(country);

            setLog({
                level: 'info',
                method: 'CountryService.createCountry',
                message: `Country created successfully: ${savedCountry.id}`,
            });

            return savedCountry;
        } catch (error) {
            setLog({
                level: 'error',
                method: 'CountryService.createCountry',
                message: 'Error while creating country',
                error,
            });
            throw error;
        }
    }

    /**
     * Find all country with pagination
     * 
     * @param page 
     * @param limit 
     * @returns 
     */
    async getAllCountries(page: number = 1, limit: number = 25) {
        try {
        // Fetch countries with pagination
        const [countries, total] = await this.countryRepository.findAndCount({
            skip: (page - 1) * limit,  // Skip records based on page.
            take: limit,  // Limit the number of records returned.
        });

        return {
            data: countries,  // Return countries directly.
            meta: {
                total,  // Total number of countries.
                page,   // Current page number.
                limit,  // Limit per page (25 by default).
            },
        };
        } catch (error) {
            setLog({
                level: 'error',
                method: 'CountryService.getAllCountries',
                message: 'Error while fetching countries',
                error,
            });

            throw error;
        }
    }

    /**
     * Get a country by id
     * 
     * @param id 
     * @returns 
     */
    async getCountryById(id: string): Promise<Country> {
        try {
            setLog({
                level: 'info',
                method: 'CountryService.getCountryById',
                message: `Fetching country with ID: ${id}`,
            });

            const country = await this.countryRepository.findOne({ where: { id } });
            if (!country) {
                setLog({
                    level: 'warn',
                    method: 'CountryService.getCountryById',
                    message: `Country with ID: ${id} not found`,
                });
                throw new NotFoundException(`Country with ID ${id} not found`);
            }

            return country;
        } catch (error) {
            setLog({
                level: 'error',
                method: 'CountryService.getCountryById',
                message: 'Error while fetching country',
                error,
            });
            throw error;
        }
    }
}
