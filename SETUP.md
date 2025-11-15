# OneWorld Backend Setup Guide

This guide will help you set up and run the OneWorld backend services.

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 15 (or use Docker)

## Quick Start with Docker

### 1. Start all infrastructure services

```bash
cd infrastructure/docker
docker compose up -d
```

This will start:
- PostgreSQL (port 5432)
- MongoDB (port 27017)
- Redis (port 6379)
- Kafka + Zookeeper (port 9092, 2181)
- MinIO (ports 9000, 9001)
- Prometheus (port 9090)
- Grafana (port 3000)
- Auth Service (port 3001)
- Comment Service (port 3002)

### 2. Run database migrations

```bash
# Wait for PostgreSQL to be ready (about 10 seconds)
sleep 10

# Run auth service migration
docker exec oneworld-auth-service npm run migrate

# Run comment service migration
docker exec oneworld-comment-service npm run migrate
```

### 3. Test the services

```bash
# Health check
curl http://localhost:3001/health
curl http://localhost:3002/health

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
```

## Local Development Setup

If you want to run services locally without Docker:

### 1. Start PostgreSQL

```bash
cd infrastructure/docker
docker compose up -d postgres
```

### 2. Install dependencies and run migrations

```bash
# Auth Service
cd backend/auth-service
npm install
cp .env.example .env
npm run migrate

# Comment Service
cd backend/comment-service
npm install
cp .env.example .env
npm run migrate
```

### 3. Start the services

```bash
# Terminal 1 - Auth Service
cd backend/auth-service
npm start

# Terminal 2 - Comment Service
cd backend/comment-service
npm start
```

## API Documentation

### Auth Service (http://localhost:3001)

#### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "createdAt": "2025-10-15T22:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /api/auth/login
Login a user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "createdAt": "2025-10-15T22:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "bio": null,
    "avatarUrl": null,
    "createdAt": "2025-10-15T22:00:00.000Z"
  }
}
```

#### PUT /api/auth/profile
Update user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "fullName": "John Updated",
  "bio": "Software engineer passionate about building great products",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

### Comment Service (http://localhost:3002)

#### POST /api/comments
Create a comment (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "postId": 1,
  "content": "This is a great post!",
  "parentId": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "postId": 1,
    "userId": 1,
    "content": "This is a great post!",
    "parentId": null,
    "createdAt": "2025-10-15T22:00:00.000Z",
    "updatedAt": "2025-10-15T22:00:00.000Z"
  }
}
```

#### GET /api/comments/post/:postId
Get comments for a post (with pagination).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "postId": 1,
      "userId": 1,
      "username": "johndoe",
      "avatarUrl": null,
      "content": "This is a great post!",
      "parentId": null,
      "createdAt": "2025-10-15T22:00:00.000Z",
      "updatedAt": "2025-10-15T22:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

#### PUT /api/comments/:id
Update a comment (requires authentication and ownership).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "content": "Updated comment content"
}
```

#### DELETE /api/comments/:id
Delete a comment (requires authentication and ownership).

**Headers:**
```
Authorization: Bearer <token>
```

## Environment Variables

### Auth Service

```env
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oneworld_db
DB_USER=admin
DB_PASSWORD=admin123

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=24h
```

### Comment Service

```env
PORT=3002
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oneworld_db
DB_USER=admin
DB_PASSWORD=admin123

# JWT Configuration (must match auth service)
JWT_SECRET=your-secret-key-change-in-production
```

## Troubleshooting

### Services not starting
- Check if ports 3001 and 3002 are available
- Ensure PostgreSQL is running and accessible
- Verify environment variables are set correctly

### Database connection errors
- Ensure PostgreSQL container is running: `docker compose ps`
- Check database credentials in .env files
- Run migrations if tables don't exist

### Authentication errors
- Ensure JWT_SECRET is the same in both services
- Check if token is being sent in Authorization header
- Verify token hasn't expired (24h by default)

## Stopping Services

```bash
# Stop all Docker services
cd infrastructure/docker
docker compose down

# Stop local Node.js services
# Press Ctrl+C in each terminal
```

## Next Steps

1. Implement Post Service for creating and managing posts
2. Implement Feed Service for aggregating user feeds
3. Implement Messaging Service with WebSocket support
4. Add Redis caching for improved performance
5. Integrate Kafka for event streaming
6. Add comprehensive test coverage
