# KOTE Gameplay Service

This documentation will serve as a starting point to install and run the service with necessary commands and resources.

For local development is recommended to have installed:

-   Node 16 or higher
-   Mongo DB (can be dockerized)

To install we just need to run `npm install`

Then we run `cp .env.example .env` to create the `.env` file. Here is an example:

```
MONGODB_URL=mongodb://localhost/kote
SSL_CERT_PATH=""
SSL_KEY_PATH=""
GET_PROFILE_URL="http://localhost:8000/v1/user"
NODE_ENV="development"
```

| Key             | Value                                                                   |
| --------------- | ----------------------------------------------------------------------- |
| MONGODB_URL     | The mongo db url for local/remote database connection                   |
| SSL_CERT_PATH   | The path for the `server.crt` file for SSL                              |
| SSL_KEY_PATH    | The path for the `server.key` file for SSL                              |
| GET_PROFILE_URL | API route to gte the user pfile on the auth service                     |
| NODE_ENV        | Environment where the service is running: `development` or `production` |

Once the `.env` file is set, we can run `npm run seed` to seed the database with the initial data.

To refresh the database and set the defaut values, run `npm run seed:refresh`

This project has Swagger Docs included for quick test and references under the `/api` route.
This route can be only viewed with the `development` optino on the `NODE_ENV` key.

To start the project in dev mode we run `npm run start:dev` and leave the console open in the background.

If you prefer tu run with the debugger for Visual Studio Code, run `npm run start:debug`

For socket connection, the socket server runs on the same port (`3000` on local, `443` for SSL) that the service is running.
