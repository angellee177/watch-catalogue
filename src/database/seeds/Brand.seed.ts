import { DataSource } from "typeorm";
import { Brand } from "../../brands/entity/brand.entity";
import { Country } from "../../countries/entity/country.entity";
import * as fs from "fs";
import * as path from "path";
import { setLog } from "../../common/logger.helper"; // Adjust path as needed

export class BrandSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const brandRepository = this.dataSource.getRepository(Brand);
    const countryRepository = this.dataSource.getRepository(Country);

    try {
      // Dynamically load the watch brand data from a JSON file
      const filePath = path.resolve(__dirname, "../data/watchBrands.json");
      const rawData = fs.readFileSync(filePath, "utf-8");

      // Parse the JSON data
      const watchBrandsData = JSON.parse(rawData);

      // Check if watch brand already exist to avoid duplication
      const existingBrand = await brandRepository.find({
        where: watchBrandsData.map((brand: { name: string }) => ({ name: brand.name })),
      });

      if (existingBrand.length > 0) {
        setLog({
          level: 'info',
          method: 'BrandSeeder',
          message: 'Brand already exist!',
        });
        return;
      }

    // Prepare watch brand for insertion
    const watchBrandsToSave = await Promise.all(
            watchBrandsData.map(
                async (watchBrandsData: { name: string; countryCode: string }) => {
                    // Find the corresponding country
                    const country = await countryRepository.findOne({
                            where: { code: watchBrandsData.countryCode } 
                    });

                    if (!country) {
                        setLog({
                            level: 'warn',
                            method: 'BrandSeeder',
                            message: `Skipping brand due to missing country with code: ${watchBrandsData.countryCode}`,
                        });
                        return null; // Skip this watch brand if no matching country is found
                    }

                    const watchBrands = new Brand();
                    watchBrands.name = watchBrandsData.name;
                    watchBrands.originCountry = country;

                    return watchBrands;
                }
            )
        );

    if (watchBrandsToSave.length > 0) {
        // Save all watch brand to the database
        await brandRepository.save(watchBrandsToSave);
        setLog({
            level: 'info',
            method: 'BrandSeeder',
            message: 'Brands have been seeded',
        })
    } else {
        setLog({
            level: 'error',
            method: 'BrandsSeeder',
            message: 'Error seeding watch brands',
        })
    }
    } catch (error) {
      setLog({
        level: 'error',
        method: 'BrandSeeder',
        message: 'Error seeding Brand',
        error: error as Error,
      });
    }
  }
}
