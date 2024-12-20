import { DataSource } from "typeorm";
import { connectionSource } from "../../config/typeorm"; // Adjust path as needed
import { UserSeeder } from "./User.seed"; // Import your UserSeeder
import { CountrySeeder } from "./Country.seed"; // Import your CountrySeeder
import { setLog } from "../../common/logger.helper"; // Adjust path as needed
import { CurrencySeeder } from "./Currency.seed";
import { BrandSeeder } from "./Brand.seed";
import { WatchSeeder } from "./Watch.seed";

// Function to load and run seeders
const runSeeders = async () => {
  const dataSource: DataSource = connectionSource;

  // Ensure the database connection is established first
  try {
    // Initialize TypeORM connection
    await dataSource.initialize();
    setLog({
      level: 'info',
      method: 'runSeeders',
      message: 'DataSource has been initialized!',
    });

    // Run User Seeder
    const userSeeder = new UserSeeder(dataSource);
    setLog({
      level: 'info',
      method: 'runSeeders',
      message: 'Running User Seeder...',
    });
    await userSeeder.run();

    // Run Country Seeder
    const countrySeeder = new CountrySeeder(dataSource);
    setLog({
      level: 'info',
      method: 'runSeeders',
      message: 'Running Country Seeder...',
    });
    await countrySeeder.run();

    // Run Currency Seeder
    const currencySeeder = new CurrencySeeder(dataSource);
    setLog({
      level: 'info',
      method: 'runSeeders',
      message: 'Running Currency Seeder...',
    });
    await currencySeeder.run();

    // Run Brand Seeder
    const brandSeeder = new BrandSeeder(dataSource);
    setLog({
      level: 'info',
      method: 'runSeeders',
      message: 'Running Watch Brand Seeder...',
    });
    await brandSeeder.run();

    // Run Watch Seeder
    const watchSeeder = new WatchSeeder(dataSource);
    setLog({
      level: 'info',
      method: 'runSeeders',
      message: 'Running Watch Seeder...',
    });
    await watchSeeder.run();    

    setLog({
      level: 'info',
      method: 'runSeeders',
      message: 'All seeders have been run!',
    });

    await dataSource.destroy(); // Disconnect from the database once done
  } catch (error) {
    setLog({
      level: 'error',
      method: 'runSeeders',
      message: 'Error during seeding',
      error: error as Error,
    });
  }
};

// Execute the seeding process
runSeeders();
