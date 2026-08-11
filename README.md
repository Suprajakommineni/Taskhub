# TaskHub

A full-stack task and project management app.

## Tech Stack

**Backend**
- Node.js + Express
- TypeScript
- MongoDB with Mongoose
- JWT-based authentication
- bcryptjs for password hashing

**Frontend**
- React + TypeScript
- Vite

## Features

- User authentication (register/login) with JWT
- Project management (create, view, update, delete)
- Task management within projects
- Dashboard overview

## Getting Started

### Prerequisites
- Node.js installed
- A MongoDB database (local or hosted, e.g. MongoDB Atlas)

### Backend Setup
```bash
cd api
npm install
```

Create a `.env` file in the `api` folder with:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run the backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in the `client` folder with your API URL configuration.

Run the frontend:
```bash
npm run dev
```

## Project Structure
```
taskhub/
├── api/          # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
├── client/       # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── Components/
│   │   └── App.tsx
```
