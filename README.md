# 💸 FinanceFlow

## 🌐 Live Application

Frontend:  
https://finance-flow-five-wine.vercel.app/

Backend API:  
https://finance-flow-7fk1.onrender.com

---

## 📌 Project Description

FinanceFlow is a full-stack web-based financial management application designed to help users track income and expenses, manage budgets, and plan future financial goals.

The system provides a simple and interactive interface that allows users to:
- Record and manage financial transactions  
- Track spending and income  
- Create and manage budgets  
- Set financial goals and plans  
- Manage cards and cash balances  
- Receive insights based on financial activity  

The goal of FinanceFlow is to make personal finance organized, clear, and easy to manage.

---

## ⚙️ Setup and Installation

### 1. Clone the repository
bash git clone <https://github.com/ShahadAlmatrudi/finance-flow.git> 

### 2. Frontend setup
bash cd finance-flow/frontend npm install npm run dev 

### 3. Backend setup
bash cd finance-flow/backend npm install node server.js 

### 4. Open the application
http://localhost:5173/

---

## 🚀 Usage Instructions

### 1. Landing Page
- Users start on the landing page  
- Can navigate to Login or Sign Up  

### 2. Authentication
- Create a new account (Sign Up)  
- Log in to access the system  

### 3. Questionnaire & Profile Setup
- Enter financial preferences and personal details  
- Customize user financial behavior  

### 4. Plan Setup
- Create financial goals  
- Define saving targets and deadlines  
- Add budget categories and limits  

### 5. Cards & Cash Management
- Add multiple cards (Visa, Mastercard, Mada)  
- Set a primary card  
- Manage available cash balance  

### 6. Transactions
- Add income or expense transactions  
- Select category and payment method  

The system automatically updates:
- Card balances  
- Cash balance  
- Category spending  

### 7. Dashboard & Analytics
- View financial summary:
  - Total income  
  - Total expenses  
  - Remaining balance  
- Analyze spending behavior  

---

## 🧪 Example Usage

Example transaction:

- Title: Grocery Shopping  
- Type: Expense  
- Amount: 150 SAR  
- Category: Food  
- Payment Method: Cash  

Result:
- Cash balance decreases  
- Category spending increases  

---

## 🔌 API Endpoints (Sample)

- POST /api/auth/signup  
- POST /api/auth/login  
- GET /api/users/me  
- PUT /api/users/me  
- POST /api/cards  
- GET /api/cards  
- PUT /api/cash  
- POST /api/transactions/import-pdf  
- GET /api/transactions  
- DELETE /api/transactions/:id  

---

## 🔑 Demo Account

Email: demo@financeflow.com  
Password: 123456  

---

## 🛠️ Technologies Used

### Frontend
- React.js  
- Vite  
- JavaScript (ES6)  
- HTML & CSS  

### Backend
- Node.js  
- Express.js  
- MongoDB Atlas  
- JWT Authentication  

### Deployment
- Vercel (Frontend)  
- Render (Backend)  

---

## 👩‍💻 Team Members and Roles

### Guest & Regular User
- Ola Alhodar  
- Shahad Almatrudi  

Responsibilities:
- User authentication (Login / Sign Up)  
- Questionnaire and profile setup  
- Financial planning (goals and budgets)  
- Transactions system  
- Cards & cash management  
- Dashboard and analytics  
- Frontend logic and UI  

---

### Admin User
- Mashael Alghamdi  
- Dhai Alsubaie  

Responsibilities:
- Admin dashboard  
- User management system  
- Admin interface components  
- System monitoring features  

---

## ⚠️ Known Issues

- PDF import is simulated (prototype only)  
- Some UI pages may still rely on localStorage  
- Minor responsiveness issues on smaller screens  

---

## 🔮 Future Improvements

- Improve backend performance and scalability  
- Enhance API security and validation  
- Add real-time data synchronization  
- Improve mobile responsiveness  
- Add advanced analytics and charts  

---

## 🔗 Wireframes

User & Guest:  
https://balsamiq.cloud/swxk4nn/p97z6se  

Admin Panel:  
https://balsamiq.cloud/swxk4nn/pmlzhte  

---

## 📎 Notes

- Data is stored using MongoDB Atlas via a deployed backend API  
- Environment variables (.env) are used for sensitive data and are not included in the repositor