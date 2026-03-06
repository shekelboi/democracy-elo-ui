## Democracy ELO API (`main.py`)

This API exposes a simple ELO-based rating system for countries, backed by SQLite and implemented with FastAPI.

- **App module**: `main.py`
- **Framework**: FastAPI
- **Database**: SQLite (`db/countries.sqlite`, table `country`)
- **Typical local base URL**: `http://localhost:8000`

### Data model: `Country`

Each country is stored in the `country` table with:

- **id** (`TEXT`, primary key): Country identifier (e.g. `USA`, `FRA`). Lookups are done case-insensitively by uppercasing the input.
- **name** (`STRING`): Human-readable country name.
- **elo** (`FLOAT`): Current ELO rating.

All endpoints return plain model objects; in JSON, a `Country` looks like:

```json
{
  "id": "USA",
  "name": "United States",
  "elo": 1532.4
}
```

### GET `/countries`

- **Description**: Returns all countries with their current ELO ratings.
- **Method**: `GET`
- **Query params**: None
- **Response**: `200 OK` with a JSON array of `Country` objects.

Example:

```http
GET /countries HTTP/1.1
Host: localhost:8000
```

Response body:

```json
[
  {
    "id": "USA",
    "name": "United States",
    "elo": 1532.4
  },
  {
    "id": "FRA",
    "name": "France",
    "elo": 1498.2
  }
]
```

### GET `/country`

- **Description**: Fetch a single country by its identifier.
- **Method**: `GET`
- **Query params**:
  - **id** (`string`, required): Country ID (case-insensitive).
- **Responses**:
  - `200 OK` with a single `Country` object if found.
  - `400 Bad Request` with `{"error": "Country not found"}` if the ID does not exist.

Example:

```http
GET /country?id=usa HTTP/1.1
Host: localhost:8000
```

### GET `/random_pair`

- **Description**: Returns two distinct random countries for comparison/voting.
- **Method**: `GET`
- **Query params**: None
- **Response**: `200 OK` with a JSON array of two `Country` objects.

Example:

```http
GET /random_pair HTTP/1.1
Host: localhost:8000
```

### POST/GET `/select_winner`

Registers the outcome of a "match" between two countries and updates their ELO scores using the `calculate_elo` function in `main.py`.

- **Methods**: `POST`, `GET`
- **Query/body params** (for both methods; in `POST` they can be sent as query params or form-encoded, depending on your client):
  - **country1_id** (`string`, required): ID of the first country (winner if `winner=true`).
  - **country2_id** (`string`, required): ID of the second country (winner if `winner=false`).
  - **winner** (`bool`, required): `true` if `country1` wins, `false` if `country2` wins.
- **Behavior**:
  - Looks up both countries (IDs uppercased).
  - Computes the ELO change based on their current `elo` values and the `winner` flag.
  - Increases the winner's `elo` and decreases the loser's `elo` by the same amount.
  - Commits the changes to the database.
- **Responses**:
  - `200 OK` with `{"change": <float>}` — the signed rating change added to `country1` and subtracted from `country2`.
  - `400 Bad Request` with `{"error": "Country not found"}` if either ID is invalid.

Example (GET):

```http
GET /select_winner?country1_id=usa&country2_id=fra&winner=true HTTP/1.1
Host: localhost:8000
```

Example (POST with query params):

```http
POST /select_winner?country1_id=usa&country2_id=fra&winner=false HTTP/1.1
Host: localhost:8000
```

### ELO calculation notes

The ELO change uses:

- **Inputs**: `country1.elo`, `country2.elo`, and `winner` (1 if `country1` wins, 0 otherwise).
- **K-factor**: `20`
- **Meaning of `change`**:
  - Add `change` to `country1.elo`.
  - Subtract the same amount (rounded in storage) from `country2.elo`.

