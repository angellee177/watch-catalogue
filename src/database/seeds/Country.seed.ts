import { DataSource } from "typeorm";
import { Country } from "../../countries/entity/country.entity"; // Adjust path as needed
import * as fs from "fs";
import * as path from "path";
import { setLog } from "../../common/logger.helper"; // Adjust path as needed

export class CountrySeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const countryRepository = this.dataSource.getRepository(Country);

    try {
      // Dynamically load the country data from a JSON file
      const filePath = path.resolve(__dirname, "../data/country.json");
      const rawData = fs.readFileSync(filePath, "utf-8");

      // Parse the JSON data
      const countriesData = JSON.parse(rawData);

      // Check if countries already exist to avoid duplication
      const existingCountries = await countryRepository.find({
        where: countriesData.map((country: { code: string }) => ({ code: country.code })),
      });

      if (existingCountries.length > 0) {
        setLog({
          level: 'info',
          method: 'CountrySeeder',
          message: 'Countries already exist!',
        });
        return;
      }

      // Prepare countries for insertion and validate 'code'
      const countriesToSave = countriesData.map((countryData: { name: string; code: string }) => {
        // Skip countries with invalid or missing 'code'
        if (!countryData.code) {
          setLog({
            level: 'warn',
            method: 'CountrySeeder',
            message: `Skipping country due to missing 'code': ${countryData.name}`,
          });
          return null; // Skip this country
        }

        const country = new Country();
        country.name = countryData.name;
        country.code = countryData.code;
        return country;
      }).filter(country => country !== null); // Remove null entries

      if (countriesToSave.length > 0) {
        // Save all countries to the database
        await countryRepository.save(countriesToSave);
        setLog({
          level: 'info',
          method: 'CountrySeeder',
          message: 'Countries have been seeded',
        });
      } else {
        setLog({
          level: 'warn',
          method: 'CountrySeeder',
          message: 'No valid countries to seed due to missing "code" values',
        });
      }
    } catch (error) {
      setLog({
        level: 'error',
        method: 'CountrySeeder',
        message: 'Error seeding countries',
        error: error as Error,
      });
    }
  }
}
