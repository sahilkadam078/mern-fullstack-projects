# SigmaGPT

SigmaGPT is a full-stack MERN chat application inspired by ChatGPT, with user authentication, persistent chat threads, and OpenAI-powered responses.

## Features

- User registration and login with JWT authentication
- Protected API routes for authenticated users
- Create, view, and delete chat threads
- Persistent thread history in MongoDB
- OpenAI chat completions integration (`gpt-4o-mini`)
- Frontend built with React + Vite

## Tech Stack

- Frontend: React, Vite, CSS
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Auth: JWT + bcrypt
- AI: OpenAI Chat Completions API

## Project Structure

```text
SigmaGPT/
|- Frontend/
|  |- src/
|  |- package.json
|- Backend/
|  |- routes/
|  |- models/
|  |- middleware/
|  |- utils/
|  |- server.js
|  |- package.json
|- README.md
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB database URI
- OpenAI API key

## Environment Variables

Create a `.env` file inside `Backend/`:

```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

Optional frontend env (if backend is not on default URL):

Create `Frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Installation

Install backend dependencies:

```bash
cd Backend
npm install
```

Install frontend dependencies:

```bash
cd ../Frontend
npm install
```

## Run Locally

Start backend server:

```bash
cd Backend
npm run dev
```

Start frontend dev server (new terminal):

```bash
cd Frontend
npm run dev
```

Frontend runs on Vite default (`http://localhost:5173`) and calls backend at `http://localhost:8080` unless `VITE_API_BASE_URL` is set.

## API Endpoints

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Chat/Threads (auth required):

- `POST /api/chat`
- `GET /api/thread`
- `GET /api/thread/:threadId`
- `DELETE /api/thread/:threadId`

## Notes

- If OpenAI quota/billing is unavailable, backend returns a fallback assistant reply for quota-related errors.
- Keep `.env` secrets private and never commit them.
