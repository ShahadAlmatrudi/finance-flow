import { useEffect, useState } from "react";
import { getAppData, saveAppData, setCash } from "../utils/storage";
import { Link } from "react-router-dom";
import logo from "../assets/financeflow-logo.png";

export default function Budget() {
  const [sidebarUserName, setSidebarUserName] = useState("User");
  const [sidebarAvatar, setSidebarAvatar] = useState("U");

  const [plan, setPlan] = useState({});
  const [cards, setCards] = useState([]);
  const [cash, setCashState] = useState(0);
  const [categories, setCategories] = useState([]);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryLimit, setNewCategoryLimit] = useState("");
  const [addCategoryError, setAddCategoryError] = useState("");

  const [updatedCashAmount, setUpdatedCashAmount] = useState("");
  const [cashUpdateError, setCashUpdateError] = useState("");

  useEffect(() => {
    const appData = getAppData();

    if (!appData.user) {
      window.location.href = "/signup";
      return;
    }

    fillSidebarUser();
    initializeBudgetData();
    renderBudgetPage();
  }, []);

  const fillSidebarUser = () => {
    const appData = getAppData();
    const fullName = appData.user?.fullname || "User";

    const initials = fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    setSidebarUserName(fullName);
    setSidebarAvatar(initials || "U");
  };

  const initializeBudgetData = () => {
    const data = getAppData();

    if (data.plan?.categories?.length) {
      let changed = false;

      data.plan.categories = data.plan.categories.map((category) => {
        if (typeof category.spent !== "number") {
          changed = true;
          return {
            ...category,
            spent: 0,
          };
        }

        return category;
      });

      if (changed) {
        saveAppData(data);
      }
    }
  };

  const renderBudgetPage = () => {
    const data = getAppData();
    const currentPlan = data.plan || {};
    const currentCards = data.cards || [];
    const currentCash = Number(data.cash || 0);
    const currentCategories = currentPlan.categories || [];

    setPlan(currentPlan);
    setCards(currentCards);
    setCashState(currentCash);
    setCategories(currentCategories);
  };

  const handleAddCategory = (event) => {
    event.preventDefault();
    setAddCategoryError("");

    const name = newCategoryName.trim();
    const limit = Number(newCategoryLimit);

    if (name === "") {
      setAddCategoryError("Category name is required.");
      return;
    }

    if (!newCategoryLimit || limit <= 0) {
      setAddCategoryError("Enter a valid category limit.");
      return;
    }

    const data = getAppData();

    if (!data.plan) {
      data.plan = {};
    }

    if (!Array.isArray(data.plan.categories)) {
      data.plan.categories = [];
    }

    const exists = data.plan.categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      setAddCategoryError("This category already exists.");
      return;
    }

    data.plan.categories.push({
      name,
      limit,
      spent: 0,
    });

    saveAppData(data);
    setNewCategoryName("");
    setNewCategoryLimit("");
    renderBudgetPage();
  };

  const handleCashUpdate = (event) => {
    event.preventDefault();
    setCashUpdateError("");

    const newCash = Number(updatedCashAmount);

    if (updatedCashAmount === "" || newCash < 0) {
      setCashUpdateError("Enter a valid cash amount.");
      return;
    }

    setCash(newCash);
    setUpdatedCashAmount("");
    renderBudgetPage();
  };

  const handleResetUsage = () => {
    const data = getAppData();

    if (data.plan?.categories?.length) {
      data.plan.categories = data.plan.categories.map((category) => ({
        ...category,
        spent: 0,
      }));

      saveAppData(data);
      renderBudgetPage();
    }
  };

  const handleEditCategory = (index) => {
    const data = getAppData();
    const category = data.plan.categories[index];

    const newLimit = window.prompt(
      `Enter new limit for ${category.name}:`,
      category.limit
    );

    if (newLimit === null) return;

    const numericLimit = Number(newLimit);

    if (!newLimit || numericLimit <= 0) {
      window.alert("Please enter a valid limit greater than 0.");
      return;
    }

    data.plan.categories[index].limit = numericLimit;

    if (data.plan.categories[index].spent > numericLimit) {
      data.plan.categories[index].spent = numericLimit;
    }

    saveAppData(data);
    renderBudgetPage();
  };

  const handleDeleteCategory = (index) => {
    const data = getAppData();
    const categoryName = data.plan.categories[index].name;

    const confirmed = window.confirm(`Delete category "${categoryName}"?`);

    if (!confirmed) return;

    data.plan.categories.splice(index, 1);
    saveAppData(data);
    renderBudgetPage();
  };

  const handleLogout = () => {
    const shouldLogout = window.confirm("Are you sure you want to log out?");

    if (shouldLogout) {
      localStorage.removeItem("financeFlowData");
      window.location.href = "/signup";
    }
  };

  const formatMoney = (amount) => {
    return `$${Number(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const savingAmount = Number(plan.monthlySaving || 0);
  const targetAmount = Number(plan.targetAmount || 0);

  const savingWidth =
    targetAmount > 0
      ? Math.min((savingAmount / targetAmount) * 100, 100)
      : savingAmount > 0
      ? 100
      : 0;

  const cashWidth = Math.min((cash / 5000) * 100, 100);
  const cardsWidth = Math.min(cards.length * 25, 100);
  const categoriesWidth = Math.min(categories.length * 18, 100);

  return (
    <div className="appPageBody">
      <div className="appLayout">
        <aside className="sidebar">
          <div className="sidebarBrand">
            <Link to="/dashboard" className="sidebarLogo">
              <img src={logo} alt="FinanceFlow" className="sidebarLogoImg" />
              <span>FinanceFlow</span>
            </Link>
          </div>

          <nav className="sidebarNav">
            <Link to="/dashboard" className="navItem">
              Dashboard
            </Link>
            <Link to="/transactions" className="navItem">
              Transactions
            </Link>
            <Link to="/budget" className="navItem active">
              Budget
            </Link>
            <Link to="/analytics" className="navItem">
              Analytics
            </Link>
            <Link to="/cards" className="navItem">
              Cards
            </Link>
            <Link to="/notifications" className="navItem">
              Notifications
            </Link>
            <Link to="/plans" className="navItem">
              Plans
            </Link>
            <Link to="/profile-view" className="navItem">
              Account Settings
            </Link>
          </nav>

          <div className="sidebarUser">
            <div className="sidebarAvatar">{sidebarAvatar}</div>
            <div className="sidebarUserText">
              <p className="sidebarUserName">{sidebarUserName}</p>
              <button
                className="sidebarLogoutBtn"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        <main className="mainContent">
          <header className="topBar">
            <div>
              <h1 className="pageHeading">Budget Overview</h1>
              <p className="pageSubheading">
                Manage your categories, limits, cash, and saved cards.
              </p>
            </div>
          </header>

          <section className="budgetTopGrid">
            <article className="dashboardPanel budgetStatusPanel">
              <div className="panelHeader">
                <h2>Budget Status Overview</h2>
                <button
                  type="button"
                  className="secondaryBtn smallBtn"
                  onClick={handleResetUsage}
                >
                  Reset Demo Usage
                </button>
              </div>

              <div className="budgetStatusList">
                <div className="statusRow">
                  <div className="statusLabelRow">
                    <span>Saving Target</span>
                    <span>{formatMoney(savingAmount)}</span>
                  </div>
                  <div className="progressTrack">
                    <div
                      className="progressFill progressBlue"
                      style={{ width: `${savingWidth}%` }}
                    ></div>
                  </div>
                </div>

                <div className="statusRow">
                  <div className="statusLabelRow">
                    <span>Cash Balance</span>
                    <span>{formatMoney(cash)}</span>
                  </div>
                  <div className="progressTrack">
                    <div
                      className="progressFill progressGreen"
                      style={{ width: `${cashWidth}%` }}
                    ></div>
                  </div>
                </div>

                <div className="statusRow">
                  <div className="statusLabelRow">
                    <span>Cards Added</span>
                    <span>
                      {cards.length} card{cards.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="progressTrack">
                    <div
                      className="progressFill progressPurple"
                      style={{ width: `${cardsWidth}%` }}
                    ></div>
                  </div>
                </div>

                <div className="statusRow">
                  <div className="statusLabelRow">
                    <span>Budget Categories</span>
                    <span>
                      {categories.length} categor
                      {categories.length === 1 ? "y" : "ies"}
                    </span>
                  </div>
                  <div className="progressTrack">
                    <div
                      className="progressFill progressOrange"
                      style={{ width: `${categoriesWidth}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </article>

            <article className="dashboardPanel categoryManagePanel">
              <div className="panelHeader">
                <h2>Category-wise Spending</h2>
              </div>

              <div className="categoryManagerList">
                {!categories.length ? (
                  <div className="emptyPanelState">
                    No categories added yet. Add your first category below.
                  </div>
                ) : (
                  categories.map((category, index) => {
                    const spent = Number(category.spent || 0);
                    const limit = Number(category.limit || 0);
                    const percent =
                      limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

                    return (
                      <div className="categoryManagerItem" key={index}>
                        <div className="categoryManagerTop">
                          <div>
                            <h3>{category.name}</h3>
                            <p>
                              {formatMoney(spent)} spent of {formatMoney(limit)}
                            </p>
                          </div>

                          <div className="categoryManagerActions">
                            <button
                              type="button"
                              className="secondaryBtn smallBtn"
                              onClick={() => handleEditCategory(index)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="dangerGhostBtn smallBtn"
                              onClick={() => handleDeleteCategory(index)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="categoryBar">
                          <div
                            className="categoryBarFill"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>

                        <div className="categoryManagerBottom">
                          <span>{Math.round(percent)}% used</span>
                          <span>{formatMoney(limit - spent)} left</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleAddCategory} className="addCategoryForm">
                <div className="addCategoryGrid">
                  <input
                    type="text"
                    placeholder="New category name"
                    value={newCategoryName}
                    onChange={(e) => {
                      setNewCategoryName(e.target.value);
                      setAddCategoryError("");
                    }}
                    className={addCategoryError ? "inputError" : ""}
                  />
                  <input
                    type="number"
                    placeholder="Monthly limit"
                    value={newCategoryLimit}
                    onChange={(e) => {
                      setNewCategoryLimit(e.target.value);
                      setAddCategoryError("");
                    }}
                    className={addCategoryError ? "inputError" : ""}
                  />
                  <button type="submit" className="primaryBtn smallBtn">
                    Add New Category
                  </button>
                </div>
                <small className="errorMsg">{addCategoryError}</small>
              </form>
            </article>
          </section>

          <section className="budgetBottomGrid">
            <article className="dashboardPanel accountBalancePanel">
              <div className="panelHeader">
                <h2>Accounts & Balances</h2>
              </div>

              <div className="accountBalanceList">
                {!cards.length && cash === 0 ? (
                  <div className="emptyPanelState">
                    No cash or cards saved yet.
                  </div>
                ) : (
                  <>
                    {cards.map((card) => (
                      <div className="accountRow" key={card.id}>
                        <div className="accountLeft">
                          <div className="accountIcon">💳</div>
                          <div>
                            <h4>{card.name}</h4>
                            <p>
                              {card.type} •••• {card.number.slice(-4)}{" "}
                              {card.primary ? "• Primary" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="accountAmount">
                          {formatMoney(card.balance || 0)}
                        </div>
                      </div>
                    ))}

                    <div className="accountRow">
                      <div className="accountLeft">
                        <div className="accountIcon">💵</div>
                        <div>
                          <h4>Cash</h4>
                          <p>Available balance</p>
                        </div>
                      </div>
                      <div className="accountAmount">{formatMoney(cash)}</div>
                    </div>
                  </>
                )}
              </div>

              <form onSubmit={handleCashUpdate} className="cashUpdateForm">
                <div className="cashUpdateRow">
                  <input
                    type="number"
                    placeholder="Enter new cash amount"
                    value={updatedCashAmount}
                    onChange={(e) => {
                      setUpdatedCashAmount(e.target.value);
                      setCashUpdateError("");
                    }}
                    className={cashUpdateError ? "inputError" : ""}
                  />
                  <button type="submit" className="primaryBtn smallBtn">
                    Update Cash
                  </button>
                </div>
                <small className="errorMsg">{cashUpdateError}</small>
              </form>
            </article>

            <article className="dashboardPanel budgetGoalPanel">
              <div className="panelHeader">
                <h2>Current Goal</h2>
              </div>

              <div className="goalBox">
                <p className="goalType">{plan.goalType || "No goal type"}</p>
                <h3 className="goalName">{plan.goalName || "No goal set yet"}</h3>
                <p className="goalMeta">
                  Target amount: {formatMoney(plan.targetAmount || 0)}
                </p>
                <p className="goalMeta">
                  Target date: {plan.targetDate ? formatDate(plan.targetDate) : "--"}
                </p>
                <p className="goalMeta">
                  Monthly saving: {formatMoney(plan.monthlySaving || 0)}
                </p>
              </div>

              <div className="budgetGoalActions">
                <a href="/plan-setup" className="primaryBtn smallBtn">
                  Edit Goal
                </a>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}