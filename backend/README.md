# Team Collaboration Platform - Backend

A robust backend system for team collaboration platform built with Node.js, Express, and MySQL.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm package manager

## Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

2. Install Dependencies
```bash
npm install
```

3. Environment Configuration
Create a `.env` file in the root directory with the following variables:
```env
PORT=8000
DATABASE_URL=mysql://user:password@localhost:3306/database_name
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password
```

## Available Scripts

- Start development server:
```bash
npm run dev
```

- Start production server:
```bash
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/signup - Register new user
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout

### Users
- GET /api/auth/users - Get all users
- GET /api/auth/me - Get your profile
- PUT /api/auth/update - Update user

### Tasks
- POST /api/tasks/create - Create new task
- GET /api/tasks - Get all tasks assigned to the logged user
- GET /api/tasks/:id - Get a task with id
- PUT /api/tasks/update/:id - Update the task with id
- DELETE /api/tasks/delete/:id - Delete the task with id

## Dependencies

- express - Web framework
- mysql2 - MySQL client
- sequelize - ORM for database operations
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- cloudinary - Cloud storage for files
- nodemailer - Email services
- winston - Logging

## Logging

Winston logger is configured to log:
- HTTP requests
- Error events
- System events

Logs are rotated daily and stored in the `logs` directory.

## Project Structure

```
backend/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── lib/utils/      # Utility functions
└── server.js       # Entry point
```






