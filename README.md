# EcoNomos - Personal Finance Manager

EcoNomos is a full-stack personal finance management application built as a bachelor's degree final project. It lets users track income and expenses, manage per-category spending budgets, and set savings goals with real-time progress tracking.

The backend is a RESTful API built with Node.js and Express, backed by a PostgreSQL database and secured with JSON Web Tokens. The frontend is built with React and Vite, fully responsive across all device sizes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js 5 |
| ORM | Sequelize 6 |
| Database | PostgreSQL 15 (via Docker) |
| Authentication | JSON Web Tokens (7-day expiry) |
| Password Hashing | bcrypt |
| AI Categorization | Google Gemini 2.5 Flash |
| Frontend | React + Vite |

---

## Project Structure

```
economos/
├── server/
│   ├── database/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Category.js
│   │   │   ├── Transaction.js
│   │   │   ├── Budget.js
│   │   │   └── SavingsGoal.js
│   │   ├── associations.js
│   │   ├── db.js
│   │   └── seed.js
│   ├── middleware/
│   │   └── tokenCheck.js
│   ├── routes/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── usersController.js
│   │   │   ├── categoriesController.js
│   │   │   ├── transactionsController.js
│   │   │   ├── budgetsController.js
│   │   │   └── savingsController.js
│   │   ├── authRoutes.js
│   │   └── apiRoutes.js
│   ├── docker-compose.yml
│   ├── package.json
│   └── server.js
└── client/
    ├── src/
    │   ├── ChartComponents/
    │   ├── context/
    │   ├── locales/
    │   └── ...
    ├── package.json
    └── vite.config.js
```

---

## Getting Started

### Prerequisites

Before you start, make sure you have the following installed:

- Node.js 18 or higher
- npm
- Docker and Docker Compose
- A Google Gemini API key (required for the bank import feature)

---

### Step 1 — Backend Environment Variables

Create a `.env` file inside the `server/` folder. All variables listed below are required.

```env
# PostgreSQL connection
POSTGRES_DB=economos_db
POSTGRES_USER=admin
POSTGRES_PASSWORD=supersecret
POSTGRES_HOST=localhost

# Express server
PORT=3000

# pgAdmin GUI credentials
PGADMIN_EMAIL=admin@economos.local
PGADMIN_PASSWORD=admin

# JWT signing secret (generate a random one with the command below)
JWT_SECRET=your_random_secret_key_here

# Google Gemini API key (used for AI transaction categorization)
GEMINI_API_KEY=your_gemini_api_key_here
```

To generate a secure `JWT_SECRET`, run:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### Step 2 — Frontend Environment Variables

Create a `.env` file inside the `client/` folder:

```env
VITE_API_URL=http://localhost:3000
```

---

### Step 3 — Start the Database

Navigate to the `server/` folder and spin up the Docker containers:

```bash
cd server
docker-compose up -d
```

This starts two services:

- PostgreSQL on port `5432`
- pgAdmin (database GUI) on port `5050` — accessible at `http://localhost:5050`

To stop the containers:

```bash
docker-compose down
```

---

### Step 4 — Start the Backend

```bash
cd server
npm install
npm run dev
```

On first startup the server will automatically sync the database schema and seed the default system categories. You should see output similar to:

```
Successfully connected to database.
Added category: food
Added category: transport
...
The server is running on: http://localhost:3000
```

---

### Step 5 — Start the Frontend

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` by default.

---

## Features

### Authentication

Users register with a first name, last name, username, email, password, preferred language, and preferred currency. Passwords are hashed with bcrypt before storage. Login returns a signed JWT token with a 7-day expiry. All protected routes require this token to be passed as a custom `token` header.

Language preference is persisted per user and synced to the server when changed. Supported languages are English and Romanian.

---

### Dashboard

The dashboard gives an at-a-glance overview of the user's financial state for the current month:

- **Expense distribution donut chart** — shows how spending is split across categories using an animated interactive SVG donut chart. Hovering over a segment highlights it and shows the exact amount spent.
- **Month-over-month bar chart** — compares total expenses between last month and this month using an animated bar chart.
- **Budget consumption gauge** — a radial semicircle gauge that shows the percentage of the monthly budget that has been consumed. Turns red when consumption exceeds 80%.
- **Recent transactions list** — the 5 most recent transactions across all time, each expandable to show full details.

---

### Transactions

Full transaction management with filtering and pagination:

- Add transactions manually, specifying title, amount, category, date, and an optional description.
- Delete transactions.
- Filter by type (income or expense), category, month, and year. Filters can be combined.
- Paginated results with 20 transactions per page and smart page number display including ellipsis for large page counts.
- Each transaction row is expandable to reveal full details: description, amount, date, category, type, and source.

---

### Categories

Two types of categories exist: system categories shared across all users, and custom categories created by individual users.

System categories cannot be edited or deleted. Custom categories can be fully managed. Categories have a type (income or expense) and an icon. The following system categories are seeded on first startup:

Expense categories: food, transport, utilities, entertainment, shopping, health, housing, travel, education, personal care, pets, gifts, investments.

Income categories: salary, freelance, dividends, refunds.

---

### Budgets

Users can set spending limits per category and per time period (monthly, weekly, or yearly). The budget status endpoint calculates spending in real time and assigns one of four statuses to each budget:

- `untouched` — no spending recorded yet in that period
- `safe` — below 80% of the limit
- `warning` — between 80% and 99%
- `exceeded` — at or above 100%

Only one budget per category per period is allowed. A budget with no category assigned acts as a global budget covering all expenses.

---

### Savings Goals

Users can create savings goals with a title, target amount, and deadline. Funds can be added or withdrawn at any time. The system tracks current amount, calculates a progress percentage, and flags goals as completed once the target is reached.

---

### Bank Data Import (AI-Powered)

A one-time bank data import feature generates realistic mock transaction history for the past 7 months, simulating a real bank feed. Transactions are automatically categorized using Google Gemini AI, which maps each unique merchant name to the most appropriate category from the user's category list. This import can only be performed once per account.

After the initial import, a daily sync endpoint can be called at login to generate and categorize any missing transactions since the last recorded date, keeping the transaction history continuously up to date.

---

### Statistics (Planned)

A dedicated statistics page is planned to surface deeper financial insights including 7-month income and expense trend lines, top expenses for any given month, daily spending averages, and detailed month-over-month comparisons. The backend endpoints for all of these are fully implemented.

---

### Internationalization

The application supports English and Romanian. All UI strings, category names, error messages, and labels are driven by locale files. The language can be switched at any time from both the login screen and the main application layout, and the preference is synced to the user's account on the server.

---

### UI and Design

- Clean black-and-white neobrutalist design system with bold borders, offset box shadows, and a serif font (IBM Plex Serif).
- All charts are custom-built SVG components with smooth CSS and JavaScript animations. No third-party chart library is used.
- A global loading overlay with a spinning logo is shown during all async operations.
- A responsive hamburger sidebar navigation with a backdrop overlay.
- Fully responsive layout that adapts down to 320px wide screens.

---

## Notes

- JWT tokens expire after 7 days. After expiry the user must log in again.
- The database schema is synced automatically on each server startup using `sequelize.sync()`. No migrations are needed during development.
- The Gemini API key is required only for the bank import feature. The rest of the application functions without it.