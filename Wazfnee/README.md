# Wazfnee

> A full-featured job-platform backend built with Node.js, Express, TypeScript, MongoDB, Socket.IO, Firebase Cloud Messaging, GraphQL, and event-driven email notifications.

Wazfnee is a backend system for a job-search and recruitment platform. It supports authentication, user and company management, job publishing, job applications, real-time and push notifications, recruitment workflows, an admin dashboard through GraphQL, and Excel-based application reporting.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Authentication & Security](#authentication--security)
- [Recruitment Workflow](#recruitment-workflow)
- [Notifications](#notifications)
- [Admin Dashboard](#admin-dashboard)
- [Application Reports](#application-reports)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Overview](#api-overview)
- [Firebase Setup](#firebase-setup)
- [Email Setup](#email-setup)
- [Development Notes](#development-notes)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Features

### Authentication

- User signup and email confirmation
- OTP-based account verification
- Secure password hashing
- JWT access and refresh tokens
- Role-based authorization
- Google authentication
- Forgot-password and reset-password flow
- Account restoration flow
- Logout and token revocation
- Validation of deleted and banned accounts

### User Management

- User profile management
- Profile and cover picture upload/delete
- Secure mobile-number encryption
- User roles and account state management

### Company Management

- Create and update companies
- Company owner and HR relationships
- Company logo and cover-picture management
- Legal attachment support
- Add HR users to a company
- Company search
- Soft deletion
- Admin approval and banning

### Job Management

- Create jobs for companies
- Owner/HR authorization
- Update and delete jobs
- Open/closed job management
- Job filtering and searching
- Pagination and sorting
- Filtering by working time, job location, seniority, title, and technical skills

### Applications

- Apply to jobs with a CV
- PDF CV upload
- Duplicate-application protection
- Application status workflow
- HR acceptance/rejection decisions
- Acceptance and rejection emails
- Retrieve applications for a specific job
- Daily company application export to Excel

### Notifications

- Notifications persisted in MongoDB
- Real-time notifications through Socket.IO
- Firebase Cloud Messaging push notifications
- Multi-device push registration
- Read/unread notification state
- Firebase device registration endpoint

### Admin Dashboard

- GraphQL-based dashboard
- Retrieve users and companies
- Ban/unban users
- Ban/unban companies
- Approve companies
- Admin-only GraphQL authorization

### Reporting

- Generate Excel reports for company applications
- Filter applications by a specific day
- Include applicant, job, status, application time, and CV information
- Save generated reports under `downloads/excels/`

---

## Tech Stack

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB
- Mongoose

### Authentication & Security

- JSON Web Tokens (JWT)
- bcrypt
- Encryption utilities
- Role-based authorization
- class-validator
- class-transformer

### Real-Time Communication

- Socket.IO

### Push Notifications

- Firebase Admin SDK
- Firebase Cloud Messaging (FCM)

### Email

- Nodemailer
- EventEmitter-based email events
- HTML email templates

### GraphQL

- Apollo Server
- GraphQL
- `@as-integrations/express5`

### File Handling & Reporting

- Multer
- Local file storage
- ExcelJS

---

## Architecture

Wazfnee follows a modular backend architecture. Each business domain is separated into its own module, while reusable infrastructure is kept in `Utils` and database access is abstracted through repository classes.

```text
Client
  |
  v
Express Router
  |
  +--> Authentication
  |
  +--> Authorization
  |
  +--> Validation
  |
  v
Controller
  |
  v
Service
  |
  +--> Repository --> MongoDB
  |
  +--> Email Events --> Nodemailer
  |
  +--> Socket.IO
  |
  +--> Firebase FCM
  |
  v
Response
```

---

## Project Structure

```text
src/
├── Config/
│
├── DB/
│   ├── connection.ts
│   ├── database.repository.ts
│   ├── Models/
│   ├── repositories/
│   └── redis/
│
├── Middlewares/
│
├── Modules/
│   ├── Auth/
│   ├── User/
│   ├── Company/
│   ├── Job/
│   ├── Notification/
│   └── Dashboard/
│
├── Socket/
│   ├── socket.server.ts
│   ├── socket.authentication.ts
│   └── socket.events.ts
│
├── GraphQL/
│   ├── graphql.server.ts
│   ├── graphql.middleware.ts
│   └── graphql.context.ts
│
└── Utils/
    ├── enums/
    ├── email/
    ├── events/
    ├── multer/
    ├── notification/
    ├── redis/
    ├── security/
    ├── services/
    └── validation/
```

---

## Authentication & Security

Protected HTTP routes use:

```http
Authorization: Bearer <access-token>
```

The authentication layer validates token type, signature, user identity, revocation state, credential-change state, and account status.

Sensitive user data is protected where required. Passwords are hashed with bcrypt, while mobile numbers are encrypted before persistence.

Incoming request bodies, parameters, query strings, and headers are validated through DTOs before reaching controller logic.

---

## Recruitment Workflow

When a candidate applies for a job:

```text
Candidate
   |
   v
POST /job/:jobId/apply
   |
   +--> Validate job
   |
   +--> Validate company
   |
   +--> Check duplicate application
   |
   +--> Create application
   |
   +--> Notify company HRs
```

Supported application statuses are:

```text
pending
viewed
in consideration
accepted
rejected
```

The HR decision endpoint exposes the two final decisions:

```text
accepted
rejected
```

When a decision is made, the application is updated and the appropriate email event is emitted.

```text
HR decision
    |
    v
Application status updated
    |
    +----> applicationAccepted --> Acceptance email
    |
    +----> applicationRejected --> Rejection email
```

Finalized applications are not allowed to switch between accepted and rejected states.

---

## Notifications

Wazfnee uses three notification channels.

### MongoDB

Notifications are stored with fields such as:

```text
recipientId
senderId
type
title
body
data
isRead
createdAt
updatedAt
```

### Socket.IO

Connected users receive real-time notifications through user-specific Socket.IO rooms.

Example event:

```text
newApplication
```

### Firebase Cloud Messaging

Registered devices are stored separately:

```text
FirebaseDevice
├── userId
├── token
├── platform
├── lastUsedAt
├── createdAt
└── updatedAt
```

The application notification flow becomes:

```text
Candidate applies
      |
      v
Application created
      |
      v
Notification created
      |
      +----> Socket.IO
      |
      +----> Firebase FCM
      |
      +----> MongoDB Notification
```

---

## Admin Dashboard

The admin dashboard is exposed through GraphQL at:

```text
/graphql
```

### Query

```graphql
dashboard
```

### Mutations

```graphql
toggleUserBan
toggleCompanyBan
approveCompany
```

GraphQL access is protected by the existing JWT authentication system and restricted to administrator users.

---

## Application Reports

Companies can generate an Excel report containing applications submitted on a specific day.

Example:

```http
GET /api/v1/company/:companyId/applications/export?date=2026-09-08
```

The workbook includes:

- Application ID
- Applicant name
- Applicant email
- Job title
- Application status
- Application date/time
- CV path

The generated file is returned as an `.xlsx` attachment and is also saved server-side under:

```text
downloads/excels/
```

---

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js 18+
- npm
- MongoDB
- Redis
- A Firebase project
- An SMTP/email provider

### Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd Wazfnee
```

### Install dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

The exact names should match the variables exported by your configuration service. Typical configuration includes:

```env
PORT=3000

MONGO_URI=mongodb://localhost:27017/wazfnee
REDIS_URL=redis://localhost:6379

ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
ACCESS_TOKEN_EXPIRES=1h
REFRESH_TOKEN_EXPIRES=7d

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASSWORD=your-password
EMAIL_FROM=your-email

FIREBASE_SERVICE_ACCOUNT=./path/to/firebase-service-account.json
```

> Never commit secrets, passwords, Firebase service-account credentials, private keys, or production tokens to Git.

---

## Running the Project

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

Use the scripts defined in `package.json` if your local script names differ.

---

## API Overview

Main API groups:

```text
/api/v1/auth
/api/v1/user
/api/v1/company
/api/v1/job
/api/v1/notification
/graphql
```

### Authentication

```text
POST /api/v1/auth/signup
POST /api/v1/auth/confirm-email
POST /api/v1/auth/signin
POST /api/v1/auth/refresh-token
POST /api/v1/auth/logout
```

### Company

```text
POST  /api/v1/company
PATCH /api/v1/company/:companyId
PATCH /api/v1/company/:companyId/logo
PATCH /api/v1/company/:companyId/cover
PATCH /api/v1/company/:companyId/hr
```

### Jobs & Applications

```text
POST   /api/v1/job
PATCH  /api/v1/job/:jobId
DELETE /api/v1/job/:jobId
GET    /api/v1/job/:companyId
GET    /api/v1/job/:companyId/:jobId
POST   /api/v1/job/:jobId/apply
GET    /api/v1/job/:jobId/applications
PATCH  /api/v1/job/application/:applicationId/status
```

### Notifications

```text
GET   /api/v1/notification
PATCH /api/v1/notification/:notificationId/read
POST  /api/v1/notification/device
```

### Company Reporting

```text
GET /api/v1/company/:companyId/applications/export?date=YYYY-MM-DD
```

> Endpoint names may vary slightly depending on the final route registration in the repository.

---

## Firebase Setup

Firebase is used for push notifications.

### Backend

1. Create or open a Firebase project.
2. Open **Project Settings**.
3. Go to **Service Accounts**.
4. Generate a new private key.
5. Store the service-account JSON securely.
6. Set `FIREBASE_SERVICE_ACCOUNT` to the JSON file path.
7. Initialize Firebase during application startup.

### Web Client

The web client needs Firebase Messaging, a service worker, the Firebase web configuration, and a VAPID public key.

The generated FCM registration token can be registered with:

```http
POST /api/v1/notification/device
```

Example body:

```json
{
  "token": "FCM_DEVICE_TOKEN",
  "platform": "web"
}
```

---

## Email Setup

Email delivery uses an event-driven architecture.

Supported email events include:

```text
confirmEmail
forgetPassword
restoreAccount
applicationAccepted
applicationRejected
```

Application decision emails use dedicated HTML templates under:

```text
src/Utils/email/templates/
```

This keeps business logic, email events, templates, and transport concerns separated.

---

## Development Notes

### Repository Pattern

Database access is abstracted through repository classes built on top of Mongoose. This keeps controllers and services focused on business rules.

### Validation

DTO-based validation is applied to:

```text
body
params
query
headers
```

### File Uploads

Multer handles local file parsing and validation for profile images, company assets, and application CVs.

### Socket Authentication

Socket.IO connections use JWT authentication and the same token-validation infrastructure as protected HTTP requests.

### Generated Files

Generated report files are stored in `downloads/`. The folder should be excluded from version control.

---

## Future Improvements

- Swagger/OpenAPI documentation
- Automated unit and integration testing
- Background jobs for email and push delivery
- More advanced FCM token lifecycle management
- Structured logging and observability
- CI/CD pipelines
- Docker support
- Production deployment configuration
- Recruitment analytics and advanced reporting

---

## License

This project is currently intended for educational and portfolio purposes.

You can replace this section with the license you choose, for example:

```text
MIT License
```

---

## Author

**Wazfnee Backend**

Built with Node.js, Express, TypeScript, MongoDB, Socket.IO, Firebase Cloud Messaging, GraphQL, and a modular service/repository architecture.
