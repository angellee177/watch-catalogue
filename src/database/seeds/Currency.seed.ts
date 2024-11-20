import { DataSource } from "typeorm";
import { Currency } from "../../currencies/entity/currency.entity";
import { Country } from "../../countries/entity/country.entity";
import * as fs from "fs";
import * as path from "path";
import { setLog } from "../../common/logger.helper"; // Adjust path as needed

export class CurrencySeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const currencyRepository = this.dataSource.getRepository(Currency);
    const countryRepository = this.dataSource.getRepository(Country);

    try {
      // Dynamically load the currency data from a JSON file
      const filePath = path.resolve(__dirname, "../data/currency.json");
      const rawData = fs.readFileSync(filePath, "utf-8");

      // Parse the JSON data
      const currenciesData = JSON.parse(rawData);

      // Check if currencies already exist to avoid duplication
      const existingCurrencies = await currencyRepository.find({
        where: currenciesData.map((currency: { code: string }) => ({ code: currency.code })),
      });

      if (existingCurrencies.length > 0) {
        setLog({
          level: 'info',
          method: 'CurrencySeeder',
          message: 'Currencies already exist!',
        });
        return;
      }

      // Prepare currencies for insertion
      const currenciesToSave = await Promise.all(currenciesData.map(async (currencyData: { name: string; code: string; countryCode: string; symbol?: string }) => {
        // Find the corresponding country
        const country = await countryRepository.findOne({ where: { code: currencyData.countryCode } });

        if (!country) {
          setLog({
            level: 'warn',
            method: 'CurrencySeeder',
            message: `Skipping currency due to missing country with code: ${currencyData.countryCode}`,
          });
          return null; // Skip this currency if no matching country is found
        }

        const currency = new Currency();
        currency.name = currencyData.name;
        currency.code = currencyData.code;
        currency.symbol = currencyData.symbol || null;
        currency.country= country; // Use countryId instead of the country entity

        return currency;
      }));

      // Filter out null values (countries that couldn't be found)
      const validCurrenciesToSave = currenciesToSave.filter(currency => currency !== null);

      if (validCurrenciesToSave.length > 0) {
        // Save all currencies to the database
        await currencyRepository.save(validCurrenciesToSave);
        setLog({
          level: 'info',
          method: 'CurrencySeeder',
          message: 'Currencies have been seeded',
        });
      } else {
        setLog({
          level: 'warn',
          method: 'CurrencySeeder',
          message: 'No valid currencies to seed',
        });
      }
    } catch (error) {
      setLog({
        level: 'error',
        method: 'CurrencySeeder',
        message: 'Error seeding currencies',
        error: error as Error,
      });
    }
  }
}
