import { DataSource } from "typeorm";
import { Watch } from "../../watches/entity/watch.entity";
import { Brand } from "brands/entity/brand.entity";
import { Currency } from "currencies/entity/currency.entity";
import { Country } from "countries/entity/country.entity";
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { setLog } from '../../common/logger.helper';

export class WatchSeeder {
    constructor(private dataSource: DataSource) {}

    async run() {
        const watchRepository = this.dataSource.getRepository(Watch);
        const brandRepository = this.dataSource.getRepository(Brand);
        const currencyRepository = this.dataSource.getRepository(Currency);
        const countryRepository = this.dataSource.getRepository(Country);

        try {
            const directoryPath = path.resolve(__dirname, '../data/watch/ready');
            const files = fs.readdirSync(directoryPath).filter((file) => file.endsWith('.csv'));

            if (files.length === 0) {
                setLog({
                    level: 'warn',
                    method: 'WatchSeeder',
                    message: `No CSV files found in directory: ${directoryPath}`,
                });

                return;
            }

            for (const file of files) {
                const filePath = path.join(directoryPath, file);
                setLog({
                    level: 'info',
                    method: 'WatchSeeder',
                    message: `Processing file: ${filePath}`,
                });

                const readStream = fs.createReadStream(filePath);

                // Process the file line by line
                await new Promise<void>((resolve, reject) => {
                    readStream
                        .pipe(csv())
                        .on('data', async (row: any) => {
                            try {
                                const existingWatch = await watchRepository.findOne({
                                    where: { referenceNumber: row.reference_number },
                                });

                                if (existingWatch) {
                                    setLog({
                                        level: 'info',
                                        method: 'WatchSeeder',
                                        message: `Skipping existing watch: ${row.reference_number}`
                                    });

                                    return;
                                }

                                const brand = await brandRepository.findOne({ 
                                    where: { name: row.brand }
                                });

                                const currency = await currencyRepository.findOne({
                                    where: { code: row.currency }
                                });

                                const country = await countryRepository.findOne({
                                    where: { name: row.country }
                                });

                                const watch = new Watch();
                                watch.name = row.name || '';
                                watch.brand = brand || null;
                                watch.referenceNumber = row.reference_number || '';
                                watch. retailPrice = parseInt(row.price.replace (/[^\d]/g, ''), 10) || 0; 
                                watch. currency = currency || null;
                                watch.releaseDate = row.release_date || '';
                                watch.country = country || null;
                                
                                await watchRepository.save(watch);
                                setLog({
                                    level: 'info',
                                    method: 'WatchSeeder',
                                    message: `Saved watch: ${row.name}`,
                                });
                            } catch (err) {
                                setLog({
                                    level: 'error',
                                    method: 'WatchSeeder',
                                    message: `Error processing row: ${JSON.stringify(row)}`,
                                    error: err as Error,
                                });
                            }
                        })
                        .on('end', () => {
                            setLog({
                                level: 'info',
                                method: 'WatchSeeder',
                                message: `Finished processing file: ${filePath}`,
                            });

                            resolve();
                        })
                        .on('error', (error) => {
                            setLog({
                                level: 'error',
                                method: 'WatchSeeder',
                                message: `Error reading file: ${filePath}`,
                                error: error as Error,
                            });

                            reject(error);
                        });
                });
            }
        } catch (error) {
            setLog({
                level: 'error',
                method: 'WatchSeeder',
                message: `Error during seeding process`,
                error: error as Error,
            })
        }
    }
}