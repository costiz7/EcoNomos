# EcoNomos - Personal Finance Manager

EcoNomos is a full-stack personal finance management application developed as a bachelor's degree final project. It allows users to track income and expenses, manage spending budgets per category, and set savings goals with progress tracking.

The backend is built with Node.js and Express.js, uses PostgreSQL as the database, and exposes a RESTful API secured with JSON Web Tokens. 

!!!IN DEVELOPMENT!!!
The frontend is built with React and Vite and is fully responsive across all device sizes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js 5 |
| ORM | Sequelize 6 |
| Database | PostgreSQL 15 (via Docker) |
| Authentication | JSON Web Tokens |
| Password Hashing | bcrypt |
| Frontend | React + Vite |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm
- Docker and Docker Compose

### 1. Environment Configuration

Create a `.env` file inside the `server` folder with the following content:

```env
POSTGRES_DB=economos_db
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
PORT=3000
PGADMIN_EMAIL=your_email@example.com
PGADMIN_PASSWORD=your_pgadmin_password
JWT_SECRET=your_random_secret_key_here
```

To generate a secure value for `JWT_SECRET`, run:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Start the Database

Navigate to the `server` folder and start the Docker containers:

```bash
cd server
docker-compose up -d
```

This starts two services:
- PostgreSQL on port `5432`
- pgAdmin (database GUI) on port `5050` at `http://localhost:5050`

To stop the containers:

```bash
docker-compose down
```

### 3. Start the Backend Server

```bash
cd server
npm install
npm run dev
```

On first startup the server will automatically sync the database schema and seed the default system categories. You should see:

```
Conectat la baza de date
Categorie adaugata: food
Categorie adaugata: transport
...
Serverul ruleaza pe: http://localhost:3000
```

## API Reference

All protected routes require a valid JWT token passed as a custom header:

```
token: <your_jwt_token>
```

You receive this token after a successful login.

---

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /auth/register | No | Create a new account |
| POST | /auth/login | No | Login and receive a JWT token |

---

#### POST /auth/register

**Request body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "your_password",
  "language": "en",
  "currency": "RON"
}
```

`language` and `currency` are optional and default to `ro` and `RON`.

**Response `201 Created`:**
```json
{
  "message": "Welcome, john_doe!",
  "newUser": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "username": "john_doe",
    "email": "john@example.com",
    "language": "en",
    "currency": "RON",
    "iconFile": "default_avatar.png"
  }
}
```

---

#### POST /auth/login

**Request body:**
```json
{
  "email": "john@example.com",
  "password": "your_password"
}
```

**Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "username": "john_doe",
    "email": "john@example.com",
    "language": "en",
    "currency": "RON",
    "iconFile": "default_avatar.png"
  }
}
```

---

### User Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/user | Yes | Get current user's profile |
| PUT | /api/user | Yes | Update current user's profile |

---

#### GET /api/user

No request body required.

**Response `200 OK`:**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "username": "john_doe",
  "email": "john@example.com",
  "language": "en",
  "currency": "RON",
  "iconFile": "default_avatar.png"
}
```

---

#### PUT /api/user

All fields are optional. Only the fields you include will be updated.

**Request body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "iconFile": "avatar1.png",
  "language": "en",
  "currency": "EUR"
}
```

**Response `200 OK`:** Returns the full updated user object (same shape as GET /api/user).

---

### Categories

Categories classify transactions as `income` or `expense`. System categories are shared across all users and cannot be modified. User categories are created and managed by each individual user.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/categories | Yes | Get all accessible categories |
| POST | /api/categories | Yes | Create a custom category |
| PUT | /api/categories/:id | Yes | Update a custom category |
| DELETE | /api/categories/:id | Yes | Delete a custom category |

---

#### GET /api/categories

No request body or query parameters required.

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "name": "food",
    "type": "expense",
    "iconFile": "icon_food",
    "userId": null
  },
  {
    "id": 8,
    "name": "Subscriptions",
    "type": "expense",
    "iconFile": "icon_subscriptions",
    "userId": 1
  }
]
```

Categories with `userId: null` are system categories. The rest belong to the authenticated user.

---

#### POST /api/categories

**Request body:**
```json
{
  "name": "Subscriptions",
  "type": "expense",
  "iconFile": "icon_subscriptions"
}
```

`type` must be exactly `income` or `expense`. `iconFile` is optional and defaults to `category1`.

**Response `201 Created`:**
```json
{
  "id": 8,
  "name": "Subscriptions",
  "type": "expense",
  "iconFile": "icon_subscriptions",
  "userId": 1
}
```

---

#### PUT /api/categories/:id

**Request body** (at least one field required):
```json
{
  "name": "Streaming",
  "iconFile": "icon_streaming"
}
```

**Response `200 OK`:** Returns the full updated category object.

---

#### DELETE /api/categories/:id

No request body required.

**Response `200 OK`:**
```json
{ "message": "Category deleted" }
```

---

### Transactions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/transactions | Yes | Get transactions with optional filters |
| POST | /api/transactions | Yes | Add a new transaction |
| DELETE | /api/transactions/:id | Yes | Delete a transaction |
| GET | /api/transactions/totals | Yes | Monthly income, expense, and balance |
| GET | /api/transactions/breakdown | Yes | Expense totals grouped by category |
| GET | /api/transactions/trend | Yes | Income and expense over the last 6 months |
| GET | /api/transactions/mom | Yes | Month-over-month expense comparison |
| GET | /api/transactions/top | Yes | Top 5 largest expenses for a month |
| GET | /api/transactions/recent | Yes | Last 5 transactions across all time |
| GET | /api/transactions/average | Yes | Average daily spending for a month |

---

#### GET /api/transactions

**Query parameters** (all optional):

| Parameter | Type | Description |
|---|---|---|
| month | integer | Filter by month (1-12) |
| year | integer | Filter by year (e.g. 2025) |
| categoryId | integer | Filter by a specific category |
| type | string | Filter by `income` or `expense` |

**Response `200 OK`:**
```json
[
  {
    "id": 12,
    "amount": "150.00",
    "date": "2025-03-11",
    "description": "Weekly groceries",
    "userId": 1,
    "categoryId": 3,
    "Category": {
      "name": "food",
      "iconFile": "icon_food",
      "type": "expense"
    }
  }
]
```

---

#### POST /api/transactions

**Request body:**
```json
{
  "amount": 150.00,
  "categoryId": 3,
  "date": "2025-03-11",
  "description": "Weekly groceries"
}
```

`date` defaults to today if not provided. `description` is optional.

**Response `201 Created`:**
```json
{
  "id": 12,
  "amount": "150.00",
  "date": "2025-03-11",
  "description": "Weekly groceries",
  "userId": 1,
  "categoryId": 3
}
```

---

#### DELETE /api/transactions/:id

No request body required.

**Response `200 OK`:**
```json
{ "message": "The transaction was successfully deleted" }
```

---

#### GET /api/transactions/totals

**Query parameters** (both optional, default to current month/year):

| Parameter | Type | Description |
|---|---|---|
| month | integer | Target month (1-12) |
| year | integer | Target year |

**Response `200 OK`:**
```json
{
  "income": 3000.00,
  "expense": 1245.50,
  "balance": 1754.50
}
```

---

#### GET /api/transactions/breakdown

**Query parameters:** `month`, `year` (both optional, default to current month/year).

**Response `200 OK`:** Array sorted by total descending.
```json
[
  { "category": "food", "icon": "icon_food", "total": 620.00 },
  { "category": "transport", "icon": "icon_transport", "total": 210.00 }
]
```

---

#### GET /api/transactions/trend

No parameters required.

**Response `200 OK`:** One entry per month for the last 6 months including the current one.
```json
[
  { "month": 10, "year": 2024, "income": 2800.00, "expense": 1100.00 },
  { "month": 11, "year": 2024, "income": 3100.00, "expense": 980.00 },
  { "month": 12, "year": 2024, "income": 2750.00, "expense": 1320.00 },
  { "month": 1,  "year": 2025, "income": 3000.00, "expense": 1100.00 },
  { "month": 2,  "year": 2025, "income": 3000.00, "expense": 1050.00 },
  { "month": 3,  "year": 2025, "income": 3000.00, "expense": 1245.50 }
]
```

---

#### GET /api/transactions/mom

**Query parameters:** `month`, `year` (both optional, default to current month/year).

**Response `200 OK`:**
```json
{
  "currentExpense": 1245.50,
  "previousExpense": 1100.00,
  "percentage": 13.23,
  "trend": "up"
}
```

`trend` is one of `up`, `down`, or `flat`.

---

#### GET /api/transactions/top

**Query parameters:** `month`, `year` (both optional, default to current month/year).

**Response `200 OK`:** Up to 5 transactions ordered by amount descending.
```json
[
  {
    "id": 5,
    "amount": "420.00",
    "date": "2025-03-02",
    "description": "Rent",
    "categoryId": 7,
    "Category": { "name": "utilities", "iconFile": "icon_utilities", "type": "expense" }
  },
  {
    "id": 12,
    "amount": "150.00",
    "date": "2025-03-11",
    "description": "Weekly groceries",
    "categoryId": 3,
    "Category": { "name": "food", "iconFile": "icon_food", "type": "expense" }
  }
]
```

---

#### GET /api/transactions/recent

No parameters required.

**Response `200 OK`:** The 5 most recent transactions regardless of month, same shape as the top expenses response above.

---

#### GET /api/transactions/average

**Query parameters:** `month`, `year` (both optional, default to current month/year).

**Response `200 OK`:**
```json
{ "dailyAverage": 41.52 }
```

---

### Budgets

Budgets set a spending limit for a specific category and period. The system tracks spending in real time and returns a status for each budget.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/budgets | Yes | Create a new budget |
| GET | /api/budgets | Yes | Get all budgets |
| GET | /api/budgets/status | Yes | Get spending status for all budgets |
| PUT | /api/budgets/:id | Yes | Update a budget |
| DELETE | /api/budgets/:id | Yes | Delete a budget |

---

#### POST /api/budgets

Only one budget per category per period is allowed.

**Request body:**
```json
{
  "amount": 500.00,
  "categoryId": 1,
  "period": "monthly"
}
```

`period` accepts `monthly`, `weekly`, or `yearly`. Defaults to `monthly`.

**Response `201 Created`:**
```json
{
  "id": 3,
  "amount": "500.00",
  "period": "monthly",
  "categoryId": 1,
  "userId": 1
}
```

---

#### GET /api/budgets

No request body or query parameters required.

**Response `200 OK`:**
```json
[
  {
    "id": 3,
    "amount": "500.00",
    "period": "monthly",
    "categoryId": 1,
    "userId": 1,
    "Category": {
      "name": "food",
      "iconFile": "icon_food",
      "type": "expense"
    }
  }
]
```

---

#### GET /api/budgets/status

**Query parameters:** `month`, `year` (both optional, default to current month/year).

**Response `200 OK`:**
```json
[
  {
    "budgetId": 3,
    "categoryId": 1,
    "categoryName": "food",
    "categoryIcon": "icon_food",
    "period": "monthly",
    "limit": 500.00,
    "spent": 420.00,
    "remaining": 80.00,
    "percentage": 84.00,
    "status": "warning"
  }
]
```

`status` values:

| Value | Condition |
|---|---|
| `untouched` | No spending recorded yet |
| `safe` | Below 80% of the limit |
| `warning` | Between 80% and 99% |
| `exceeded` | At or above 100% |

---

#### PUT /api/budgets/:id

**Request body** (at least one field required):
```json
{
  "amount": 600.00,
  "period": "monthly"
}
```

**Response `200 OK`:** Returns the full updated budget object.

---

#### DELETE /api/budgets/:id

No request body required.

**Response `200 OK`:**
```json
{ "message": "The budget was successfully deleted." }
```

---

### Savings Goals

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/savings | Yes | Create a new savings goal |
| GET | /api/savings | Yes | Get all goals with progress |
| PATCH | /api/savings/:id/add | Yes | Add funds to a goal |
| DELETE | /api/savings/:id | Yes | Delete a goal |

---

#### POST /api/savings

**Request body:**
```json
{
  "title": "New Laptop",
  "targetAmount": 1500.00,
  "deadline": "2025-12-01"
}
```

**Response `201 Created`:**
```json
{
  "id": 1,
  "title": "New Laptop",
  "targetAmount": "1500.00",
  "currentAmount": "0.00",
  "deadline": "2025-12-01",
  "userId": 1
}
```

---

#### GET /api/savings

No request body or query parameters required.

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "title": "New Laptop",
    "targetAmount": 1500.00,
    "currentAmount": 750.00,
    "deadline": "2025-12-01",
    "progressPercentage": 50.00,
    "isCompleted": false
  }
]
```

---

#### PATCH /api/savings/:id/add

**Request body:**
```json
{ "amountToAdd": 200.00 }
```

**Response `200 OK`:**
```json
{
  "message": "Funds added!",
  "goal": {
    "id": 1,
    "title": "New Laptop",
    "targetAmount": "1500.00",
    "currentAmount": "950.00",
    "deadline": "2025-12-01",
    "userId": 1
  },
  "targetReached": false
}
```

If the goal is completed after adding funds, `message` becomes `"Congrats! You filled your piggybank."` and `targetReached` is `true`.

---

#### DELETE /api/savings/:id

No request body required.

**Response `200 OK`:**
```json
{ "message": "Goal deleted." }
```

---

## Error Handling

All error responses follow this format:

```json
{
  "message": "Human readable error description",
  "error": "Technical error details (only on 500 errors)"
}
```

| Status | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource created |
| 400 | Bad request - missing or invalid data |
| 401 | Unauthorized - token missing or invalid |
| 403 | Forbidden - not permitted to access this resource |
| 404 | Resource not found |
| 500 | Internal server error |

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
└── client/                  (React + Vite - in progress)
```

---

## Notes

- On first startup the server automatically seeds default system categories: `food`, `transport`, `utilities`, `entertainment`, `shopping`, `health`, and `salary`.
- The database schema is synced automatically on each startup using `sequelize.sync({ alter: true })`.
- System categories (those with `userId: null`) are shared across all users and cannot be edited or deleted through the API.
- JWT tokens expire after 7 days. After expiry the user must log in again.
