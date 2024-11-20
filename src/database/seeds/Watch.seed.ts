import { DataSource } from "typeorm";
import { Brand } from "../../brands/entity/brand.entity";
import { Country } from "../../countries/entity/country.entity";
import * as fs from "fs";
import * as path from "path";
import { setLog } from "../../common/logger.helper"; // Adjust path as needed
import { Currency } from "../../currencies/entity/currency.entity";
import { Watch } from "../../watches/entity/watch.entity";

export class WatchSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const brandRepository = this.dataSource.getRepository(Brand);
    const countryRepository = this.dataSource.getRepository(Country);
    const currencyRepository = this.dataSource.getRepository(Currency);
    const watchRepository = this.dataSource.getRepository(Watch);

    try {
      // Dynamically load the watch data from a JSON file
      const filePath = path.resolve(__dirname, "../data/watches/cartier.json");
      const rawData = fs.readFileSync(filePath, "utf-8");

      // Parse the JSON data
      const watchData = JSON.parse(rawData);

      // Check if watches already exist to avoid duplication
      const existingWatch = await watchRepository.find({
        where: watchData.map((watch: { referenceNumber: string }) => ({ referenceNumber: watch.referenceNumber })),
      });

      if (existingWatch.length > 0) {
        setLog({
          level: 'info',
          method: 'WatchSeeder',
          message: 'Watches already exist!',
        });
        return;
      }

      // Prepare watches for insertion
      const watchesToSave = await Promise.all(
        watchData.map(async (watchData: {
          name: string;
          brand: string;
          referenceNumber: string;
          retailPrice: number;
          countryCode: string;
          currency: string;
          releaseDate: string;
        }) => {
          // Find the corresponding country
          const country = await countryRepository.findOne({ where: { code: watchData.countryCode } });
          if (!country) {
            setLog({
              level: 'warn',
              method: 'WatchSeeder',
              message: `Skipping watch due to missing country with code: ${watchData.countryCode}`,
            });
            return null;
          }

          // Find the corresponding currency
          const currency = await currencyRepository.findOne({ where: { code: watchData.currency } });
          if (!currency) {
            setLog({
              level: 'warn',
              method: 'WatchSeeder',
              message: `Skipping watch due to missing currency with code: ${watchData.currency}`,
            });
            return null;
          }

          // Find the corresponding brand
          const brand = await brandRepository.findOne({ where: { name: watchData.brand } });
          if (!brand) {
            setLog({
              level: 'warn',
              method: 'WatchSeeder',
              message: `Skipping watch due to missing brand with name: ${watchData.brand}`,
            });
            return null;
          }

          const watch = new Watch();
          watch.name = watchData.name;
          watch.brand = brand;
          watch.referenceNumber = watchData.referenceNumber;
          watch.retailPrice = watchData.retailPrice;
          watch.currency = currency;
          watch.country = country;
          watch.releaseDate = watchData.releaseDate;

          return watch;
        })
      );

      // Filter out null values
      const validWatchesToSave = watchesToSave.filter(watch => watch !== null);

      if (validWatchesToSave.length > 0) {
        // Save all watches to the database
        await watchRepository.save(validWatchesToSave);
        setLog({
          level: 'info',
          method: 'WatchSeeder',
          message: 'Watches have been seeded',
        });
      } else {
        setLog({
          level: 'warn',
          method: 'WatchSeeder',
          message: 'No valid watches to seed',
        });
      }
    } catch (error) {
      setLog({
        level: 'error',
        method: 'WatchSeeder',
        message: 'Error seeding watches',
        error: error as Error,
      });
    }
  }
}
