# KOTE Gameplay Service

This documentation will serve as a starting point to install and run the service with necessary commands and resources.

for local development is recommended to have installed:

-   Node 16 or higher
-   Mongo DB (can be dockerized)

To install we just need to run `npm run install`

Then we run `cp .env.example .env` to create the `.env` file. Next, we replace the our dabatase values and

This project has Swagger Docs included for quick test and references under the `/api` route.

To start the project in dev mode we run `npm run start:dev` and leave the console open in the background

For socket connection, the socket server runs on the same port (3000 on local) for the whole project
