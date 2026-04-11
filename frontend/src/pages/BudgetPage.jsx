import { useState } from "react";

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
  const DEFAULT_LIMIT = 500;

  const initialStatusItems = [
    { id: 1, label: "Spending Limit", value: 5000, percent: 48, color: "blue-bar" },
    { id: 2, label: "Saving Target", value: 100000, percent: 82, color: "pink-bar" },
    { id: 3, label: "personal Expenses", value: 2000, percent: 46, color: "purple-bar" },
    { id: 4, label: "Debt Progress", value: 500000, percent: 68, color: "navy-bar" },
  ];

  const initialCategoryItems = [
    { id: 1, name: "Groceries", spent: 375, limit: 500, color: "green-bar", defaultLimit: 500 },
    { id: 2, name: "Utilities", spent: 180, limit: 300, color: "yellow-bar", defaultLimit: 500 },
    { id: 3, name: "Entertainment", spent: 100, limit: 250, color: "purple-bar", defaultLimit: 500 },
    { id: 4, name: "Transportation", spent: 255, limit: 300, color: "red-bar", defaultLimit: 500 },
    { id: 5, name: "Dining Out", spent: 270, limit: 300, color: "orange-bar", defaultLimit: 500 },
    { id: 6, name: "Shopping", spent: 125, limit: 250, color: "light-blue-bar", defaultLimit: 500 },
  ];

  const [statusItems, setStatusItems] = useState(initialStatusItems);
  const [categoryItems, setCategoryItems] = useState(initialCategoryItems);

  const accountRows = [
    { id: 1, name: "Alinma", subtitle: "Credit Card", amount: "$25,000", icon: "visa" },
    { id: 2, name: "SNB", subtitle: "Debt Card", amount: "$2,000", icon: "mastercard" },
    { id: 3, name: "Cash", subtitle: "Last Update - Oct 24, 2023", amount: "$5,000", icon: "cash" },
  ];

  const colorOptions = [
    "green-bar",
    "yellow-bar",
    "purple-bar",
    "red-bar",
    "orange-bar",
    "light-blue-bar",
  ];

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    id: null,
    name: "",
    spent: "",
    limit: "",
    color: "light-blue-bar",
  });

  const [showResetModal, setShowResetModal] = useState(false);

  const formatMoney = (amount) => `$${Number(amount).toLocaleString()}`;

  const openResetModal = () => {
    setShowResetModal(true);
  };

  const closeResetModal = () => {
    setShowResetModal(false);
  };

  const handleConfirmReset = () => {
    setStatusItems((prev) =>
      prev.map((item) => ({
        ...item,
        value: 0,
        percent: 0,
      }))
    );

    setCategoryItems((prev) =>
      prev.map((item) => ({
        ...item,
        spent: 0,
        limit: DEFAULT_LIMIT,
        defaultLimit: DEFAULT_LIMIT,
      }))
    );

    setShowResetModal(false);
  };

  const openEditModal = (item) => {
    setIsAddMode(false);
    setCategoryForm({
      id: item.id,
      name: item.name,
      spent: String(item.spent),
      limit: String(item.limit),
      color: item.color,
    });
    setShowCategoryModal(true);
  };

  const openAddModal = () => {
    const nextColor = colorOptions[categoryItems.length % colorOptions.length];
    setIsAddMode(true);
    setCategoryForm({
      id: null,
      name: "",
      spent: "",
      limit: String(DEFAULT_LIMIT),
      color: nextColor,
    });
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setCategoryForm({
      id: null,
      name: "",
      spent: "",
      limit: "",
      color: "light-blue-bar",
    });
  };

  const handleCategoryFormChange = (field, value) => {
    setCategoryForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveCategory = () => {
    const trimmedName = categoryForm.name.trim();
    const spentNumber = Number(categoryForm.spent);
    const limitNumber = Number(categoryForm.limit);

    if (
      !trimmedName ||
      Number.isNaN(spentNumber) ||
      Number.isNaN(limitNumber) ||
      limitNumber <= 0
    ) {
      return;
    }

    if (isAddMode) {
      const newItem = {
        id: Date.now(),
        name: trimmedName,
        spent: spentNumber,
        limit: limitNumber,
        color: categoryForm.color,
        defaultLimit: DEFAULT_LIMIT,
      };

      setCategoryItems((prev) => [...prev, newItem]);
    } else {
      setCategoryItems((prev) =>
        prev.map((item) =>
          item.id === categoryForm.id
            ? {
                ...item,
                name: trimmedName,
                spent: spentNumber,
                limit: limitNumber,
                defaultLimit: DEFAULT_LIMIT,
              }
            : item
        )
      );
    }

    closeCategoryModal();
  };

  return (
    <main className="page-content budget-page">
      <h1 className="page-title">Budget Overview</h1>

      <section className="budget-wireframe-layout">
        <div className="budget-left-column">
          <div className="card budget-status-card">
            <div className="budget-card-header">
              <h3>Budget Status Overview</h3>
              <button
                className="primary-small-btn reset-btn"
                type="button"
                onClick={openResetModal}
              >
                Rest Limits
              </button>
            </div>

            <div className="status-list">
              {statusItems.map((item) => (
                <div key={item.id} className="status-item">
                  <span className="status-label">{item.label}</span>

                  <div className="status-bar-wrap">
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${item.color}`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <span className="status-value">{formatMoney(item.value)}</span>
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
              <button className="primary-small-btn update-btn" type="button">
                Update
              </button>
            </div>
          </div>
        </div>

        <div className="card budget-category-card">
          <h3 className="budget-section-title">Category-wise Spending</h3>

          <div className="category-list">
            {categoryItems.map((item) => {
              const spentValue = Number(item.spent) || 0;
              const limitValue = Number(item.limit) || 0;
              const percent =
                limitValue > 0 ? Math.min((spentValue / limitValue) * 100, 100) : 0;

              return (
                <div key={item.id} className="category-row">
                  <span className="category-name">{item.name}</span>

                  <div className="category-track">
                    <div
                      className={`category-fill ${item.color}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="category-amount">
                    ${spentValue} spent of ${limitValue}
                  </span>

                  <button
                    className="edit-btn"
                    type="button"
                    onClick={() => openEditModal(item)}
                  >
                    Edit
                  </button>
                </div>
              );
            })}
          </div>

          <button
            className="primary-full-btn"
            type="button"
            onClick={openAddModal}
          >
            Add New Category
          </button>
        </div>
      </section>

      {showCategoryModal && (
        <div className="budget-modal-overlay">
          <div className="budget-modal-card">
            <h3 className="budget-modal-title">
              {isAddMode ? "Add New Category" : "Edit Category"}
            </h3>

            <div className="budget-modal-field">
              <label>Category Name</label>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) => handleCategoryFormChange("name", e.target.value)}
                placeholder="Enter category name"
              />
            </div>

            <div className="budget-modal-field">
              <label>Amount Spent</label>
              <input
                type="number"
                value={categoryForm.spent}
                onChange={(e) => handleCategoryFormChange("spent", e.target.value)}
                placeholder="Enter spent amount"
              />
            </div>

            <div className="budget-modal-field">
              <label>Limit Amount</label>
              <input
                type="number"
                value={categoryForm.limit}
                onChange={(e) => handleCategoryFormChange("limit", e.target.value)}
                placeholder="Enter limit amount"
              />
            </div>

            <div className="budget-modal-actions">
              <button
                type="button"
                className="budget-modal-save"
                onClick={handleSaveCategory}
              >
                Save
              </button>
              <button
                type="button"
                className="budget-modal-cancel"
                onClick={closeCategoryModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetModal && (
        <div className="budget-modal-overlay">
          <div className="budget-modal-card">
            <h3 className="budget-modal-title">Reset Budget</h3>

            <p className="budget-reset-message">
              Are you sure you want to reset all budget data and start recording
              from the beginning? This will clear current spending and restore
              default limits.
            </p>

            <div className="budget-modal-actions">
              <button
                type="button"
                className="budget-modal-save"
                onClick={handleConfirmReset}
              >
                Yes
              </button>
              <button
                type="button"
                className="budget-modal-cancel"
                onClick={closeResetModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}