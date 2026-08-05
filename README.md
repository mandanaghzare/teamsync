# TeamSync

TeamSync is a full-stack project management platform for creating teams, organizing projects, assigning tasks, and tracking progress through dashboards and Kanban boards.

[Live Application](https://teamsync-ten-lovat.vercel.app) | [API Documentation](https://teamsync-production-b3cc.up.railway.app/api-docs) | [Portfolio](https://portfolio-nu-blue-74.vercel.app) | [GitHub Repository](https://github.com/mandanaghzare/teamsync)

## Overview

TeamSync demonstrates a complete TypeScript-based application architecture with a Next.js frontend, an Express REST API, PostgreSQL persistence, authentication, authorization, validation, responsive UI, and documented endpoints.

Users can create or join teams, manage projects, assign work to team members, organize tasks with drag and drop, and monitor deadlines and progress from a centralized dashboard.

## Screenshots

### Dashboard

![TeamSync dashboard](./client/public/screenshots/dashboard.png)

### Projects

![TeamSync projects](./client/public/screenshots/projects.png)

### Kanban Board

![TeamSync Kanban board](./client/public/screenshots/kanban.png)

### Tasks

![TeamSync tasks](./client/public/screenshots/tasks.png)

## Key Features

### Authentication and authorization

- User registration and secure login
- JWT-based authentication
- Protected frontend routes and API endpoints
- Team membership and owner/member roles
- Profile management and logout

### Team and project management

- Create teams
- Join teams with an invite code
- View team memberships and roles
- View team members
- Create, edit, delete, and search projects
- Restrict project access to team members
- Track project status and completion progress

### Task management

- Create, edit, delete, search, and assign tasks
- Set priority, due date, status, project, and assignee
- View task details
- View all tasks across accessible projects
- View tasks assigned to the authenticated user
- Display tasks in responsive data tables

### Kanban workflow

- Organize tasks into To Do, In Progress, and Done columns
- Move tasks between columns with drag and drop
- Reorder tasks within columns
- Persist task status and position changes

### Dashboard and user experience

- Project and task statistics
- Recent projects
- Assigned tasks
- Upcoming deadlines
- Responsive layouts for desktop, tablet, and mobile
- Dark and light themes
- Loading, empty, error, and confirmation states
- Toast notifications
- Breadcrumb navigation

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- TanStack React Query
- TanStack Table
- React Hook Form
- Zod
- DnD Kit
- Axios
- Base UI
- Lucide React
- Sonner
- Next Themes

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt
- Zod
- Swagger / OpenAPI

### Development and deployment

- Docker
- Docker Compose
- Git
- GitHub
- Postman
- Prisma Studio
- Vercel
- Railway

## REST API

Interactive API documentation is available through the [deployed Swagger UI](https://teamsync-production-b3cc.up.railway.app/api-docs).

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PATCH  /api/auth/profile
```

### Teams

```text
POST   /api/teams
POST   /api/teams/join
GET    /api/teams
GET    /api/teams/:teamId/members
```

### Projects

```text
POST   /api/projects
GET    /api/projects/team/:teamId
GET    /api/projects/:projectId
PATCH  /api/projects/:projectId
DELETE /api/projects/:projectId
```

### Tasks

```text
POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/project/:projectId
GET    /api/tasks/assigned/me
GET    /api/tasks/:taskId
PATCH  /api/tasks/reorder
PATCH  /api/tasks/:taskId
PATCH  /api/tasks/:taskId/assign/:userId
DELETE /api/tasks/:taskId
```

## Project Structure

```text
teamsync/
├── client/
│   ├── app/
│   ├── components/
│   ├── data/
│   ├── lib/
│   ├── providers/
│   ├── public/
│   └── types/
│
├── server/
│   ├── prisma/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── docs/
│       ├── generated/
│       ├── middleware/
│       ├── routes/
│       ├── socket/
│       └── types/
│
└── docker-compose.yml
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/mandanaghzare/teamsync.git
cd teamsync
```

### 2. Configure environment variables

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Create `server/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/teamsync
JWT_SECRET=replace_with_a_secure_secret
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

### 4. Install and start the backend

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 5. Install and start the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:3000
```

The local Swagger documentation is available at:

```text
http://localhost:5000/api-docs
```

## Production Deployment

### Frontend

The Next.js frontend is deployed on Vercel:

```text
https://teamsync-ten-lovat.vercel.app
```

Required environment variable:

```env
NEXT_PUBLIC_API_URL=https://teamsync-production-b3cc.up.railway.app/api
```

### Backend

The Express API and PostgreSQL database are deployed on Railway:

```text
https://teamsync-production-b3cc.up.railway.app
```

Required backend environment variables:

```env
DATABASE_URL=
JWT_SECRET=
CLIENT_URL=https://teamsync-ten-lovat.vercel.app
```

Production start command:

```bash
npm run start:prod
```

## Planned Improvements

- Real-time collaboration
- Notifications
- Task comments
- File attachments
- Calendar view
- Activity timeline
- Advanced filters
- Analytics
- Email invitations
- More granular role permissions

## Author

**Mandana Zare**  
Frontend / Full-Stack JavaScript Developer

[Portfolio](https://portfolio-nu-blue-74.vercel.app) | [LinkedIn](https://www.linkedin.com/in/mandana-zare) | [GitHub](https://github.com/mandanaghzare)