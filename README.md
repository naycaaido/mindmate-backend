
# Mindmate Backend

**Mindmate Backend** is the core service powering the Mindmate application, a comprehensive mental health and mood tracking platform designed to help users monitor their emotional well-being.

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: PostgreSQL (managed via Prisma ORM)
- **Authentication**: JWT (JSON Web Tokens) & Google OAuth 2.0
- **Validation**: Manual Custom Validation
- **Storage**: Multer for file uploads
- **Security**: Helmet, Rate Limiting (implied best practice), CORS

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (Node Package Manager)
- **PostgreSQL Database**

## Environment Variables

Copy the example environment file to create your own configuration:

```bash
cp .env.example .env
```

Populate the `.env` file with your specific values:

| Variable | Description |
| :--- | :--- |
| `NODE_ENV` | Environment mode (e.g., `development`, `production`) |
| `PORT` | Port number for the server (e.g., `3000`) |
| `HOST` | Host address (e.g., `localhost`) |
| `DATABASE_URL` | PostgreSQL connection string (Transaction pooler) |
| `DIRECT_URL` | PostgreSQL connection string (Session pooler) |
| `ACCESS_KEY` | Secret key for signing Access Tokens |
| `REFRESH_KEY` | Secret key for signing Refresh Tokens |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID for Google Login |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret for Google Login |
| `GOOGLE_CALLBACK_URL` | Callback URL for Google OAuth |
| `FRONTEND_URL` | URL of the frontend application |

## Installation

Install the project dependencies using npm:

```bash
npm install
```

## Database Setup

Initialize the Prisma client and push the schema to your database:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to sync database schema
npx prisma migrate dev
```

## Running the App

### Development Mode
Runs the server with `nodemon` for hot-reloading:
```bash
npm run dev
```

### Production Mode
Runs the server using standard Node.js:
```bash
npm start
```

## Authentication Flow

The application implements a secure **2-token architecture**:

1.  **Access Token**: 
    -   Used to authenticate API requests.
    -   Must be sent in the `Authorization` header as `Bearer <token>`.
    -   Short-lived (e.g., 15 minutes).

2.  **Refresh Token**:
    -   Used to obtain a new Access Token when the current one expires.
    -   Stored strictly in an **HttpOnly, Secure Cookie** to prevent XSS attacks.
    -   Long-lived (e.g., 7 days).

## API Endpoints

### Authentication

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user (returns Access Token, sets Refresh Token cookie) |
| `POST` | `/api/auth/refresh` | Refresh Access Token using HttpOnly cookie |
| `POST` | `/api/auth/logout` | Logout user and clear cookies |
| `GET` | `/auth/google` | Initiate Google OAuth login |
| `GET` | `/auth/google/callback` | Google OAuth callback handler |

### User Profile

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/user` | Get current user profile |
| `PUT` | `/api/user/edit` | Update user profile (supports avatar upload) |

### Mood Tracking

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/mood` | Get user's mood logs |
| `POST` | `/api/mood` | Create a new mood log |
| `PUT` | `/api/mood/:id` | Update an existing mood log |
| `DELETE` | `/api/mood/:id` | Delete a mood log |
| `GET` | `/api/mood/streak-test` | Check current streak status |

### Analytics & Metadata

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/analytics/stability` | Get mood stability metrics |
| `GET` | `/api/analytics/top-triggers` | Get top mood triggers |
| `GET` | `/api/feelings` | Get list of available feelings |
| `GET` | `/api/mood-type` | Get list of available mood types |

## Deployment

Deploy using PM2 on a VPS for process management:

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start src/app.js --name mindmate-backend

# Monitor usage
pm2 monit

# Save process list for reboot
pm2 save
pm2 startup
```