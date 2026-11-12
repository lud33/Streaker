# Streaker

Build momentum, one habit at a time.

Streaker is a full-stack habit tracking app that helps users stay consistent by tracking daily routines, streaks, progress, and personal goals. It combines a Laravel API backend with a modern React frontend to deliver a clean, motivating experience for self-improvement.

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel" alt="Laravel 12" />
  <img src="https://img.shields.io/badge/PHP-8.2-777BB4?style=for-the-badge&logo=php" alt="PHP 8.2" />
</p>

## Why Streaker?

Most habit apps focus only on checklists. Streaker helps people stay on track by making progress visible and motivating:

- create and manage recurring habits
- track daily completions and streaks
- monitor progress with summary insights
- set personal goals and milestones
- stay accountable with a simple dashboard experience

## Key Features

- Habit tracking with daily completion history
- Current streak and completion-rate analytics
- Dashboard with summary cards and productivity insights
- Goal tracking for personal milestones
- Achievement and motivation-focused progress views
- User authentication and protected routes
- Responsive layout for desktop and mobile
- Light/dark theme support

## Project Structure

```text
Streaker/
├── backend/   # Laravel API, authentication, and data layer
├── streaker/  # React + Vite frontend application
├── README.md  # Project overview and setup guide
├── .git/
└── .gitignore
```

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- shadcn/ui-inspired component system

### Backend
- PHP 8.2
- Laravel 12
- SQLite for local development
- Sanctum authentication
- Eloquent ORM

## Getting Started

### Prerequisites

Before running the app, make sure you have:

- PHP 8.2+
- Composer
- Node.js 18+
- npm

### 1) Start the backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

The backend will run at:

```text
http://127.0.0.1:8000
```

### 2) Start the frontend

Open a second terminal and run:

```bash
cd streaker
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:8080
```

## Environment Configuration

The backend includes frontend URL settings for local development:

```env
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:8080
```

If your frontend runs on another host or port, update this value accordingly.

## API Overview

The Laravel backend exposes a REST API for authentication, habits, completions, and goals.

### Public routes
- `POST /register`
- `POST /login`

### Protected routes
- `GET /user`
- `POST /logout`
- `GET /habits`
- `POST /habits`
- `GET /habits/{id}`
- `PATCH /habits/{id}`
- `DELETE /habits/{id}`
- `POST /habits/{id}/completions`
- `GET /goals`
- `POST /goals`
- `GET /goals/{id}`
- `PATCH /goals/{id}`
- `DELETE /goals/{id}`

## App Flow

1. Create an account or log in.
2. Add habits you want to build.
3. Mark them complete as you go.
4. Track your streaks and completion percentages.
5. Review your progress on the dashboard and analytics views.
6. Set goals and celebrate milestones over time.

## Development Notes

- The backend uses SQLite by default for local development.
- The frontend is configured to run on port `8080` in `streaker/vite.config.ts`.
- Authentication uses Laravel Sanctum bearer tokens.
- User-scoped data is isolated to the authenticated account.

## Contributing

Contributions are welcome. To contribute:

1. fork the repository
2. create a feature branch
3. make your changes
4. validate the relevant behavior in the frontend and backend
5. open a pull request

## License

This project is intended for personal and development use unless  specified by the repository owner.

---


