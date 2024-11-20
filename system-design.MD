## A. Functional Requirements:
1. Create new watch model, with these input (name, brand, referenceNumber, retailPrice, currency, releaseDate).
2. Get the list of watches (including name and referenceNumber).
3. Filter models by brand.
4. Get the details of watch to see all detail information.
5. Edit watch information (except the name).
6. Pagination on the list of watches.
7. API documentation with swagger or similar tool.
8. Implementation protected routes for creating, updating, while allowing public access to retrieve watch information.
9. Write unit tests for the APIs.
10. Implement search functionality to find watches by name or reference number.

## B. Non-functional requirements:
1. Security, using Authentication and authorization to make sure the APIs is secure.
2. Logging, we need logging because:
    - To call attention to errors or add context before crashing, 
    - Help us to tracing of program execution,
    - Capture potentially problematic state in warning
3. Error Handling is crucial here.
4. Documentation, will be helpful to let other devs understanding the system.
5. Can we add caching here for search feature?

## C. API Layer:
### POST
| Endpoint Name      | Input                                                                           |
|--------------------|---------------------------------------------------------------------------------|
| /v1/users/register    | name, email, passsword                                                          |
| /v1/user/login | email, password |
| /v1/currency/create| name, code, countryId, symbol                                                   |
| /v1/watch/create   | name, brandId, referenceNumber, retailPrice, currencyId, countryId, releaseDate |
| /v1/brand/create   | name, countryId                                                                 |
| /v1/country/create | name,                                                                           |

### GET
| Endpoint Name     | Params                                        |
|-------------------|-----------------------------------------------|
| /v1/watch/params  | brand, example: /v1/watch/brand=Rolex         |
|                   | name, example: /v1/watch/name=Submariner      |
|                   | referenceNumber, example: /v1/watch/1234      |
| /v1/watch/{id}    | watchId, example: /v1/watch/1                 |
| /v1/watch/list    | NA                                            |
| /v1/brand/{id}    | brandId, example: /v1/brand/1                 |
| /v1/brand/list    | NA                                            |
| /v1/country/{id}  | countryId, example: /v1/country/1             |
| /v1/country/list  | NA                                            |
| /v1/currency/{id} | currencyId, example: /v1/currency/1           |
| /v1/currency/list | NA                                            |
| /v1/users/{id} | userId, example: /v1/users/1           |
| /v1/users | NA                                            |
| /v1/users/my-profile | JWT_auth_token |

### PUT
| Endpoint Name      | Params                                                                    |
|--------------------|---------------------------------------------------------------------------|
| /v1/users/:id       | name, email                                                               |
| /v1/currency/:id   | name, code, countryId, symbol                                             |
| /v1/watch/:id      | brandId, referenceNumber, retailPrice, currencyId, countryId, releaseDate |
| /v1/brand/:id      | name. countryId                                                           |
| /v1/country/:id    | name                                                                      |

## D. Database Layer
| User Table |                                     |
|------------|-------------------------------------|
| id         | userId AS UUID PRIMARY KEY NOT NULL |
| name       | VARCHAR                             |
| email      | VARCHAR NOT NULL                    |
| password   | VARCHAR NOT NULL                    |
| createdAt  | Timestamp                           |
| updatedAt  | Timestamp                           |
| deletedAt  | Timestamp                           |

| Watch Table     |                                                                             |
|-----------------|-----------------------------------------------------------------------------|
| id              | UUID PRIMARY KEY NOT NULL                                        |
| name            | VARCHAR NOT NULL                                                            |
| brandId         | UUID REFERENCES brands(id) ON DELETE SET NULL,  -- Link to Brand table      |
| referenceNumber | VARCHAR NOT NULL UNIQUE                                                     |
| retailPrice     | BIGINT NOT NULL                                                             |
| currencyId      | UUID REFERENCES countries(id) ON DELETE SET NULL|
| releaseDate     | DATE NOT NULL                                                             |
| countryId       | UUID REFERENCES countries(id) ON DELETE SET NULL,  -- Link to Country table |
| createdAt       | Timestamp                                                                   |
| updatedAt       | Timestamp                                                              |           

| Brand Table   |                                                       |
|---------------|-------------------------------------------------------|
| id            | UUID PRIMARY KEY                           |
| name          | VARCHAR NOT NULL                                      |
| originCountry | UUID REFERENCES countries(id) ON DELETE SET NULL |
| createdAt     | Timestamp                                             |
| updatedAt     | Timestamp                                             |
| deletedAt     | Timestamp                                             |

| Country Table |                               |
|---------------|-------------------------------|
| id            | UUID PRIMARY KEY |
| name          | VARCHAR NOT NULL              |
| code          | VARCHAR NOT NULL              |
| createdAt     | Timestamp                     |
| updatedAt     | Timestamp                     |

| Currency Table |                                |
|----------------|--------------------------------|
| id             | UUID PRIMARY KEY |
| name           | VARCHAR(100) NOT NULL          |
| code           | VARCHAR (10) NOT NULL UNIQUE   |
| countryId | UUID REFERENCES countries(id) ON DELETE SET NULL,  -- Link to Country table |
| symbol         | VARCHAR (10)                   |
| createdAt      | Timestamp                      |
| updatedAt      | Timestamp                      |