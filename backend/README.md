# OneWorld Backend Services

This directory contains the microservices for the OneWorld platform.

## Services

### Auth Service (Port 3001)
Authentication and user management service with JWT-based authentication.

**Endpoints:**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Comment Service (Port 3002)
Comment management service with support for nested comments.

**Endpoints:**
- `POST /api/comments` - Create a comment (protected)
- `GET /api/comments/post/:postId` - Get comments for a post
- `PUT /api/comments/:id` - Update a comment (protected)
- `DELETE /api/comments/:id` - Delete a comment (protected)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15
- Docker & Docker Compose (optional)

### Setup with Docker Compose

1. Start the infrastructure services:
```bash
cd infrastructure/docker
docker-compose up -d
```

2. Run database migrations:
```bash
# Auth service
cd backend/auth-service
npm run migrate

# Comment service
cd backend/comment-service
npm run migrate
```

3. Start the services:
```bash
# Auth service
cd backend/auth-service
npm start

# Comment service
cd backend/comment-service
npm start
```

### Environment Variables

Each service has a `.env.example` file. Copy it to `.env` and update the values:

```bash
cd backend/auth-service
cp .env.example .env

cd backend/comment-service
cp .env.example .env
```

## Development

### Running in Development Mode

```bash
# Install nodemon globally or in project
npm install -g nodemon

# Run service in dev mode
npm run dev
```

### API Testing

You can test the APIs using curl or tools like Postman:

```bash
# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Create a comment (use token from login response)
curl -X POST http://localhost:3002/api/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "postId": 1,
    "content": "This is a test comment"
  }'
```

## Architecture

- **Auth Service**: Node.js/Express with JWT authentication
- **Comment Service**: Node.js/Express with PostgreSQL
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: express-validator for input validation

## Database Schema

### Users Table (Auth Service)
- id (SERIAL PRIMARY KEY)
- username (VARCHAR UNIQUE)
- email (VARCHAR UNIQUE)
- password (VARCHAR)
- full_name (VARCHAR)
- bio (TEXT)
- avatar_url (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Comments Table (Comment Service)
- id (SERIAL PRIMARY KEY)
- post_id (INTEGER)
- user_id (INTEGER)
- content (TEXT)
- parent_id (INTEGER, nullable, self-referencing)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Security

- Passwords are hashed using bcrypt
- JWT tokens for stateless authentication
- Input validation on all endpoints
- CORS enabled for cross-origin requests
- Environment variables for sensitive data

## Future Enhancements

- Add Post Service
- Add Feed Service
- Add Messaging Service with WebSockets
- Add Media Service with S3 integration
- Add AI Generation Service
- Add Search Service
- Implement Kafka for event streaming
- Add Redis caching
- Add comprehensive test coverage
