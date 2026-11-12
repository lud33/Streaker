# Streaker

Build momentum, one habit at a time.

Streaker is a full-stack habit tracking app that helps users stay consistent by tracking daily routines, streaks, progress, and personal goals. It combines a Laravel API backend with a modern React frontend to create a clean, motivating experience for daily self-improvement.

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel" alt="Laravel 12" />
  <img src="https://img.shields.io/badge/PHP-8.2-777BB4?style=for-the-badge&logo=php" alt="PHP 8.2" />
</p>

## Why Streaker?

Most habit apps stop at simple checklists. Streaker goes a step further by helping users:

- build and maintain recurring habits
- see their current streaks and completion trends
- track their progress with visual summaries
- stay motivated through daily goals and achievements
- keep personal routines organized in one place

## Features

- Habit creation and management
- Daily completion tracking
- Streak and completion rate analytics
- Goal tracking and milestone management
- User authentication with protected routes
- Responsive dashboard experience
- Light/dark theme support
- Achievement-oriented progress summaries

## App Architecture

```text
Streaker/
├── backend/   # Laravel API, database, authentication, business logic
├── streaker/  # React + Vite frontend dashboard and UI
├── README.md  # Project overview and setup
└── .git/
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
- Sanctum for API authentication
- Eloquent ORM

## Demo & Screens

The frontend includes pages for:

- Landing page
- Authentication
- Dashboard
- Habits
- Analytics
- Goals
- Achievements
- Settings
- Reset password flow

## Getting Started

### Prerequisites

Make sure you have the following installed:

- PHP 8.2+
- Composer
- Node.js 18+
- npm

### 1) Set up the backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

The API will run at:

```text
http://127.0.0.1:8000
```

### 2) Set up the frontend

Open a new terminal and run:

```bash
cd streaker
npm install
npm run dev
```

The app will be available at:

```text
http://localhost:8080
```

## Environment Configuration

Backend configuration includes frontend URL settings for local development:

```env
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:8080
```

If your frontend runs on another host or port, update `FRONTEND_URL` accordingly.

## API Overview

The Laravel backend provides REST endpoints for users, habits, completions, and goals.

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

## Project Goals

Streaker is designed to be a lightweight personal productivity app focused on consistency, accountability, and visible progress. It is ideal for people who want to build routines without the clutter of overly complex task-management tools.

## Contributing

Contributions are welcome. If you'd like to improve the app:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the relevant frontend/backend behavior
5. Open a pull request

## License

This project is intended for personal and development use unless the repository owner specifies otherwise.

---

If you want, I can also tailor this README for a more premium GitHub presentation with a product-style hero section, screenshots mockups, and a "How it works" section.
