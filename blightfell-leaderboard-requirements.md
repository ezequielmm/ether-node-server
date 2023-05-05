We need to add a few endpoints to support Trove leaderboards and quests.
The endpoints will need to be authenticated in some way, likely an authentication token that is shared with Trove.

Note: if you have preferred naming conventions for parameters and return values they are fine, these are just for reference.

#### Leaderboard

List all expeditions and their score in a certain time range, results will need be paginated.

Parameters:
- `startDate` ISO formatted date
- `endDate` ISO formatted date
- `pageSize` the maximum number of results
- `page` the page of results (based on pageSize)

Requirements:
- Results limited to 1 per user (their highest score in the time range).
- Results should only include expeditions that started after the `startDate` and ended before the `endDate` to avoid leaderboards changing after a given date.
- Results should be sorted by score first and end date second (so earlier scores stay above newer ones).

Returns:

```json
{
  "data": [
    {
      "address": "0x0000000000000000000000000000000000000000",
      "score": 350,
    },
    {
      "address": "0x0000000000000000000000000000000000000000",
      "score": 340,
    },
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 50,
    "totalItems": 230,
    "totalPages": 5
  }
}
```

This could also include a full score breakdown but for now only the total score matters.

Alternatively we can replace `startDate` and `endDate` with `eventId` which would require coordinating all event IDs over the 3 week tournament, if this approach is taken they still need to have ended the expedition before the contest/event's `endDate` to avoid the leaderboard changing if people finish late.

#### Participation (Quest)

A batched query to check how many days players have played over a certain time period.

Parameters:
- `addresses` a list of user wallet addresses
- `startDate` ISO formatted date
- `endDate` ISO formatted date

Requirements:
- Ensure only 1 per day is counted, days can be based on the expedition's start date.
- The expedition must have ended so players can't just start a run each day.

Response:

```json
{
  "data": [
    {
      "address": "0x0000000000000000000000000000000000000000",
      "daysPlayed": 18
    },
    {
      "address": "0x0000000000000000000000000000000000000000",
      "daysPlayed": 5
    }
  ]
}
```

We can discuss how many is a reasonable number of addresses to batch in a single request.

#### User's Highest Score (Quest)

A batched query to get user's highest score over a certain time period.

Parameters:
- `addresses` a list of user wallet addresses
- `startDate` ISO formatted date
- `endDate` ISO formatted date

Requirements:
- Results should only include expeditions that started after the `startDate` and ended before the `endDate`.

Response:

```json
{
  "data": [
    {
      "address": "0x0000000000000000000000000000000000000000",
      "score": 400
    },
    {
      "address": "0x0000000000000000000000000000000000000000",
      "score": 380
    }
  ]
}
```
