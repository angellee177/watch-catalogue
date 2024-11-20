import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brand } from "./entity/brand.entity";
import { Repository } from "typeorm";
import { setLog } from "../common/logger.helper";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";

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

    /**
     * Create new brand
     * 
     * @param createBrandDto 
     * @returns 
     */
    async createBrand(createBrandDto: CreateBrandDto): Promise<Brand> {
        try {
            setLog({
                level: 'info',
                method: 'BrandService.createBrand',
                message: 'Creating a new brand',
                others: JSON.stringify(createBrandDto),
            });

            const newBrand = this.brandRepository.create(createBrandDto);
            const brand = await this.brandRepository.save(newBrand);

            setLog({
                level: 'info',
                method: 'BrandService.createBrand',
                message: `Brand ${brand.name} created successfully`,
            });

            return brand;
        } catch (error) {
            setLog({
                level: 'error',
                method: 'BrandService.createBrand',
                message: 'Error while creating brand',
                error,
            });
            throw error;
        }
    }

    /**
     * update a brand
     * 
     * @param id 
     * @param updateBrandDto 
     * @returns 
     */
    async updateBrand(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
        try {
            setLog({
                level: 'info',
                method: 'BrandService.updateBrand',
                message: `Updating brand with ID: ${id}`,
                others: JSON.stringify(updateBrandDto),
            });

            const brand = await this.brandRepository.findOne({ where: { id } });

            if (!brand) {
                setLog({
                    level: 'warn',
                    method: 'BrandService.updateBrand',
                    message: `Brand with ID: ${id} not found`,
                });
                throw new NotFoundException(`Brand with ID ${id} not found`);
            }

            Object.assign(brand, updateBrandDto);
            await this.brandRepository.save(brand);

            setLog({
                level: 'info',
                method: 'BrandService.updateBrand',
                message: `Brand ${brand.name} updated successfully`,
            });

            return brand;
        } catch (error) {
            setLog({
                level: 'error',
                method: 'BrandService.updateBrand',
                message: 'Error while updating brand',
                error,
            });
            throw error;
        }
    }
}