# Quiz Builder - Project Setup Guide

This project consists of two parts: Frontend (Next.js) and Backend (Node.js + Express + PostgreSQL).

## Prerequisites

1. **Node.js** version 18+ installed on your computer
2. **PostgreSQL** database configured and running
3. **npm** or **yarn** installed

## Environment Setup

### 1. Backend Environment Variables Setup

Create a `.env` file in the `backend/` folder with the following variables:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/quiz_builder_db
PORT=3001
```

Replace `username`, `password` and `quiz_builder_db` with your actual PostgreSQL credentials.

### 2. Database Creation

Create a PostgreSQL database named `quiz_builder_db` (or as specified in DATABASE_URL).

## Installation and Launch

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Start Backend Server

```bash
# In backend/ folder
npm run dev
# or for production
npm start
```

Backend will be available at: `http://localhost:3001`

### Step 3: Install Frontend Dependencies

```bash
cd frontend
npm install

npm i sass
```

### Step 4: Start Frontend Application

```bash
# In frontend/ folder
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## Project Structure

- **Backend** (port 3001):
  - Express.js server
  - PostgreSQL database
  - API for creating and managing quizzes
  
- **Frontend** (port 3000):
  - Next.js application
  - React components
  - SCSS styles

## API Endpoints

- `GET /quizzes` - get all quizzes
- `GET /quizzes/:id` - get quiz by ID
- `POST /quizzes` - create new quiz
- `DELETE /quizzes/:id` - delete quiz

## Notes

- Backend automatically creates necessary database tables on first run
- Frontend connects to Backend through API on localhost:3001
- Make sure both servers are running for full application functionality