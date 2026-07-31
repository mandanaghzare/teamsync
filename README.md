# 🚀 TeamSync

A modern full-stack team collaboration platform built with Next.js, Express, TypeScript, Prisma, PostgreSQL, React Query, and Docker.

---

## 🌐 Live Demo

Frontend:

Backend (Swagger):

---

## 📂 GitHub Repository

https://github.com/mandanaghzare/teamsync

---

# 📖 Overview

TeamSync is a collaborative project management platform inspired by modern productivity tools like Trello and Jira.

It enables teams to create workspaces, manage projects, organize tasks using a Kanban board, assign tasks to team members, and track overall project progress through an intuitive dashboard.

The project demonstrates a complete full-stack architecture featuring authentication, authorization, REST APIs, database management, Dockerized development, responsive UI, and modern frontend best practices.

---

# 📸 Screenshots

### Dashboard

![Dashboard](./client/public/screenshots/dashboard.png)

### Projects

![Projects](./client/public/screenshots/projects.png)

### Kanban Board

![Kanban](./client/public/screenshots/kanban.png)

### Tasks

![Tasks](./client/public/screenshots/tasks.png)

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Protected Routes
- Logout
- Update User Profile

---

## 👥 Team Management

- Create Teams
- Join Teams using Invite Code
- Team Member Roles
- View My Teams

---

## 📁 Project Management

- Create Projects
- Edit Projects
- Delete Projects
- Project Progress Tracking
- Project Status
- Team-based Project Access

---

## ✅ Task Management

- Create Tasks
- Edit Tasks
- Delete Tasks
- Assign Tasks
- Due Dates
- Priority Levels
- Task Status
- Task Details Page
- Global Tasks View
- My Assigned Tasks

---

## 📋 Kanban Board

- Drag & Drop Tasks
- Move Tasks Between Columns
- Automatic Order Saving
- To Do
- In Progress
- Review
- Done

---

## 📊 Dashboard

- Dashboard Overview
- Project Statistics
- Task Statistics
- Upcoming Deadlines
- My Assigned Tasks

---

## 🔎 Search & Tables

- Search Projects
- Search Tasks
- Global Tasks View
- Sortable Tables
- Responsive Data Tables

---

## 🎨 User Experience

- Responsive Design
- Dark / Light Mode
- Loading States
- Empty States
- Error Handling
- Confirmation Dialogs
- Toast Notifications
- Breadcrumb Navigation

---

## 📚 API Documentation

- Swagger UI
- REST API
- Request Validation
- Authentication Middleware

---

# 🛠 Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios
- TanStack React Query
- TanStack Table
- React Hook Form
- Zod
- DnD Kit
- Lucide React
- Sonner
- Next Themes

---

## Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt
- Zod
- Swagger

---

## Development Tools

- Docker
- Docker Compose
- Git
- GitHub
- Postman
- Prisma Studio
- Swagger UI

---

# 📡 REST API

## Authentication

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- PATCH /api/auth/profile

---

## Teams

- POST /api/teams
- POST /api/teams/join
- GET /api/teams

---

## Projects

- POST /api/projects
- GET /api/projects/team/:teamId
- GET /api/projects/:projectId
- PATCH /api/projects/:projectId
- DELETE /api/projects/:projectId

---

## Tasks

- GET /api/tasks
- GET /api/tasks/project/:projectId
- GET /api/tasks/:taskId
- GET /api/tasks/assigned/me

- POST /api/tasks

- PATCH /api/tasks/:taskId
- PATCH /api/tasks/reorder
- PATCH /api/tasks/:taskId/assign/:userId

- DELETE /api/tasks/:taskId

---

# 📁 Folder Structure

```text
TeamSync
│
├── client
│   ├── app
│   ├── components
│   ├── lib
│   ├── providers
│   ├── public
│   └── types
│
├── server
│   ├── prisma
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   ├── socket
│   │   ├── types
│   │   └── utils
│   └── docs
│
└── docker-compose.yml
```

---

# ⚙️ Environment Variables

## Client

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Server

```env
DATABASE_URL=
JWT_SECRET=
PORT=
CLIENT_URL=
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/mandanaghzare/teamsync.git
```

Move into the project

```bash
cd teamsync
```

Install client dependencies

```bash
cd client
npm install
```

Install server dependencies

```bash
cd ../server
npm install
```

---

# ▶️ Running the Project

Start PostgreSQL

```bash
docker compose up -d
```

Generate Prisma Client

```bash
npx prisma generate
```

Run database migrations

```bash
npx prisma migrate dev
```

Start the backend

```bash
npm run dev
```

Start the frontend

```bash
cd ../client
npm run dev
```

---

# 📖 API Documentation

Swagger UI

```
http://localhost:5000/api/docs
```

---

# 🔮 Future Improvements

- Real-time Collaboration
- Comments
- File Attachments
- Notifications
- Activity Timeline
- Calendar View
- Labels
- Advanced Filters
- Email Invitations
- Role Management
- Analytics Dashboard

---

# 📄 License

This project was built for educational purposes and portfolio demonstration.