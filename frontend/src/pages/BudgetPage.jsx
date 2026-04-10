function VisaBadge() {
  return (
    <svg width="24" height="14" viewBox="0 0 24 14" aria-hidden="true">
      <rect width="24" height="14" rx="2" fill="#18B53D" />
      <text
        x="12"
        y="9.5"
        textAnchor="middle"
        fontSize="5.2"
        fontWeight="800"
        fill="#ffffff"
        fontFamily="Nunito, sans-serif"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardBadge() {
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
      <rect width="22" height="14" rx="2" fill="#4E90F0" />
      <circle cx="8" cy="6" r="3.1" fill="#ffffff" />
      <circle cx="11.5" cy="6" r="3.1" fill="#dbeafe" />
      <text
        x="11"
        y="12"
        textAnchor="middle"
        fontSize="3.2"
        fontWeight="700"
        fill="#ffffff"
        fontFamily="Nunito, sans-serif"
      >
        mastercard
      </text>
    </svg>
  );
}

function CashBadge() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
      <rect width="20" height="14" rx="2" fill="#A855F7" />
      <rect x="3" y="3" width="9" height="1.8" rx="1" fill="#ffffff" />
      <circle cx="15.5" cy="8" r="1.8" fill="#ffffff" />
    </svg>
  );
}

export default function BudgetPage() {
  const statusItems = [
    { label: "Spending Limit", value: "$5000", percent: 48, color: "blue-bar" },
    { label: "Saving Target", value: "$100,000", percent: 82, color: "pink-bar" },
    { label: "personal Expenses", value: "$2000", percent: 46, color: "purple-bar" },
    { label: "Debt Progress", value: "$500,000", percent: 68, color: "navy-bar" },
  ];

  const categoryItems = [
    { id: 1, name: "Groceries", spent: 375, limit: 500, color: "green-bar", width: "62%" },
    { id: 2, name: "Utilities", spent: 180, limit: 300, color: "yellow-bar", width: "42%" },
    { id: 3, name: "Entertainment", spent: 100, limit: 250, color: "purple-bar", width: "28%" },
    { id: 4, name: "Transportation", spent: 255, limit: 300, color: "red-bar", width: "50%" },
    { id: 5, name: "Dining Out", spent: 270, limit: 300, color: "orange-bar", width: "52%" },
    { id: 6, name: "Shopping", spent: 125, limit: 250, color: "light-blue-bar", width: "32%" },
  ];

  const accountRows = [
    { id: 1, name: "Alinma", subtitle: "Credit Card", amount: "$25,000", icon: "visa" },
    { id: 2, name: "SNB", subtitle: "Debt Card", amount: "$2,000", icon: "mastercard" },
    { id: 3, name: "Cash", subtitle: "Last Update - Oct 24, 2023", amount: "$5,000", icon: "cash" },
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
                  <span className="status-label">{item.label}</span>

                  <div className="status-bar-wrap">
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${item.color}`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <span className="status-value">{item.value}</span>
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

                        <div className="account-icon-fixed">
                          {item.icon === "visa" && <VisaBadge />}
                          {item.icon === "mastercard" && <MastercardBadge />}
                          {item.icon === "cash" && <CashBadge />}
                        </div>
                      </div>

                      <div className="account-subtitle">{item.subtitle}</div>
                    </div>

                    <div className="account-amount">{item.amount}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="account-actions">
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

                <div className="category-track">
                  <div
                    className={`category-fill ${item.color}`}
                    style={{ width: item.width }}
                  />
                </div>

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