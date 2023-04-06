#### Leaderboard && Users Highest Score (Quest)
 
List all expeditions and their score in a certain time range, results will need be paginated.

Parameters:
- `startDate` (REQUIRED) ISO formatted date
- `endDate` (REQUIRED) ISO formatted date
- `addresses` (OPTIONAL) a list of user wallet addresses
- `onlyWin` (OPTIONAL) If true, only retrieve scores for expeditions ending in a victory. Default false. 
- `limit` (OPTIONAL) the maximum number of results. If excluded, default to 500.
- `skip` (OPTIONAL) skip this number of results before retrieving more. If excluded, skip 0.

Notes:
- Results are limited to 1 per wallet address (their highest score in the time range).
- Results are sorted by score, from highest descending.
- Results only include expeditions created on or after 0:0:0:000 UTC of `startDate` that ended before or at 23:59:59:999 UTC of `endDate`. This means that to retrieve scores from a single daily contest, you can provide the same date for both parameters.

Returns:

```json
{
  "data": [
    {
      "address": "0x0000000000000000000000000000000000000000",
      "score": 350,
    },
    {
      "address": "0x0000000000000000000000000000000000000001",
      "score": 340,
    },
  ]
}
```

This could also include a full score breakdown but for now only the total score matters.

#### Participation (Quest)

A batched query to check how many days players have played over a certain time period.

Parameters:
- `startDate` (REQUIRED) ISO formatted date
- `endDate` (REQUIRED) ISO formatted date
- `addresses` (OPTIONAL) a list of user wallet addresses
- `onlyWin` (OPTIONAL) If true, only count plays for expeditions ending in a victory. Default false.
- `limit` (OPTIONAL) the maximum number of results. If excluded, default to 500.
- `skip` (OPTIONAL) skip this number of results before retrieving more. If excluded, skip 0.

Notes:
- Each day is only counted once per wallet, regardless of the number of expeditions played that day.
- Expeditions that are in progress or cancelled will not be counted.
- Results only counts expeditions created on or after 0:0:0:000 UTC of `startDate` that ended before or at 23:59:59:999 UTC of `endDate`. 

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
