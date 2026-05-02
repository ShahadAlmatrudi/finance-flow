import { useEffect, useState } from "react";
<<<<<<< HEAD
import { getAppData, setCash } from "../utils/storage";
=======
import { getAppData, saveAppData, setCash } from "../utils/storage";
<<<<<<< HEAD
=======
>>>>>>> ola-student2-backend
import { apiFetch } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/financeflow-logo.png";
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67

export default function Budget() {
  const navigate = useNavigate();

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

<<<<<<< HEAD
  const formatMoney = (amount) => `$${Number(amount || 0).toLocaleString()}`;

=======
<<<<<<< HEAD
=======
>>>>>>> ola-student2-backend
  const loadFromAPI = async () => {
    try {
      const data = await apiFetch("/api/budget");
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Could not load budget from server:", err.message);

      const local = getAppData();
      setCategories(local.plan?.categories || []);
    }
  };

>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
  useEffect(() => {
    const appData = getAppData();

    if (!appData.user) {
      navigate("/signup");
      return;
    }

<<<<<<< HEAD
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
=======
    const fullName = appData.user?.fullname || "User";
    const initials = fullName
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    setSidebarUserName(fullName);
    setSidebarAvatar(initials || "U");

    setPlan(appData.plan || {});
    setCards(appData.cards || []);
    setCashState(Number(appData.cash || 0));

    loadFromAPI();
  }, [navigate]);

  const handleAddCategory = async (event) => {
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
    event.preventDefault();
    setAddCategoryError("");

    const name = newCategoryName.trim();
    const limit = Number(newCategoryLimit);

<<<<<<< HEAD
    if (!name) {
=======
<<<<<<< HEAD
    if (name === "") {
>>>>>>> ola-student2-backend
      setAddCategoryError("Category name is required.");
      return;
    }

    if (!newCategoryLimit || limit <= 0) {
      setAddCategoryError("Enter a valid category limit.");
      return;
    }
<<<<<<< HEAD
=======

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
=======
    if (!name) { setAddCategoryError("Category name is required."); return; }
    if (!newCategoryLimit || limit <= 0) { setAddCategoryError("Enter a valid category limit."); return; }
>>>>>>> ola-student2-backend

    try {
      await apiFetch("/api/budget/categories", {
        method: "POST",
        body: JSON.stringify({ name, limit }),
      });

      setNewCategoryName("");
      setNewCategoryLimit("");
      await loadFromAPI();
    } catch (err) {
      setAddCategoryError(err.message || "Failed to add category.");
    }
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
  };

  const handleCashUpdate = (event) => {
    event.preventDefault();
    setCashUpdateError("");

    const newCash = Number(updatedCashAmount);
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
    if (updatedCashAmount === "" || newCash < 0) {
      setCashUpdateError("Enter a valid cash amount.");
      return;
    }

    setCash(newCash);
    setUpdatedCashAmount("");
<<<<<<< HEAD
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

=======
    setCashState(newCash);
  };

  const handleEditCategory = async (category) => {
    const newLimit = window.prompt(
      `Enter new limit for ${category.name}:`,
      category.limit
    );

    if (newLimit === null) return;

    const numericLimit = Number(newLimit);
<<<<<<< HEAD

=======
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
    if (!newLimit || numericLimit <= 0) {
      window.alert("Please enter a valid limit greater than 0.");
      return;
    }

<<<<<<< HEAD
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
=======
    try {
      await apiFetch(`/api/budget/categories/${category._id}`, {
        method: "PUT",
        body: JSON.stringify({ limit: numericLimit }),
      });

      await loadFromAPI();
    } catch (err) {
      window.alert("Failed to update category: " + err.message);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;

    try {
      await apiFetch(`/api/budget/categories/${category._id}`, {
        method: "DELETE",
      });

      await loadFromAPI();
    } catch (err) {
      window.alert("Failed to delete category: " + err.message);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
      localStorage.removeItem("financeFlowData");
      navigate("/signup");
    }
  };

<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
  const formatMoney = (amount) => `$${Number(amount).toLocaleString()}`;
>>>>>>> ola-student2-backend
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return dateString;
<<<<<<< HEAD

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
=======
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
  };

  const savingAmount = Number(plan.monthlySaving || 0);
  const targetAmount = Number(plan.targetAmount || 0);
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> ola-student2-backend

  const savingWidth =
    targetAmount > 0
      ? Math.min((savingAmount / targetAmount) * 100, 100)
      : savingAmount > 0
      ? 100
      : 0;

<<<<<<< HEAD
=======
=======
  const savingWidth = targetAmount > 0 ? Math.min((savingAmount / targetAmount) * 100, 100) : savingAmount > 0 ? 100 : 0;
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
  const cashWidth = Math.min((cash / 5000) * 100, 100);
  const cardsWidth = Math.min(cards.length * 25, 100);
  const categoriesWidth = Math.min(categories.length * 18, 100);

  return (
    <div className="appPageBody">
      <div className="appLayout">
        <aside className="sidebar">
          <div className="sidebarBrand">
<<<<<<< HEAD
            <a href="/dashboard" className="sidebarLogo">
              💸 FinanceFlow
            </a>
          </div>

          <nav className="sidebarNav">
            <a href="/dashboard" className="navItem">
              Dashboard
            </a>
            <a href="/transactions" className="navItem">
              Transactions
            </a>
            <a href="/budget" className="navItem active">
              Budget
            </a>
            <a href="/analytics" className="navItem">
              Analytics
            </a>
            <a href="/cards" className="navItem">
              Cards
            </a>
            <a href="/notifications" className="navItem">
              Notifications
            </a>
            <a href="/profile-view" className="navItem">
              Account Settings
            </a>
          </nav>

=======
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
<<<<<<< HEAD

=======
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
          <div className="sidebarUser">
            <div className="sidebarAvatar">{sidebarAvatar}</div>
            <div className="sidebarUserText">
              <p className="sidebarUserName">{sidebarUserName}</p>
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> ola-student2-backend
              <button
                className="sidebarLogoutBtn"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
<<<<<<< HEAD
=======
=======
              <button className="sidebarLogoutBtn" type="button" onClick={handleLogout}>Logout</button>
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
            </div>
          </div>
        </aside>

        <main className="mainContent">
          <header className="topBar">
            <div>
              <h1 className="pageHeading">Budget Overview</h1>
<<<<<<< HEAD
              <p className="pageSubheading">
                Manage your categories, limits, cash, and saved cards.
              </p>
=======
<<<<<<< HEAD
              <p className="pageSubheading">
                Manage your categories, limits, cash, and saved cards.
              </p>
=======
              <p className="pageSubheading">Manage your categories, limits, cash, and saved cards.</p>
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
            </div>
          </header>

          <section className="budgetTopGrid">
            <article className="dashboardPanel budgetStatusPanel">
              <div className="panelHeader">
                <h2>Budget Status Overview</h2>
<<<<<<< HEAD
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
=======
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
<<<<<<< HEAD
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
=======
                  <div className="statusLabelRow"><span>Budget Categories</span><span>{categories.length} categor{categories.length === 1 ? "y" : "ies"}</span></div>
                  <div className="progressTrack"><div className="progressFill progressOrange" style={{ width: `${categoriesWidth}%` }}></div></div>
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
                </div>
              </div>
            </article>

            <article className="dashboardPanel categoryManagePanel">
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> ola-student2-backend
              <div className="panelHeader">
                <h2>Category-wise Spending</h2>
              </div>

<<<<<<< HEAD
=======
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

=======
              <div className="panelHeader"><h2>Category-wise Spending</h2></div>
>>>>>>> ola-student2-backend
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
                    const remaining = Math.max(limit - spent, 0);

                    return (
                      <div
                        className="categoryManagerItem"
                        key={category._id || category.name || index}
                      >
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
                              onClick={() => handleEditCategory(category)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="dangerGhostBtn smallBtn"
                              onClick={() => handleDeleteCategory(category)}
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
<<<<<<< HEAD

=======
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
                        <div className="categoryManagerBottom">
                          <span>{Math.round(percent)}% used</span>
                          <span>{formatMoney(remaining)} left</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleAddCategory} className="addCategoryForm">
                <div className="addCategoryGrid">
<<<<<<< HEAD
                  <input
                    type="text"
                    placeholder="New category name"
=======
<<<<<<< HEAD
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
=======
                  <input type="text" placeholder="New category name"
>>>>>>> ola-student2-backend
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
<<<<<<< HEAD
                    onChange={(e) => {
                      setNewCategoryLimit(e.target.value);
                      setAddCategoryError("");
                    }}
                    className={addCategoryError ? "inputError" : ""}
                  />

                  <button type="submit" className="primaryBtn smallBtn">
                    Add New Category
                  </button>
=======
                    onChange={(e) => { setNewCategoryLimit(e.target.value); setAddCategoryError(""); }}
                    className={addCategoryError ? "inputError" : ""} />
                  <button type="submit" className="primaryBtn smallBtn">Add New Category</button>
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
                </div>

                <small className="errorMsg">{addCategoryError}</small>
              </form>
            </article>
          </section>

          <section className="budgetBottomGrid">
            <article className="dashboardPanel accountBalancePanel">
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> ola-student2-backend
              <div className="panelHeader">
                <h2>Accounts & Balances</h2>
              </div>

<<<<<<< HEAD
              <div className="accountBalanceList">
                {!cards.length && cash === 0 ? (
                  <div className="emptyPanelState">
                    No cash or cards saved yet.
                  </div>
=======
              <div className="accountBalanceList">
                {!cards.length && cash === 0 ? (
                  <div className="emptyPanelState">
                    No cash or cards saved yet.
                  </div>
=======
              <div className="panelHeader"><h2>Accounts & Balances</h2></div>
              <div className="accountBalanceList">
                {!cards.length && cash === 0 ? (
                  <div className="emptyPanelState">No cash or cards saved yet.</div>
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
                ) : (
                  <>
                    {cards.map((card, index) => (
                      <div
                        className="accountRow"
                        key={card.id || card._id || card.number || index}
                      >
                        <div className="accountLeft">
                          <div className="accountIcon">💳</div>
                          <div>
<<<<<<< HEAD
                            <h4>{card.name || "Saved Card"}</h4>
                            <p>
                              {card.type || "Card"} ••••{" "}
                              {card.number ? card.number.slice(-4) : "----"}{" "}
                              {card.primary ? "• Primary" : ""}
                            </p>
=======
                            <h4>{card.name}</h4>
<<<<<<< HEAD
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
=======
                            <p>{card.type} •••• {card.number.slice(-4)} {card.primary ? "• Primary" : ""}</p>
>>>>>>> ola-student2-backend
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
<<<<<<< HEAD
                        <div>
                          <h4>Cash</h4>
                          <p>Available balance</p>
                        </div>
=======
                        <div><h4>Cash</h4><p>Available balance</p></div>
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
                      </div>

                      <div className="accountAmount">{formatMoney(cash)}</div>
                    </div>
                  </>
                )}
              </div>
<<<<<<< HEAD

=======
<<<<<<< HEAD

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
=======
>>>>>>> ola-student2-backend
              <form onSubmit={handleCashUpdate} className="cashUpdateForm">
                <div className="cashUpdateRow">
                  <input
                    type="number"
                    placeholder="Enter new cash amount"
                    value={updatedCashAmount}
<<<<<<< HEAD
                    onChange={(e) => {
                      setUpdatedCashAmount(e.target.value);
                      setCashUpdateError("");
                    }}
                    className={cashUpdateError ? "inputError" : ""}
                  />

                  <button type="submit" className="primaryBtn smallBtn">
                    Update Cash
                  </button>
=======
                    onChange={(e) => { setUpdatedCashAmount(e.target.value); setCashUpdateError(""); }}
                    className={cashUpdateError ? "inputError" : ""} />
                  <button type="submit" className="primaryBtn smallBtn">Update Cash</button>
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
                </div>

                <small className="errorMsg">{cashUpdateError}</small>
              </form>
            </article>

            <article className="dashboardPanel budgetGoalPanel">
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> ola-student2-backend
              <div className="panelHeader">
                <h2>Current Goal</h2>
              </div>

<<<<<<< HEAD
=======
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
=======
              <div className="panelHeader"><h2>Current Goal</h2></div>
>>>>>>> ola-student2-backend
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
<<<<<<< HEAD
                <Link to="/plan-setup" className="primaryBtn smallBtn">
                  Edit Goal
                </Link>
=======
                <a href="/plan-setup" className="primaryBtn smallBtn">Edit Goal</a>
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
<<<<<<< HEAD
}
=======
}
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
