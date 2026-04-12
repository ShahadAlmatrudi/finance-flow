# 💰 FinanceFlow – Personal Finance Management System

FinanceFlow is a web-based personal finance management system that helps users track their spending, manage budgets, and achieve saving goals through an interactive and user-friendly interface.

---

## 📚 Course Information

* **Course:** SWE 363 – Web Engineering
* **Instructor:** Dr. Khadijah
* **Group:** 33

---

## 👥 Team Members

* Shahad Almatrudi
* Dhai Alsubaie
* Mashael Alghamdi
* Ola Alhodar

---

## 📖 Project Description

Managing personal finances can be overwhelming, especially for students and young professionals dealing with multiple payment methods and frequent transactions.

FinanceFlow provides a structured solution that allows users to:

* Track daily expenses and income
* Manage multiple accounts (cash & cards)
* Set and monitor saving plans
* Analyze spending behavior through visual insights

The system focuses on **simplicity, clarity, and financial awareness**.

---

## 🎯 User Roles

### 👤 Regular User

* Register and log in to the system
* Manage personal finances
* Add cards and cash balances
* Track transactions and categories
* Set and follow saving plans
* View analytics and reports

### 👀 Guest User

* Access landing page and system overview
* Navigate basic information
* Register to become a user

### 🛠️ Admin

* Access admin dashboard
* Manage users
* Monitor transactions
* Manage categories
* View system reports

---

## ⚙️ Core Features

### 🔐 Authentication

* User signup and login
* Admin login (separate access)
* Local storage-based session handling

---

### 🏠 Landing Page

* Entry point of the system
* Overview of features
* Navigation to login/signup

---

### 📊 Dashboard

* Overview of financial status:

  * Cash balance
  * Card balances
  * Saving goals
* Quick access to key features

---

### 💳 Cards & Cash Management

* Add and manage cards
* Track balances
* Manage available cash

---

### 📋 Transactions

* Add, view, and manage transactions
* Categorize expenses
* Filter and track spending

---

### 💰 Budget Management

* Set budget limits per category
* Track usage against limits
* Receive alerts when nearing limits

---

### 🎯 Saving Plans

* Create saving plans based on goals
* View monthly saving targets
* Track progress toward goals

---

### 📈 Analytics

* Visual representation of:

  * Spending patterns
  * Category distribution
  * Monthly comparisons

---

### 🔔 Notifications

* Budget alerts
* System updates
* Financial reminders

---

### ⚙️ Profile & Settings

* View and edit profile
* Manage account preferences

---

## 🛠️ Admin Panel

The system includes a dedicated admin interface:

* Dashboard overview
* User management (view/delete users)
* Transaction monitoring
* Category management
* Reports and system insights

---

## 🧩 Tech Stack

* **Frontend:** React (Vite)
* **Routing:** React Router
* **State Management:** useState / useEffect
* **Storage:** LocalStorage

---

## 📁 Project Structure

finance-flow/
│
├── frontend/        # React application
│   └── src/
│       ├── app/pages/     # User pages
│       ├── admin/         # Admin panel
│       ├── components/    # Shared components
│       └── App.jsx        # Routing configuration
│
├── backend/         # Express server (if used)
├── docs/            # Documentation
└── README.md

---

## 🚀 How to Run the Project

### 1. Clone Repository

git clone <repo-url>
cd finance-flow

### 2. Run Frontend

cd frontend
npm install
npm run dev


## 🔗 Wireframes

* User & Guest:
  https://balsamiq.cloud/swxk4nn/p97z6se

* Admin Panel:
  https://balsamiq.cloud/swxk4nn/pmlzhte

---

## 📌 Notes

* The system is modular and divided among team members
* Each feature was developed separately and integrated using Git
* Navigation is handled using React Router
* The application uses local storage to simulate backend behavior


