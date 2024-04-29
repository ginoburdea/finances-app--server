# Finances App - Backend

## Prerequisites

1. Make sure you have Node.js and NPM installed
1. Make sure you have MongoDB installed and running (or have a MongoDB Atlas account)

## Running the app

1. Clone the repository `git clone https://github.com/ginoburdea/finances-app--server.git server`
1. Open a terminal inside it `cd server`
1. Copy the .env.example file into a .env file `cp .env.example .env`
1. Install the required dependencies `npm install`
1. Run the app `npm run dev`

## Commands

1. Run the app in development mode (watch mode enabled): `npm run dev`
1. Run the app in production mode (watch mode disabled; env variables must be loaded manually): `npm start`
1. Run the tests (watch mode enabled): `npm test`
1. Run the tests (watch mode disabled): `npm test:once`

## Project structure

The project structure is inspired by the controller/service/model structure. Instead of controllers, we have providers.

### Source code (src folder)

-   Entrypoint: `src/index.js`
-   GraphQL schema: `src/schema.gql`
-   GraphQL resolvers (the functions that will handle queries and mutations): `src/resolvers`
    -   Don't forget to add them to `src/resolvers/index.js` too if you create a new resolvers file
-   Data validators: `src/validators`
-   Services: `src/services`
-   Utils / helper functions: `src/utils`

### Tests (test folder)

-   Services test: `test/services/*.spec.js`
-   E2E test (soon): `test/e2e/*.spec.js`

-   Utils / helper functions: `test/utils`
-   Setup file (runs before all tests): `test/utils/setup.cjs`
-   Factories (useful for seeding the database): `test/utils/factories`
-   Service response validators: `test/utils/validators/services`
-   E2E response validators (soon): `test/utils/validators/e2e`

## License

This project is licensed under the MIT license. See the `LICENSE.md` file for more information.
