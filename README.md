### Trip Mate API Documentation (Node.js/Express/Postgres)

## Introduction

Hello!

Trip Mate's API is a REST API built using Node.js accompanied with Express/Knex(Postgres)
that is used to:

A) Store Users Trips for the future
B) Users can add plans to trips
C) Users can edit and delete plans and remove trips

### Technology Used

1) Node.js - Express
2) Postgres - Knex used for SQL/Javascript integration

### To Install Locally

1) Clone github repo to your machine
2) Run command 'npm install' to install dependencies locally
3) Run command 'npm run dev' to start up server locally

## API Documentation

### Authorization

Every API request will require a 'bearer ' token created by the json web token library,
there are no elements that does not require authoriztion of a signin.  2 dummy accounts have
been provided in the seed file.  If using postman or any other third party libray to put the
bearer token in the "Authorization" field

No API key required for access

### Responses

All GET requests will return JSON data of items listed in the associated endpoints (see further down),
POST of a new rule will also return a JSON version of that Rule (again, format will be listed below).

PATCH and DELETE will not return anything more that the associate status code listed at the bottom of
documentation

All Errors will return as follows:

{
  error: {Message: `this would be the message`}
}


### Endpoints

#### Auth Endpoints

```
POST /api/auth/login
```

For User authentication upon login

| Body Key    | Type        | Description |
| ----------- | ----------- | ----------- |
| user_name   | string      | Required. User username |
| password    | string      | Required. User password |

#### Users Endpoints

```
POST /api/users
```

For User account creation.  There are checks on password requirements and if the user_name is currently in
the database.  JSON Web Tokens are used to hash the password

| Body Key    | Type        | Description |
| ----------- | ----------- | ----------- |
| user_name   | string      | Required. User username |
| password    | string      | Required. User password |

#### Trips Endpoints

The User currently cannot POST trips, all of that comes from what is already in the database
All Trips will output in the following format:

```json
[
  {
    "id": "int",
    "trip_title": "string",
    "user_id": "int"
  }
]
```

There are 3 GET requests:

```
GET /api/games/all
```

As the title suggests, returns all games in the database

```
GET /api/games
```

This will return the user's games (user id required through middleware)

```
GET /api/games/:game_id
```

This will return one singular game based on id

### Plans Endpoints

The Plans endpoints utilize ALL CRUD functions, only GET and POST will return any JSON data
The rest will just return status codes based on endpoint.  JSON data will be returned as such:

```json
[
  {
    "id": "int",
    "trip_id": "int",
    "location": "string",
    "from_date": "date",
    "to_date": "date",
    "assigned_trip": "int"
  }
]
```

```
GET /api/plans
```

Returns all Rules

```
POST /api/plans
```

This will create plans for a trip.

| Body Key    | Type        | Description |
| ----------- | ----------- | ----------- |
| location  | string      | Required. Title for the rule|
| from_date    | date     | Required. From date |
| to_date    | date     | Required. To date |
| notes    | notes     | Notes about the plan |

```
PATCH /api/plans/:plan_id
```

Has same requirements as above but for updating the user's plans for tweaks

```
DELETE /api/plans/:plan_id
```

Removes the rule

*note, DELETE and PATCH require that the user's id matches the rule's assigned user*

### Status Codes

Right Routine returns the following status codes in its API:

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 201 | `CREATED` |
| 204 | `NO CONTENT` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 500 | `INTERNAL SERVER ERROR` |


### Contact me

Reach me at praisonbenjamin@gmail.com with comments or suggestions.