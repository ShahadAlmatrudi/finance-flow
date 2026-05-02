# FinanceFlow Admin API Documentation

## Base URL
http://localhost:3000/api/admin

---

## 1) Admin Login

**POST** `/login`

### Request Body
```json
{
  "email": "admin@test.com",
  "password": "123456"
}
Response
{
  "message": "Admin logged in successfully",
  "token": "your_jwt_token"
}

2) Get All Users

GET /users

Description

Returns all users in the system (without passwords).

Response
[
  {
    "_id": "user_id",
    "email": "user@email.com"
  }
]
3) Get All Transactions

GET /transactions

Description

Returns all transactions in the system.

Response
[
  {
    "_id": "transaction_id",
    "amount": 100,
    "type": "expense",
    "category": "Food"
  }
]
4) Get Categories

GET /categories

Description

Returns all budget categories.

Response
[
  {
    "_id": "category_id",
    "name": "Food",
    "limit": 500
  }
]5) Get Reports

GET /reports

Description

Returns a summary report for admin.

Response
{
  "totalTransactions": 10,
  "totalAmount": 1500
}