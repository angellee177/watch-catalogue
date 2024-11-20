import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Watch } from './entity/watch.entity';
import { Repository } from 'typeorm';
import { CreateWatchDto } from './dto/create-watch.dto';
import { UpdateWatchDto } from './dto/update-watch.dto';
import { setLog } from '../common/logger.helper';
import { SearchWatchDto } from './dto/search-watch.dto';
import { Country } from '../countries/entity/country.entity';
import { Brand } from '../brands/entity/brand.entity';
import { Currency } from '../currencies/entity/currency.entity';

@Injectable()
export class WatchService {
    constructor(
        @InjectRepository(Watch) private readonly watchRepository: Repository<Watch>,
        @InjectRepository(Country) private countryRepository: Repository<Country>,
        @InjectRepository(Brand) private brandRepository: Repository<Brand>,
        @InjectRepository(Currency) private currencyRepository: Repository<Currency>,
    ) {}

    /**
     * Create new watch
     * 
     * @param createWatchDto 
     * @returns 
     */
    async createWatch(createWatchDto: CreateWatchDto): Promise<Watch> {
        const watch = this.watchRepository.create(createWatchDto);
        const savedWatch = await this.watchRepository.save(watch);

        // Log success
        setLog({
            level: 'info',
            method: 'WatchService.create',
            message: `Watch created successfully: ${savedWatch.id}`,
        });

        return savedWatch;
    }

    /**
     * Update a watch
     * 
     * @param id 
     * @param updateWatchDto 
     * @returns 
     */
    async update(id: string, updateWatchDto: UpdateWatchDto): Promise<Watch> {
        try {
            // Log the attempt to update the watch
            setLog({
                level: 'info',
                method: 'WatchService.update',
                message: `Updating watch with ID: ${id} and updatedData: ${updateWatchDto.countryId}`,
            });

            // Perform the update
            const result = await this.watchRepository.update(id, updateWatchDto);

            // Handle cases where the update doesn't affect any rows
            if (result.affected === 0) {
                setLog({
                    level: 'warn',
                    method: 'WatchService.update',
                    message: `Watch with ID: ${id} not found`,
                });
                throw new Error('Watch not found');
            }

            // Retrieve the updated watch
            const updatedWatch = await this.watchRepository.findOne({ where: { id } });
            if (!updatedWatch) {
                setLog({
                    level: 'warn',
                    method: 'WatchService.update',
                    message: `Watch with ID: ${id} not found`,
                });
                throw new Error('Watch not found');
            }

            // Log success
            setLog({
                level: 'info',
                method: 'WatchService.update',
                message: `Watch updated successfully: ${updatedWatch}`,
            });

            return updatedWatch;
        } catch (error) {
            // Log error
            setLog({
                level: 'error',
                method: 'WatchService.update',
                message: 'Error while updating watch',
                error,
            });
            throw error;
        }
    }

    /**
     * Get all watch by query
     * 
     * @param searchWatchDto 
     * @returns 
     */
    async getAll(searchWatchDto: SearchWatchDto) {
        const { 
            name, 
            brand, 
            country, 
            priceMax, 
            priceMin, 
            referenceNumber, 
            page = 1, 
            limit = 25
        } = searchWatchDto;
        
        try {
          const query = this.watchRepository.createQueryBuilder('watch');
    
          // Apply filters dynamically
          if (name) {
            query.andWhere('watch.name LIKE :name', { name: `%${name}%` });
          }
          
          if (brand) {
            const brandEntity = await this.brandRepository.findOne({ where: { name: brand } });
            if (brandEntity) {
              query.andWhere('watch.brandId = :brandId', { brandId: brandEntity.id });
            }
          }
    
          if (country) {
            const countryEntity = await this.countryRepository.findOne({ where: { name: country } });
            if (countryEntity) {
              query.andWhere('watch.countryId = :countryId', { countryId: countryEntity.id });
            }
          }
    
          if (priceMax) {
            query.andWhere('watch.retailPrice <= :priceMax', { priceMax });
          }
    
          if (priceMin) {
            query.andWhere('watch.retailPrice >= :priceMin', { priceMin });
          }
    
          if (referenceNumber) {
            query.andWhere('watch.referenceNumber LIKE :referenceNumber', { referenceNumber: `%${referenceNumber}%` });
          }
    
          // Apply pagination
          query.skip((page - 1) * limit).take(limit);
    
          // Apply relations
          query.leftJoinAndSelect('watch.brand', 'brand');
          query.leftJoinAndSelect('watch.country', 'country');
          query.leftJoinAndSelect('watch.currency', 'currency');
    
          const [watches, total] = await query.getManyAndCount();
    
          return {
            data: watches.map((watch) => ({
              id: watch.id,
              name: watch.name,
              referenceNumber: watch.referenceNumber,
              retailPrice: watch.retailPrice,
              releaseDate: watch.releaseDate,
              brandId: watch.brand ? watch.brand.id : null,
              brandName: watch.brand ? watch.brand.name : null,
              currencyId: watch.currency ? watch.currency.id : null,
              currencyCode: watch.currency ? watch.currency.code : null,
              countryId: watch.country ? watch.country.id : null,
              countryName: watch.country ? watch.country.name : null,
              createdAt: watch.createdAt,
              updatedAt: watch.updatedAt,
            })),
            meta: {
              total,
              page,
              limit,
            },
          };
        } catch (error) {
          setLog({
            level: 'error',
            method: 'WatchService.getAll',
            message: 'Error while fetching watches',
            error,
          });
          throw error;
        }
      }

    /**
     * Get watch detail
     * 
     * @param id 
     * @returns 
     */
    async getWatchById(id: string): Promise<Watch> {
        const watch = await this.watchRepository.findOne({ where: { id } });
        if (!watch) {
            setLog({
                level: 'warn',
                method: 'WatchService.getOne',
                message: `Watch with ID: ${id} not found`,
            });

            throw new NotFoundException('Watch not found');
        }

        return watch;
    }
}
