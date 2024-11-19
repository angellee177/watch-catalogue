import { DataSource } from "typeorm";
import { connectionSource } from "../../config/typeorm"; // Adjust the path as needed
import { UserSeeder } from "./User.seed"; // Import your UserSeeder

// Function to load and run seeders
const runSeeders = async () => {
  const dataSource: DataSource = connectionSource;

  // Ensure the database connection is established first
  try {
    // Initialize TypeORM connection
    await dataSource.initialize();
    console.log("DataSource has been initialized!");

    // Manually run each seeder
    const userSeeder = new UserSeeder(dataSource);
    console.log("Running User Seeder...");
    await userSeeder.run();

    // You can add other seeders here as well
    // const anotherSeeder = new AnotherSeeder(dataSource);
    // console.log("Running Another Seeder...");
    // await anotherSeeder.run();

    console.log("All seeders have been run!");
    await dataSource.destroy(); // Disconnect from the database once done
  } catch (error) {
    console.error("Error during seeding:", error);
  }
};

// Execute the seeding process
runSeeders();
