import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { Watch } from '../../../watches/entity/watch.entity'; // Adjust the path to your Watch entity
import { Brand } from '../../../brands/entity/brand.entity'; // Adjust the path to your Brand entity
import { Country } from '../../../countries/entity/country.entity'; // Adjust the path to your Country entity
import { Currency } from '../../../currencies/entity/currency.entity'; // Adjust the path to your Currency entity

// Define a function to parse the CSV
async function parseCsv(filePath: string): Promise<Partial<Watch>[]> {
  const results: Partial<Watch>[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        try {
          const countryCode = extractCountryCode(row['aaaaaaaaaaaaaaaaa']);
          const currency = extractCurrency(row['price']);
          const watch: Partial<Watch> = {
            name: row['name'],
            brand: { name: row['brand'] } as Brand,
            referenceNumber: row['ref'],
            retailPrice: extractPrice(row['price']),
            releaseDate: formatYear(row['yop']),
            country: { code: countryCode } as Country,
            currency: { code: currency } as Currency,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          results.push(watch);
        } catch (error) {
          console.error('Error processing row:', row, error);
        }
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Helper function to extract country code
function extractCountryCode(shippingDetails: string): string {
  const countryCodeMatch = shippingDetails.match(/\s([A-Z]{2})$/);
  return countryCodeMatch ? countryCodeMatch[1] : null;
}

// Helper function to extract currency
function extractCurrency(priceString: string): string {
  if (priceString.includes('$')) return 'USD';
  if (priceString.includes('€')) return 'EUR';
  if (priceString.includes('£')) return 'GBP';
  return null;
}

// Helper function to clean and extract price
function extractPrice(priceString: string): number {
  return Number(priceString.replace(/[^0-9.]/g, '')) || 0;
}

// Helper function to format year as a date
function formatYear(yearString: string): string {
  return yearString ? `${yearString.split(' ')[0]}-01-01` : null;
}

// Main function to process the CSV from '../raw/cartier.csv'
async function main() {
  const filePath = '../raw/cartier.csv'; // Specify the CSV file path directly
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  try {
    console.log(`Processing file: ${filePath}`);
    const watches = await parseCsv(filePath);
    console.log(JSON.stringify(watches, null, 2)); // Output the JSON to the console
  } catch (error) {
    console.error('Error processing the file:', error);
    process.exit(1);
  }
}

main();
