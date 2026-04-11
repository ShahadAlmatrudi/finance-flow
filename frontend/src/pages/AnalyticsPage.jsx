import { useMemo, useState } from "react";
import {
  summaryData,
  transactions,
  budgetCategories,
  budgetGoals,
} from "../data/mockData";

export default function AnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  const categories = ["All", ...new Set(transactions.map((t) => t.category))];

  const barColors = ["red-bar", "orange-bar", "yellow-bar", "green-bar", "blue-bar"];

  const monthlySpending = [
    { id: 1, month: "Jan", amount: "$300", heightClass: "short" },
    { id: 2, month: "Feb", amount: "$450", heightClass: "medium" },
    { id: 3, month: "Mar", amount: "$380", heightClass: "medium-short" },
    { id: 4, month: "Apr", amount: "$520", heightClass: "tall" },
    { id: 5, month: "May", amount: "$390", heightClass: "medium-short" },
    { id: 6, month: "Jun", amount: "$460", heightClass: "medium" },
  ];

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (categoryFilter !== "All") {
      result = result.filter(
        (transaction) => transaction.category === categoryFilter
      );
    }

    if (searchTerm.trim()) {
      result = result.filter((transaction) =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date) - new Date(a.date);
      }
      return new Date(a.date) - new Date(b.date);
    });

    return result;
  }, [searchTerm, categoryFilter, sortOrder]);

  const getCategoryClass = (category) => {
    switch (category) {
      case "Food":
        return "category-pill food-pill";
      case "Income":
        return "category-pill income-pill";
      case "Entertainment":
        return "category-pill entertainment-pill";
      case "Cash":
        return "category-pill cash-pill";
      default:
        return "category-pill";
    }
  };

  return (
    <main className="page-content">
      <h1 className="page-title">Analytics Overview</h1>

      <section className="summary-grid">
        <div className="card summary-card">
          <h3>Total Spending</h3>
          <p className="summary-value blue-text">
            ${summaryData.totalSpending.toFixed(2)}
          </p>
          <span className="summary-label">Last 30 days</span>
        </div>

        <div className="card summary-card">
          <h3>Total Income</h3>
          <p className="summary-value green-text">
            ${summaryData.totalIncome.toFixed(2)}
          </p>
          <span className="summary-label">Last 30 days</span>
        </div>

        <div className="card summary-card">
          <h3>Net Savings</h3>
          <p className="summary-value purple-text">
            ${summaryData.netSavings.toFixed(2)}
          </p>
          <span className="summary-label">Last 30 days</span>
        </div>
      </section>

      <section className="chart-grid">
        <div className="card chart-card">
          <h3>Spending by Category</h3>

          <div className="pie-chart-wrapper">
            <div className="fake-pie-chart"></div>
          </div>
        </div>

        <div className="card chart-card">
          <h3>Monthly Spending Comparison (Last 6 months)</h3>

          <div className="bar-chart-wrapper">
            {monthlySpending.map((item) => (
              <div key={item.id} className="bar-item">
                <div className={`bar-column ${item.heightClass}`}></div>
                <span>{item.month}</span>
                <small>{item.amount}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card goals-card">
        <h3>Budget Goals</h3>

        <div className="goal-list-compact">
          {budgetGoals.map((goal) => (
            <div key={goal.id} className="goal-item-compact">
              <div className="goal-title">{goal.title}</div>

              <div className="goal-progress-wrap">
                <div className="goal-track">
                  <div
                    className={`goal-fill ${goal.color}`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <span className="goal-percent">{goal.progress}% complete</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card goals-card">
        <h3>Budget Categories</h3>

        <div className="budget-category-list">
          {budgetCategories.map((item, index) => {
            const percentage = Math.min((item.spent / item.limit) * 100, 100);

            return (
              <div key={item.id} className="budget-category-item">
                <div className="budget-category-header">
                  <span>{item.name}</span>
                  <span>
                    ${item.spent} / ${item.limit}
                  </span>
                </div>

                <div className="budget-category-track">
                  <div
                    className={`budget-category-fill ${barColors[index % barColors.length]}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card table-card">
        <div className="table-header">
          <h3>All Transactions</h3>

          <div className="table-controls">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Date (Newest)</option>
              <option value="oldest">Date (Oldest)</option>
            </select>

            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Account</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.description}</td>
                    <td>
                      <span className={getCategoryClass(transaction.category)}>
                        {transaction.category}
                      </span>
                    </td>
                    <td
                      className={
                        transaction.amount < 0 ? "amount-negative" : "amount-positive"
                      }
                    >
                      {transaction.amount < 0 ? "-" : "+"}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </td>
                    <td>{transaction.account}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No transactions available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}