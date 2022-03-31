# KOTE Gameplay Service

This documentation will serve as a starting point to install and run the service with necessary commands and resources.

for local development is recommended to have installed:

-   Node 16 or higher
-   Mongo DB (can be dockerized)
-   MySQL 5.7 or higher (can be dockerized)

To install we just need to run `npm run install`

Then we run `cp .env.example .env` to create the `.env` file. Next, we replace the our dabatase values and 

To create the MySQL data schema we run `npx prisma db push`

To modify the db structure we open the file `schema.prisma` and add/modify the tables or columns as needed, you can refer to [its documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)

After we modify the file, we run `npx prisma migrate dev --name "the_specified_modification` to generate the new schema and save the migration on the project

To run the included seeders, we run `npm run seed`

This project has Swagger Docs included for quick test and references under the `/api` route.

To start the project in dev mode we run `npm run start:dev` and leave the console open