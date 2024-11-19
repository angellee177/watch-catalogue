import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv';
import { join } from "path";
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: '.env' });

const config = {
    type: `${process.env.DB_TYPE}`,
    host: `${process.env.PG_HOST}`,
    port: `${process.env.PG_PORT}`,
    username: `${process.env.PG_USER}`,
    password: `${process.env.PG_PASSWORD}`,
    database: `${process.env.PG_DB}`,
    entities: ["src/**/*.entity{.ts,.js}"],
    migrations: ["src/**/*.migration{.ts,.js}"],
    autoLoadEntities: true,
    synchronize: false,
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);
