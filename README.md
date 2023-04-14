# KOTE Gameplay Service

| Server      | Status                                                                                                                                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Development | [![Laravel Forge Site Deployment Status](https://img.shields.io/endpoint?url=https%3A%2F%2Fforge.laravel.com%2Fsite-badges%2F2eb3b12e-c3be-49bf-a341-d9f5bb5849fa%3Fdate%3D1%26commit%3D1&style=plastic)](https://forge.laravel.com) |
| Staging     | [![Laravel Forge Site Deployment Status](https://img.shields.io/endpoint?url=https%3A%2F%2Fforge.laravel.com%2Fsite-badges%2F873a6505-341a-442a-9088-bee080900361%3Fdate%3D1%26commit%3D1&style=plastic)](https://forge.laravel.com) |

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
NFT_SERVICE_URL="http://nft-service.dev.robotseamonster.com"
NFT_SERVICE_CONTRACT_ID="0x80e2109a826148b9b1a41b0958ca53a4cdc64b70"
NFT_SERVICE_CHAIN_ID="5"
NFT_SERVICE_AUTHORIZATION="vJGApId83NIZnmfkWUrFGOjdxTr4IQBM2WRq2PBj2pjEdZrirC6fAiL1orifv2VO"

#for production
NFT_SERVICE_CONTRACT_ID="0x32A322C7C77840c383961B8aB503c9f45440c81f"
NFT_SERVICE_CHAIN_ID="1"
```

| Key                       | Value                                                                   |
| ------------------------- | ----------------------------------------------------------------------- |
| MONGODB_URL               | The mongo db url for local/remote database connection                   |
| SSL_CERT_PATH             | The path for the `server.crt` file for SSL                              |
| SSL_KEY_PATH              | The path for the `server.key` file for SSL                              |
| GET_PROFILE_URL           | API route to get the user profile on the auth service                   |
| NODE_ENV                  | Environment where the service is running: `development` or `production` |
| NFT_SERVICE_URL           | API route to get wallet tokens from the nft service                     |
| NFT_SERVICE_CONTRACT_ID   | Contract id for nft srevice queries                                     |
| NFT_SERVICE_CHAIN_ID      | The chain id for nft srevice queries                                    |
| NFT_SERVICE_AUTHORIZATION | The value of the Authorization header for the nft service               |

Once the `.env` file is set, we can run `npm run seed` to seed the database with the initial data.

To refresh the database and set the defaut values, run `npm run seed:refresh`

This project has Swagger Docs included for quick test and references under the `/api` route.
This route can be only viewed with the `development` optino on the `NODE_ENV` key.

To start the project in dev mode we run `npm run start:dev` and leave the console open in the background.

If you prefer tu run with the debugger for Visual Studio Code, run `npm run start:debug`

For socket connection, the socket server runs on the same port (`3000` on local, `443` for SSL) that the service is running.
