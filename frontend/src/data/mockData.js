export const summaryData = {
  totalSpending: 1234.56,
  totalIncome: 2500.0,
  netSavings: 1265.44,
};

export const transactions = [
  {
    id: 1,
    date: "2024-07-24",
    description: "Grocery Shopping at SuperMart",
    category: "Food",
    amount: -55.75,
    account: "Checking Account",
  },
  {
    id: 2,
    date: "2024-07-23",
    description: "Salary Deposit",
    category: "Income",
    amount: 2500.0,
    account: "Checking Account",
  },
  {
    id: 3,
    date: "2024-07-22",
    description: "Online Subscription - Netflix",
    category: "Entertainment",
    amount: -15.99,
    account: "Credit Card",
  },
  {
    id: 4,
    date: "2024-07-21",
    description: "ATM Withdrawal",
    category: "Cash",
    amount: -100.0,
    account: "Checking Account",
  },
];

export const budgetCategories = [
  { id: 1, name: "Groceries", spent: 210, limit: 300 },
  { id: 2, name: "Dining Out", spent: 170, limit: 200 },
  { id: 3, name: "Utilities", spent: 75, limit: 150 },
  { id: 4, name: "Transportation", spent: 45, limit: 150 },
  { id: 5, name: "Entertainment", spent: 90, limit: 150 },
];

export const balances = [
  { id: 1, name: "Alinma Credit Card", amount: 25000 },
  { id: 2, name: "SNB Debit Card", amount: 2000 },
  { id: 3, name: "Cash", amount: 5000 },
];

export const profileData = {
  fullName: "Khaled Ibraheem",
  email: "khaledIbraheem@example.com",
  phone: "5551234567",
  address: "123 Main St, Anytown",
  gender: "Male",
  dob: "",
  occupation: "Software Engineer",
  allowNotifications: true,
  smsAlerts: false,
  twoFactorEnabled: false,
};