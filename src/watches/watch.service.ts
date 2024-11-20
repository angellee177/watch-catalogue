import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Watch } from './entity/watch.entity';
import { Repository } from 'typeorm';
import algoliasearch from 'algoliasearch';
import { CreateWatchDto } from './dto/create-watch.dto';
import { UpdateWatchDto } from './dto/update-watch.dto';
import { setLog } from 'common/logger.helper';

@Injectable()
export class WatchService {
    private algoliaClient;
    private algoliaIndex;

    constructor(
        @InjectRepository(Watch) private readonly watchRepository: Repository<Watch>,
    ) {
        // Initialize Algolia client
        // this.algoliaClient = algoliasearch('YourAlgoliaAppID', 'YourAlgoliaAPIKey');
        this.algoliaIndex = this.algoliaClient.initIndex('watches');
    }

    /**
     * Create new watch
     * 
     * @param createWatchDto 
     * @returns 
     */
    async createWatch(createWatchDto: CreateWatchDto): Promise<Watch> {
        const watch = this.watchRepository.create(createWatchDto);
        const savedWatch = await this.watchRepository.save(watch);

        // Add watch to Algolia
        // await this.algoliaIndex.saveObject({ ...savedWatch, objectID: savedWatch.id });

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
                message: `Updating watch with ID: ${id}`,
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

            // Update the watch in Algolia
            // await this.algoliaIndex.partialUpdateObject({ ...updatedWatch, objectID: updatedWatch.id });

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
     * Get all watches with pagination
     * 
     * @param page 
     * @param limit 
     * @returns 
     */
    async getAll(page: number = 1, limit: number = 25) {
        const [watches, total] = await this.watchRepository.findAndCount({
            relations: ['brand', 'currency', 'country'],
            skip: (page - 1) * limit,
            take: limit,
        });

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
                currencyName: watch.currency ? watch.currency.name : null,
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

    /**
     * Search watches by queries
     * 
     * @param query 
     * @returns 
     */
    async searchWatches(query: string): Promise<any> {
        const results = await this.algoliaIndex.search(query, {
            attributesToRetrieve: ['id', 'name', 'brand', 'referenceNumber'],
            hitsPerPage: 10,
        });

        return results.hits;
    }
}
