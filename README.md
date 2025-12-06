# Kanban Skeleton App - Installation Guide

This guide explains how to set up and run the Kanban Skeleton App locally.  
It includes both the frontend (React) and backend (Express) with Supabase authentication and database.

---

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
REACT_BACKEND_API_URL=http://localhost:5000
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
