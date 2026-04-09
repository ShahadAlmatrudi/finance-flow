import { budgetCategories, balances } from "../data/mockData";

export default function BudgetPage() {
  const statusItems = [
    { label: "Spending Limit", value: "$5000", percent: 55, color: "blue-bar" },
    { label: "Saving Target", value: "$100,000", percent: 75, color: "pink-bar" },
    { label: "Personal Expenses", value: "$2000", percent: 40, color: "purple-bar" },
    { label: "Debt Progress", value: "$500,000", percent: 62, color: "navy-bar" },
  ];

  const categoryColors = [
    "green-bar",
    "yellow-bar",
    "purple-bar",
    "red-bar",
    "orange-bar",
    "blue-bar",
  ];

  return (
    <main className="page-content">
      <h1 className="page-title">Budget Overview</h1>

      <section className="budget-grid">
        <div className="card">
          <div className="budget-card-header">
            <h3>Budget Status Overview</h3>
            <button className="primary-small-btn">Reset Limits</button>
          </div>

          <div className="status-list">
            {statusItems.map((item) => (
              <div key={item.label} className="status-item">
                <div className="status-row">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>

                <div className="progress-bar">
                  <div
                    className={`progress-fill ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="budget-section-title">Category-wise Spending</h3>

          <div className="budget-category-list">
            {budgetCategories.map((item, index) => (
              <div key={item.id} className="budget-edit-item">
                <div className="budget-edit-left">
                  <span
                    className={`budget-dot ${
                      categoryColors[index % categoryColors.length]
                    }`}
                  ></span>

                  <span className="budget-edit-name">{item.name}</span>
                </div>

                <div className="budget-edit-middle">
                  ${item.spent} spent of ${item.limit}
                </div>

                <button className="edit-btn">Edit</button>
              </div>
            ))}
          </div>

          <button className="primary-full-btn">Add New Category</button>
        </div>
      </section>

      <section className="budget-bottom-row">
        <div className="card accounts-card">
          <div className="account-list">
            {balances.map((item) => (
              <div key={item.id} className="account-item">
                <div className="account-left">
                  <p className="account-name">{item.name}</p>
                  <p className="account-subtitle">
                    {item.name === "Cash" ? "Last Update - Oct 24, 2023" : "Account"}
                  </p>
                </div>

                <div className="account-right">${item.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="account-actions">
            <input
              type="text"
              className="balance-input"
              placeholder="Enter amount"
            />
            <button className="primary-small-btn">Update</button>
          </div>
        </div>
      </section>
    </main>
  );
}