import { DataSource } from "typeorm";
import { User } from "../../users/entity/user.entity"; // Adjust path as needed
import * as bcrypt from "bcrypt";
import * as fs from "fs";
import * as path from "path";

export class UserSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const userRepository = this.dataSource.getRepository(User);

    try {
      // Dynamically load the user data from a JSON file
      const filePath = path.resolve(__dirname, "../data/user.json");
      const rawData = fs.readFileSync(filePath, "utf-8");

      // Parse the JSON data
      const usersData = JSON.parse(rawData);

      // Check if users already exist to avoid duplication
      const existingUsers = await userRepository.find({
        where: usersData.map((user: { email: string }) => ({ email: user.email })),
      });

      if (existingUsers.length > 0) {
        console.log("Users already exist!");
        return;
      }

      // Hash passwords and prepare users for insertion
      const usersToSave = await Promise.all(
        usersData.map(async (userData: { name: string; email: string; password: string }) => {
          const user = new User();
          user.name = userData.name;
          user.email = userData.email;
          user.password = await bcrypt.hash(userData.password, 10);
          return user;
        })
      );

      // Save all users to the database
      await userRepository.save(usersToSave);
      console.log("Users have been seeded");
    } catch (error) {
      console.error("Error seeding users:", error);
    }
  }
}
