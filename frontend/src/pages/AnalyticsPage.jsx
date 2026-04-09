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
          <div className="chart-placeholder">Pie Chart Placeholder</div>
        </div>

        <div className="card chart-card">
          <h3>Monthly Spending Comparison</h3>
          <div className="chart-placeholder">Bar Chart Placeholder</div>
        </div>
      </section>

      <section className="card goals-card">
        <h3>Budget Goals</h3>

        <div className="goal-list">
          {budgetGoals.map((goal) => (
            <div key={goal.id} className="goal-item">
              <div className="goal-row">
                <span>{goal.title}</span>
                <span>{goal.progress}% complete</span>
              </div>

              <div className="progress-bar small-progress">
                <div
                  className={`progress-fill ${goal.color}`}
                  style={{ width: `${goal.progress}%` }}
                ></div>
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

                <div className="progress-bar">
                  <div
                    className={`progress-fill ${barColors[index % barColors.length]}`}
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