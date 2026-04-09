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

export const budgetGoals = [
  { id: 1, title: "Save $500 for vacation", progress: 60, color: "green-bar" },
  { id: 2, title: "Invest $200 monthly", progress: 80, color: "blue-bar" },
  { id: 3, title: "Pay off credit card debt", progress: 40, color: "purple-bar" },
];

export const dashboardCards = [
  {
    id: 1,
    title: "Cash",
    subtitle: "last updated",
    balanceLabel: "Available Balance:",
    amount: 12500.75,
    iconType: "cash",
  },
  {
    id: 2,
    title: "Credit Card",
    subtitle: "Account Number: **** 5678",
    balanceLabel: "Available Balance:",
    amount: 25320.1,
    iconType: "card",
  },
  {
    id: 3,
    title: "Saving Account",
    subtitle: "Card Number: **** 9012",
    balanceLabel: "Current Balance:",
    amount: 1200.5,
    iconType: "saving",
  },
];

export const recentTransactions = [
  {
    id: 1,
    title: "Online Purchase",
    subtitle: "Amazon.com - Oct 26, 2023",
    amount: -45.99,
  },
  {
    id: 2,
    title: "Salary Deposit",
    subtitle: "Employer - Oct 25, 2023",
    amount: 2500.0,
  },
  {
    id: 3,
    title: "Restaurant Bill",
    subtitle: "Local Diner - Oct 24, 2023",
    amount: -32.75,
  },
  {
    id: 4,
    title: "Utility Bill",
    subtitle: "Electricity Company - Oct 23, 2023",
    amount: -85.0,
  },
];

export const monthOverview = [
  { id: 1, label: "Income Received", percent: 58, color: "blue-bar" },
  { id: 2, label: "Saving Progress", percent: 78, color: "green-bar" },
  { id: 3, label: "Expenses Used", percent: 44, color: "red-bar" },
  { id: 4, label: "Remaining Budget", percent: 67, color: "yellow-bar" },
];