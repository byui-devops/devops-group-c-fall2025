# Kanban Skeleton App - Installation Guide

This guide explains how to set up and run the Kanban Skeleton App locally.  
It includes both the frontend (React) and backend (Express) with Supabase authentication and database.

You can use docker, or you can run it locally.

---

# Running through docker

## If you're running the application on a server

    git checkout main
    git pull
    docker pull shawnjensen/devops-group-c-fall2025-frontend:latest 
    docker pull shawnjensen/devops-group-c-fall2025-backend:latest
    docker-compose up



## If you're developing the application, run the following to build and push the updates.
(Build backend)
    docker build -t shawnjensen/devops-group-c-fall2025-backend:latest ./backend

(Build frontend)
    docker build -t shawnjensen/devops-group-c-fall2025-frontend:latest ./frontend

(Push backend)
    docker push shawnjensen/devops-group-c-fall2025-backend:latest

(Push frontend)
    docker push shawnjensen/devops-group-c-fall2025-frontend:latest


# Running Locally
## 1. Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js v18+](https://nodejs.org/)
- NPM (comes with Node.js)
- A Supabase account and project (cloud)
- Optional: Postman (for API testing)

---

## 2. Clone the repository

Open a terminal and run:

```bash
git clone <YOUR_REPO_URL>
cd <REPO_FOLDER>
```

## 3. Retrieve URL and ANON KEY from SUPABASE

SUPABASE_URL=<YOUR_SUPABASE_URL>
SUPABASE_KEY=<YOUR_SUPABASE_ANON_KEY>
PORT=5000

## 4. Create .env files

backend/.env

```bash
SUPABASE_URL=<YOUR_SUPABASE_URL>
SUPABASE_KEY=<YOUR_SUPABASE_ANON_KEY>
PORT=5000
```

frontend/.env

```bash
REACT_APP_BACKEND_URL=http://localhost:5000
```

!! Do not commit .env files to GitHub! !!

## 5. Install Dependencies

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

## 6. Run the project locally

```bash
cd backend
npm run dev
```

```bash
cd ../frontend
npm start
```
