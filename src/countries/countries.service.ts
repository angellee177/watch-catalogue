import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entity/country.entity';
import { setLog } from '../common/logger.helper';

@Injectable()
export class CountryService {
    private readonly logger = new Logger(CountryService.name);

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

    async getAllCountries(): Promise<Country[]> {
        try {
            setLog({
                level: 'info',
                method: 'CountryService.getAllCountries',
                message: 'Fetching all countries',
            });

            return this.countryRepository.find();
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
