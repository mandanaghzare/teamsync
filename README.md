# 🚀 TeamSync

A modern full-stack team collaboration and project management platform built with Next.js, Express, TypeScript, Prisma, PostgreSQL, React Query, and Docker.

---

## 🌐 Live Demo

Frontend:

Backend (Swagger):

---

## 📂 GitHub Repository

https://github.com/mandanaghzare/teamsync

---

# 📖 Overview

TeamSync is a collaborative project management application inspired by modern productivity tools like Trello and Jira.

It allows teams to create workspaces, manage projects, organize tasks using a Kanban board, assign tasks to team members, and monitor project progress through an intuitive dashboard.

The project demonstrates a complete full-stack architecture with authentication, authorization, REST APIs, database management, Dockerized development, and a responsive modern UI.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Protected Routes
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
- Project Progress
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

---

## 📋 Kanban Board

- Drag & Drop Tasks
- Move Between Columns
- Automatic Order Saving
- To Do
- In Progress
- Done

---

## 📊 Dashboard

- Dashboard Overview
- Project Statistics
- Task Statistics
- Upcoming Deadlines
- Assigned Tasks

---

## 🔎 Search & Tables

- Search Tasks
- Sortable Tables
- Responsive Data Tables

---

## 🎨 User Experience

- Dark / Light Mode
- Responsive Design
- Loading States
- Empty States
- Error Handling
- Confirmation Dialogs
- Toast Notifications
- Breadcrumb Navigation

---

## 📚 API Documentation

- Swagger UI
- RESTful API
- Request Validation
- Authentication Middleware

---

# 🛠 Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
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
- Socket.io

---

## Development Tools

- Docker
- Docker Compose
- Git
- GitHub
- Postman
- Prisma Studio

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

```
TeamSync
│
├── client
│   ├── app
│   ├── components
│   ├── lib
│   ├── providers
│   ├── types
│   └── public
│
├── server
│   ├── prisma
│   ├── src
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   ├── schemas
│   │   └── config
│   └── docs
│
└── docker-compose.yml
```

---

# ⚙ Environment Variables

## Client

```env
NEXT_PUBLIC_API_URL=
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

```bash
git clone https://github.com/mandanaghzare/teamsync.git

cd teamsync
```

Install client

```bash
cd client
npm install
```

Install server

```bash
cd ../server
npm install
```

---

# ▶ Running the Project

Start PostgreSQL

```bash
docker compose up -d
```

Run Prisma

```bash
npx prisma migrate dev
```

Run Server

```bash
npm run dev
```

Run Client

```bash
npm run dev
```

---

# 📖 Swagger

```
http://localhost:5000/api/docs
```

---

# 🔮 Future Improvements

- Comments on Tasks
- File Attachments
- Notifications
- Activity Timeline
- Team Invitations via Email
- Calendar View
- Labels
- Task Filters
- Workspace Settings
- Role Management
- Analytics Dashboard
- Real-time Collaboration

---

# 📄 License

This project is intended for educational and portfolio purposes.