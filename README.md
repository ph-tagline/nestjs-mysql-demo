# NestJS MySQL CRUD API

A RESTful API built with NestJS and MySQL using direct queries instead of an ORM.

## Features

- Complete CRUD operations for user management
- MySQL integration with direct queries
- Input validation and error handling
- Swagger API documentation
- Environment configuration

## Requirements

- Node.js (v14+)
- MySQL (v5.7+)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure your MySQL database and update the `.env` file
4. Start the application:
   ```
   npm run start:dev
   ```

## API Documentation

Once the application is running, visit:
```
http://localhost:3000/api
```

## API Endpoints

| Method | Endpoint     | Description        |
|--------|-------------|--------------------|
| GET    | /users      | Get all users      |
| GET    | /users/:id  | Get a user by ID   |
| POST   | /users      | Create a new user  |
| PUT    | /users/:id  | Update a user      |
| DELETE | /users/:id  | Delete a user      |

## Example Usage

### Create a new user

```
POST /users
```

Request body:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

### Get all users

```
GET /users
```

### Get a user by ID

```
GET /users/1
```

### Update a user

```
PUT /users/1
```

Request body:
```json
{
  "name": "John Updated"
}
```

### Delete a user

```
DELETE /users/1
```