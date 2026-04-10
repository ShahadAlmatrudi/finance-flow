export default function BudgetPage() {
  const statusItems = [
    { label: "Spending Limit", value: "$5000", percent: 48, color: "blue-bar" },
    { label: "Saving Target", value: "$100,000", percent: 82, color: "pink-bar" },
    { label: "personal Expenses", value: "$2000", percent: 46, color: "purple-bar" },
    { label: "Debt Progress", value: "$500,000", percent: 68, color: "navy-bar" },
  ];

  const categoryItems = [
    { id: 1, name: "Groceries", spent: 375, limit: 500, color: "green-bar" },
    { id: 2, name: "Utilities", spent: 180, limit: 300, color: "yellow-bar" },
    { id: 3, name: "Entertainment", spent: 100, limit: 250, color: "purple-bar" },
    { id: 4, name: "Transportation", spent: 255, limit: 300, color: "red-bar" },
    { id: 5, name: "Dining Out", spent: 270, limit: 300, color: "orange-bar" },
    { id: 6, name: "Shopping", spent: 125, limit: 250, color: "light-blue-bar" },
  ];

  const accountRows = [
    {
      id: 1,
      name: "Alinma",
      subtitle: "Credit Card",
      amount: "$25,000",
      icon: "visa",
    },
    {
      id: 2,
      name: "SNB",
      subtitle: "Debt Card",
      amount: "$2,000",
      icon: "mastercard",
    },
    {
      id: 3,
      name: "Cash",
      subtitle: "Last Update - Oct 24, 2023",
      amount: "$5,000",
      icon: "cash",
    },
  ];

  return (
    <main className="page-content budget-page">
      <h1 className="page-title">Budget Overview</h1>

      <section className="budget-wireframe-layout">
        <div className="budget-left-column">
          <div className="card budget-status-card">
            <div className="budget-card-header">
              <h3>Budget Status Overview</h3>
              <button className="primary-small-btn reset-btn">Rest Limits</button>
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
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card accounts-card">
            <div className="account-list">
              {accountRows.map((item) => (
                <div key={item.id} className="account-item">
                  <div className="account-main">
                    <div className="account-name-wrap">
                      <div className="account-top-line">
                        <span className="account-name">{item.name}</span>

                        {item.icon === "visa" && (
                          <span className="account-badge visa-badge">VISA</span>
                        )}

                        {item.icon === "mastercard" && (
                          <span className="account-badge mc-badge">
                            <span className="mc-circle left"></span>
                            <span className="mc-circle right"></span>
                          </span>
                        )}

                        {item.icon === "cash" && (
                          <span className="account-badge cash-badge">
                            <span className="cash-dot"></span>
                          </span>
                        )}
                      </div>

                      <div className="account-subtitle">{item.subtitle}</div>
                    </div>

                    <div className="account-amount">{item.amount}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="account-actions">
              <input type="text" className="balance-input" placeholder="Button" />
              <button className="primary-small-btn update-btn">Update</button>
            </div>
          </div>
        </div>

        <div className="card budget-category-card">
          <h3 className="budget-section-title">Category-wise Spending</h3>

          <div className="category-list">
            {categoryItems.map((item) => (
              <div key={item.id} className="category-row">
                <span className="category-name">{item.name}</span>
                <span className={`category-dot ${item.color}`}></span>
                <span className="category-amount">
                  ${item.spent} spent of ${item.limit}
                </span>
                <button className="edit-btn">Edit</button>
              </div>
            ))}
          </div>

          <button className="primary-full-btn">Add New Category</button>
        </div>
      </section>
    </main>
  );
}