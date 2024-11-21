# Watch Catalogue Project

## Description

This project is a simple Watch Catalogue with a search feature as the main focus.

## System Design
Please check [here](./src/docs/system-design.MD) to see more detail about the APIs system design

## Project Setup

Before you can start the project, ensure all dependencies are installed:

```bash
$ npm install
```

## Running the Project

You can choose to run the project locally. The following instructions cover the setup for local development
### 1. Local Development Setup

To run the project locally, use the following commands:

#### Development Mode

```bash
$ npm run start
```

This command will start the application in development mode.

#### Watch Mode

```bash
$ npm run start:dev
```

This will start the application in watch mode, where changes to the code will automatically restart the server.

#### Production Mode

```bash
$ npm run start:prod
```

This will start the application in production mode. Ensure your production environment variables are configured correctly.

#### Step 1: Set Up Environment Variables

Create a `.env` file in the root directory with the following configuration:

```env
DB_TYPE=db_type
PG_USER=your_db_username
PG_PASSWORD=your_db_password
PG_DB=your_db_name
PG_PORT=port
PG_HOST=localhost
SECRET=your_secret_token
PORT=8000
```
Check the `.env-example` file [here](.env-example).

#### Step 2: Running migration file to create Tables
I have been setup the tables using typeorm migration, use the following commands to run the migration:
```
npm run migration:run
```

#### Step 3: Running seeder
to run the seeder data, use the following commands:
```
npm run seed
```

now APIs is ready to use!!

## Running Tests

You can run tests to ensure the application is functioning as expected.

### Unit Tests

```bash
$ npm run test
```

This will execute the unit tests for the project.

### Test Coverage

```bash
$ npm run test:cov
```

This will run the tests and generate a coverage report.

## Documentation

You can read the APIs doc after you run the APIs to understand how the API work.

### Swagger
To access the API documentation through Swagger, open your browser and paste the following URL. 
Once the application is running, we can access the Swagger API documentation to interact with the API.

```
http://localhost:${your_port}/api-docs#
```
- Replace `${your_port}` with the port defined in your `.env` file or the default (e.g., `8000`).
- **Example**: If the application is running on port `8000`, visit `http://localhost:8000/api-docs#` to access the API documentation.

## Postman
**Note:** <br>
My Swagger setup is currently experiencing issues with the `Lock` button on the Swagger UI not being clickable. As an alternative, you can access the API documentation through a Postman collection.
I already include the postman collection [here](watch_catalogue.postman.json)

**Steps to Import Postman Collection**:
1. Open Postman.
2. Click on "Import" in the top-left corner.
3. Select "File" and upload the `watch_catalogue.postman.json` file from this repository.
4. After importing, you can start making API requests using the defined endpoints.

## Additional Notes
- **Environment Variables**: The `.env` file is critical for configuring the application correctly, especially for connecting to the PostgreSQL database and generating JWT tokens.