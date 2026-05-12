# EcoNomos — Backend API Reference

This document covers all available API endpoints, their expected inputs, and their responses.

All protected routes require a valid JWT token passed as a custom request header:

```
token: <your_jwt_token>
```

You receive this token after a successful login. Tokens expire after 7 days.

---

## Error Response Format

All error responses follow this shape:

```json
{
  "message": "Human readable description",
  "error": "Technical details (only included on 500 errors)"
}
```

| Status | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource created |
| 400 | Bad request — missing or invalid data |
| 401 | Unauthorized — token missing or invalid |
| 403 | Forbidden — not permitted to access this resource |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Authentication

### POST /auth/register

Creates a new user account.

**Auth required:** No

**Request body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "yourpassword",
  "language": "en",
  "currency": "RON"
}
```

`language` defaults to `ro` if omitted. `currency` defaults to `RON` if omitted. Supported language values: `en`, `ro`. Supported currency values: `RON`, `EUR`.

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

**Error codes:** `MISSING_REQUIRED_FIELDS`, `USERNAME_TAKEN`, `EMAIL_TAKEN`, `SERVER_ERROR`

---

### POST /auth/login

Authenticates a user and returns a signed JWT token.

**Auth required:** No

**Request body:**

```json
{
  "email": "john@example.com",
  "password": "yourpassword",
  "language": "en"
}
```

`language` is optional. If provided and different from the stored preference, the user's language is updated automatically.

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

**Error codes:** `MISSING_CREDENTIALS`, `INVALID_CREDENTIALS`, `SERVER_ERROR`

---

## User Profile

### GET /api/user

Returns the authenticated user's profile. Password is excluded from the response.

**Auth required:** Yes

**Request body:** None

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
  "iconFile": "default_avatar.png",
  "hasImportedBankData": false
}
```

**Error codes:** `USER_NOT_FOUND`, `SERVER_ERROR`

---

### PATCH /api/user

Updates one or more fields on the authenticated user's profile. All fields are optional — only the ones included will be updated.

**Auth required:** Yes

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

**Error codes:** `USER_NOT_FOUND`, `SERVER_ERROR`

---

## Categories

Categories classify transactions as `income` or `expense`. System categories have `userId: null`, are shared across all users, and cannot be modified or deleted. User categories are created and managed by each individual user.

---

### GET /api/categories

Returns all categories accessible to the authenticated user — both system categories and the user's own custom categories.

**Auth required:** Yes

**Request body:** None

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
    "id": 18,
    "name": "Subscriptions",
    "type": "expense",
    "iconFile": "icon_subscriptions",
    "userId": 1
  }
]
```

Results are ordered by `userId` ascending (system categories first), then alphabetically by name.

---

### POST /api/categories

Creates a new custom category for the authenticated user.

**Auth required:** Yes

**Request body:**

```json
{
  "name": "Subscriptions",
  "type": "expense",
  "iconFile": "icon_subscriptions"
}
```

`type` must be exactly `income` or `expense`. `iconFile` defaults to `icon_default` if omitted.

**Response `201 Created`:**

```json
{
  "id": 18,
  "name": "Subscriptions",
  "type": "expense",
  "iconFile": "icon_subscriptions",
  "userId": 1
}
```

**Error codes:** `MISSING_CATEGORY_NAME`, `INVALID_CATEGORY_TYPE`, `SERVER_ERROR`

---

### PATCH /api/categories/:id

Updates a custom category. Only `name` and `iconFile` can be changed. System categories cannot be edited.

**Auth required:** Yes

**Request body** (at least one field required):

```json
{
  "name": "Streaming Services",
  "iconFile": "icon_streaming"
}
```

**Response `200 OK`:** Returns the full updated category object.

**Error codes:** `CATEGORY_NOT_FOUND`, `FORBIDDEN_GLOBAL_CATEGORY_MODIFICATION`, `UNAUTHORIZED_CATEGORY_MODIFICATION`, `SERVER_ERROR`

---

### DELETE /api/categories/:id

Deletes a custom category. System categories cannot be deleted.

**Auth required:** Yes

**Request body:** None

**Response `200 OK`:**

```json
{ "message": "Category deleted" }
```

**Error codes:** `CATEGORY_NOT_FOUND`, `FORBIDDEN_GLOBAL_CATEGORY_DELETION`, `UNAUTHORIZED_CATEGORY_DELETION`, `SERVER_ERROR`

---

## Transactions

### GET /api/transactions

Returns a paginated list of the authenticated user's transactions with optional filters.

**Auth required:** Yes

**Query parameters** (all optional):

| Parameter | Type | Description |
|---|---|---|
| month | integer | Filter by month (1–12). Must be used together with `year`. |
| year | integer | Filter by year (e.g. 2025). Must be used together with `month`. |
| categoryId | integer | Filter by a specific category ID. Accepts comma-separated values for multiple. |
| type | string | Filter by `income` or `expense`. |
| page | integer | Page number (default: 1). |
| limit | integer | Items per page (default: 20). |

**Response `200 OK`:**

```json
{
  "transactions": [
    {
      "id": 12,
      "amount": "150.00",
      "date": "2025-03-11",
      "title": "Weekly groceries",
      "description": "Lidl run",
      "source": "manual",
      "userId": 1,
      "categoryId": 1,
      "Category": {
        "name": "food",
        "iconFile": "icon_food",
        "type": "expense"
      }
    }
  ],
  "pagination": {
    "totalItems": 87,
    "totalPages": 5,
    "currentPage": 1,
    "itemsPerPage": 20
  }
}
```

Results are ordered by date descending, then by creation time descending.

---

### POST /api/transactions

Creates a new transaction.

**Auth required:** Yes

**Request body:**

```json
{
  "title": "Weekly groceries",
  "amount": 150.00,
  "categoryId": 1,
  "date": "2025-03-11",
  "description": "Lidl run"
}
```

`date` defaults to today if omitted. `description` is optional. The `categoryId` must belong to either a system category or a category owned by the authenticated user.

**Response `201 Created`:**

```json
{
  "id": 12,
  "amount": "150.00",
  "date": "2025-03-11",
  "title": "Weekly groceries",
  "description": "Lidl run",
  "source": "manual",
  "userId": 1,
  "categoryId": 1
}
```

**Error codes:** `MISSING_TITLE`, `MISSING_AMOUNT`, `MISSING_CATEGORY`, `CATEGORY_NOT_FOUND`, `SERVER_ERROR`

---

### DELETE /api/transactions/:id

Deletes a transaction. Only the transaction's owner can delete it.

**Auth required:** Yes

**Request body:** None

**Response `200 OK`:**

```json
{ "message": "Transaction deleted successfully." }
```

**Error codes:** `TRANSACTION_NOT_FOUND_OR_UNAUTHORIZED`, `SERVER_ERROR`

---

### GET /api/transactions/totals

Returns total income, total expenses, and net balance for a specific month.

**Auth required:** Yes

**Query parameters** (both optional, default to current month/year):

| Parameter | Type | Description |
|---|---|---|
| month | integer | Target month (1–12) |
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

### GET /api/transactions/breakdown

Returns total spending grouped by expense category for a given month, sorted by total descending.

**Auth required:** Yes

**Query parameters:** `month`, `year` (both optional, default to current month/year)

**Response `200 OK`:**

```json
[
  { "category": "food", "icon": "icon_food", "total": 620.00 },
  { "category": "transport", "icon": "icon_transport", "total": 210.00 }
]
```

---

### GET /api/transactions/trend

Returns income and expense totals for each of the past 7 months including the current one.

**Auth required:** Yes

**Query parameters:** None

**Response `200 OK`:**

```json
[
  { "month": 9, "year": 2024, "income": 2800.00, "expense": 1100.00 },
  { "month": 10, "year": 2024, "income": 3100.00, "expense": 980.00 },
  { "month": 11, "year": 2024, "income": 2750.00, "expense": 1320.00 },
  { "month": 12, "year": 2024, "income": 3000.00, "expense": 1100.00 },
  { "month": 1,  "year": 2025, "income": 3000.00, "expense": 1050.00 },
  { "month": 2,  "year": 2025, "income": 3100.00, "expense": 1180.00 },
  { "month": 3,  "year": 2025, "income": 3000.00, "expense": 1245.50 }
]
```

---

### GET /api/transactions/mom

Returns a month-over-month expense comparison for a given month.

**Auth required:** Yes

**Query parameters:** `month`, `year` (both optional, default to current month/year)

**Response `200 OK`:**

```json
{
  "currentExpense": 1245.50,
  "previousExpense": 1100.00,
  "percentage": 13.23,
  "trend": "up"
}
```

`trend` is one of `up`, `down`, or `flat`. `percentage` is positive when spending increased and negative when it decreased.

---

### GET /api/transactions/top

Returns the top 5 largest expense transactions for a given month, ordered by amount descending.

**Auth required:** Yes

**Query parameters:** `month`, `year` (both optional, default to current month/year)

**Response `200 OK`:**

```json
[
  {
    "id": 5,
    "amount": "420.00",
    "date": "2025-03-02",
    "title": "Rent",
    "description": "",
    "source": "manual",
    "categoryId": 7,
    "Category": { "name": "utilities", "iconFile": "icon_utilities", "type": "expense" }
  }
]
```

---

### GET /api/transactions/recent

Returns the 5 most recent transactions regardless of month, ordered by date and creation time descending.

**Auth required:** Yes

**Query parameters:** None

**Response `200 OK`:** Same shape as the items in the `/top` response above.

---

### GET /api/transactions/average

Returns the average daily spending for a given month. If the target is the current month, the average is computed over the days elapsed so far. For past months, it is computed over the full month.

**Auth required:** Yes

**Query parameters:** `month`, `year` (both optional, default to current month/year)

**Response `200 OK`:**

```json
{ "dailyAverage": 41.52 }
```

---

### POST /api/transactions/import-bank

One-time endpoint that generates 7 months of realistic mock bank transaction history and categorizes every transaction automatically using Google Gemini AI. Can only be called once per account — subsequent calls return an error.

**Auth required:** Yes

**Request body:** None

**Response `200 OK`:**

```json
{
  "message": "Bank data imported and categorized successfully.",
  "count": 842
}
```

**Error codes:** `ALREADY_IMPORTED`, `NO_CATEGORIES_FOUND`, `SERVER_ERROR`

---

### POST /api/transactions/dailysync

Generates and categorizes any missing transactions from the last recorded date up to today. Only runs if the user has previously completed the bank import. Intended to be called at each login to keep transaction history current.

**Auth required:** Yes

**Request body:** None

**Response `200 OK`:**

```json
{
  "message": "Daily sync complete. Added 14 transactions.",
  "count": 14
}
```

Returns `count: 0` with an informational message if the account is already up to date or if bank import has not been performed.

---

## Budgets

Budgets define a spending limit for a category over a time period. The system tracks real-time spending against each budget and returns a status.

---

### POST /api/budgets

Creates a new budget. Only one budget per category per period is allowed per user. A budget with no `categoryId` (or `categoryId: null`) acts as a global budget covering total monthly spending.

**Auth required:** Yes

**Request body:**

```json
{
  "amount": 500.00,
  "categoryId": 1,
  "period": "monthly"
}
```

`period` accepts `monthly`, `weekly`, or `yearly`. Defaults to `monthly` if omitted. `categoryId` is optional — omit it or pass `null` for a global budget.

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

**Error codes:** `MISSING_AMOUNT`, `BUDGET_ALREADY_EXISTS`, `SERVER_ERROR`

---

### GET /api/budgets

Returns all budgets for the authenticated user, including the associated category details. Ordered by creation date descending.

**Auth required:** Yes

**Request body:** None

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

### GET /api/budgets/status

Returns real-time spending status for all of the user's budgets for a given month. Spending is calculated from actual expense transactions in that period.

**Auth required:** Yes

**Query parameters:** `month`, `year` (both optional, default to current month/year)

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

A global budget (no category) aggregates all expense spending across every category. `categoryName` will be `"Global Budget"` for these entries.

---

### PATCH /api/budgets/:id

Updates a budget's amount or period. At least one field must be provided.

**Auth required:** Yes

**Request body:**

```json
{
  "amount": 600.00,
  "period": "monthly"
}
```

**Response `200 OK`:** Returns the full updated budget object.

**Error codes:** `BUDGET_NOT_FOUND`, `SERVER_ERROR`

---

### DELETE /api/budgets/:id

Deletes a budget. Only the budget's owner can delete it.

**Auth required:** Yes

**Request body:** None

**Response `200 OK`:**

```json
{ "message": "The budget was successfully deleted." }
```

**Error codes:** `BUDGET_NOT_FOUND_OR_UNAUTHORIZED`, `SERVER_ERROR`

---

## Savings Goals

### POST /api/savings

Creates a new savings goal.

**Auth required:** Yes

**Request body:**

```json
{
  "name": "New Laptop",
  "targetAmount": 1500.00,
  "deadline": "2025-12-01"
}
```

All three fields are required. `targetAmount` must be greater than zero.

**Response `201 Created`:**

```json
{
  "id": 1,
  "name": "New Laptop",
  "targetAmount": "1500.00",
  "currentAmount": "0.00",
  "deadline": "2025-12-01",
  "userId": 1
}
```

**Error codes:** `MISSING_GOAL_FIELDS`, `INVALID_AMOUNT`, `SERVER_ERROR`

---

### GET /api/savings

Returns all savings goals for the authenticated user, with calculated progress. Ordered by creation date descending.

**Auth required:** Yes

**Request body:** None

**Response `200 OK`:**

```json
[
  {
    "id": 1,
    "name": "New Laptop",
    "targetAmount": 1500.00,
    "currentAmount": 750.00,
    "deadline": "2025-12-01",
    "progressPercentage": 50.00,
    "isCompleted": false
  }
]
```

---

### PATCH /api/savings/:id/add

Adds funds to a savings goal. If the total reaches or exceeds the target, the response message changes and `targetReached` is set to `true`.

**Auth required:** Yes

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
    "name": "New Laptop",
    "targetAmount": "1500.00",
    "currentAmount": "950.00",
    "deadline": "2025-12-01",
    "userId": 1
  },
  "targetReached": false
}
```

When the target is reached, `message` becomes `"Congrats! You reached your savings target."` and `targetReached` is `true`.

**Error codes:** `INVALID_AMOUNT`, `GOAL_NOT_FOUND_OR_UNAUTHORIZED`, `SERVER_ERROR`

---

### PATCH /api/savings/:id/withdraw

Withdraws funds from a savings goal. The withdrawal amount cannot exceed the current balance.

**Auth required:** Yes

**Request body:**

```json
{ "amountToWithdraw": 100.00 }
```

**Response `200 OK`:**

```json
{
  "message": "Funds withdrawn successfully.",
  "goal": {
    "id": 1,
    "name": "New Laptop",
    "targetAmount": "1500.00",
    "currentAmount": "850.00",
    "deadline": "2025-12-01",
    "userId": 1
  }
}
```

**Error codes:** `INVALID_AMOUNT`, `INSUFFICIENT_FUNDS`, `GOAL_NOT_FOUND_OR_UNAUTHORIZED`, `SERVER_ERROR`

---

### DELETE /api/savings/:id

Deletes a savings goal. Only the goal's owner can delete it.

**Auth required:** Yes

**Request body:** None

**Response `200 OK`:**

```json
{ "message": "Goal deleted." }
```

**Error codes:** `GOAL_NOT_FOUND_OR_UNAUTHORIZED`, `SERVER_ERROR`