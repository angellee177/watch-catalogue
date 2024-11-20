import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brand } from "./entity/brand.entity";
import { Repository } from "typeorm";
import { setLog } from "../common/logger.helper";

@Injectable()
export class BrandService {
    constructor(
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>,
    ) {}

    /**
     * Find all brands with pagination
     * 
     * @param page 
     * @param limit 
     * @returns 
     */
    async getAllBrands(page: number= 1, limit: number = 25) {
        try {
            // Fetch watch brands with pagination
            const [brands, total] = await this.brandRepository.findAndCount({
                relations: ['originCountry'], // Include the related 'country entity
                skip: (page -1) * limit, // Skip records based on page. 
                take: limit, // Limit the number of records returned.
            })

            return {
                data: brands.map((brand) => ({
                    id: brand.id,
                    name: brand.name,
                    originCountryId: brand.originCountry ? brand.originCountry.id : null,
                    originCountry: brand.originCountry ? brand.originCountry.name : null,
                    originCountryCode: brand.originCountry ? brand.originCountry.code : null,
                    createdAt: brand.createdAt,
                    updatedAt: brand.updatedAt,
                    deletedAt: brand.deletedAt,
                })), // Return brands directly.
                meta: {
                    total, // Total number of brands.
                    page,   // Current page number.
                    limit,  // Limit per page (25 by default).
                }
            }
        } catch(error) {
            setLog({
                level: 'error',
                method: 'BrandService.getAllBrands',
                message: 'Error while fetching brands',
                error,
            });

            throw error;
        }
    }

    /**
     * Get a brand by Id
     * 
     * @param id 
     * @returns 
     */
    async getBrandById(id: string): Promise<Brand> {
        try {
            setLog({
                level: 'info',
                method: 'BrandService.getBrandById',
                message: `Fetching watch brand with ID: ${id}`,
            });

            const brand = await this.brandRepository.findOne({ where: { id } });
            if (!brand) {
                setLog({
                    level: 'warn',
                    method: 'BrandService.getBrandById',
                    message: `Brand with ID: ${id} not found`,
                });
                throw new NotFoundException(`Brand with ID ${id} not found`);
            }

            return brand;
        } catch (error) {
            setLog({
                level: 'error',
                method: 'BrandService.getBrandById',
                message: 'Error while fetching brand',
                error,
            });

            throw error;
        }
    }
}