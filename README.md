# RelaxAtHome — Full-stack massage booking website

A starter full-stack web application for booking professional at-home massage appointments.

## Stack
- Frontend: React + Vite + React Router + Bootstrap
- Backend: Node.js + Express
- Data: JSON file storage (easy to run locally; no database installation required)
- Authentication: demo email/password login with hashed passwords and JWT tokens

## Features
- Browse massage services and pricing
- Create an account and sign in
- Book a home appointment with date, time, address, and notes
- View your bookings and cancel pending bookings
- Backend validation and basic booking conflict prevention
- Responsive layout

## Requirements
- Node.js 18+ (20+ recommended)
- npm

## Run locally
Open two terminals.

### 1. Start backend
```bash
cd server
npm install
npm run dev
```
Backend runs at `http://localhost:5000`.

### 2. Start frontend
```bash
cd client
npm install
npm run dev
```
Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## Demo flow
1. Register an account.
2. Sign in.
3. Choose a service and book a slot.
4. Open **My Bookings** to view or cancel a pending booking.

## API routes
- `GET /api/health`
- `GET /api/services`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/bookings` (authenticated)
- `POST /api/bookings` (authenticated)
- `PATCH /api/bookings/:id/cancel` (authenticated)

## Important production notes
This is a runnable starter project, not a production-ready healthcare or marketplace platform. Before real public launch, use a database such as PostgreSQL/MongoDB, email/phone verification, password reset, rate limiting, secure deployment secrets, audit logging, payment integration, stronger scheduling/availability rules, privacy policy/terms, and local licensing/background-check workflows. The included JSON file storage is intended for local demos and single-process development only. The booking system does not verify practitioner credentials or collect medical history.
