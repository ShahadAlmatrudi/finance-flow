import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAppData } from "../utils/storage";
import { apiFetch } from "../utils/api";
import logo from "../assets/financeflow-logo.png";

export default function Dashboard() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("User");
  const [firstName, setFirstName] = useState("User");
  const [initials, setInitials] = useState("U");

  const [cashAmount, setCashAmount] = useState(0);
  const [cards, setCards] = useState([]);
  const [plan, setPlanState] = useState({});
  const [profile, setProfileState] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const formatMoney = (amount) => `$${Number(amount || 0).toLocaleString()}`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const appData = getAppData();

    if (!appData.user) {
      navigate("/signup");
      return;
    }

    const full = appData.user?.fullname || "User";
    const first = full.split(" ")[0];
    const userInitials = full
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    setFullName(full);
    setFirstName(first);
    setInitials(userInitials || "U");

    setCashAmount(Number(appData.cash || 0));
    setCards(appData.cards || []);
    setPlanState(appData.plan || {});
    setProfileState(appData.profile || {});
    setTransactions(appData.transactions || []);
    setCategories(appData.plan?.categories || []);

    const loadDashboard = async () => {
      try {
        const data = await apiFetch("/api/dashboard/summary");

        if (data.categories) {
          setCategories(data.categories);
        }

        if (data.plan) {
          setPlanState(data.plan);
        }
      } catch (err) {
        console.error("Could not load dashboard summary from server:", err.message);
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("financeFlowData");
      navigate("/signup");
    }
  };

  const primaryCard = cards.find((card) => card.primary);
  const latestCard = cards.length > 0 ? cards[cards.length - 1] : null;

  const primaryCardLabel = primaryCard
    ? `Primary card: ${primaryCard.type || "Card"} •••• ${
        primaryCard.number ? primaryCard.number.slice(-4) : "----"
      }`
    : latestCard
    ? `Latest card: ${latestCard.type || "Card"} •••• ${
        latestCard.number ? latestCard.number.slice(-4) : "----"
      }`
    : "No primary card set";

  const hasProfile = !!profile && !!profile.salaryRange;

  const savingPercent = plan.monthlySaving
    ? Math.min(
        Math.round(
          (Number(plan.monthlySaving) /
            Math.max(Number(plan.targetAmount || plan.monthlySaving), 1)) *
            100
        ),
        100
      )
    : 0;

  const cardsPercent = Math.min(cards.length * 30, 100);
  const categoryCount = categories.length || 0;
  const budgetPercent = Math.min(categoryCount * 20, 100);

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
            <Link to="/dashboard" className="navItem active">
              Dashboard
            </Link>
            <Link to="/transactions" className="navItem">
              Transactions
            </Link>
            <Link to="/budget" className="navItem">
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
            <div className="sidebarAvatar">{initials}</div>
            <div className="sidebarUserText">
              <p className="sidebarUserName">{fullName}</p>
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
              <h1 className="pageHeading">
                Welcome back, <span>{firstName}</span> 👋
              </h1>
              <p className="pageSubheading">
                Here is a quick overview of your finances.
              </p>
            </div>

            <div className="topBarRight">
              <input
                type="text"
                className="searchInput"
                placeholder="Search accounts..."
              />
              <Link to="/notifications" className="notificationBtn">
                🔔
              </Link>
            </div>
          </header>

          <section className="financeCards">
            <article className="financeCard cashCard">
              <div className="financeCardTop">
                <h3>Cash</h3>
                <span className="financeIcon">💵</span>
              </div>
              <p className="financeLabel">Available Balance</p>
              <h2 className="financeAmount">{formatMoney(cashAmount)}</h2>
              <Link to="/budget" className="cardActionBtn">
                View Details
              </Link>
            </article>

            <article className="financeCard cardBalanceCard">
              <div className="financeCardTop">
                <h3>Cards</h3>
                <span className="financeIcon">💳</span>
              </div>
              <p className="financeLabel">Total Saved Cards</p>
              <h2 className="financeAmount">{cards.length}</h2>
              <p className="financeSmallText">{primaryCardLabel}</p>
              <Link to="/cards" className="cardActionBtn">
                Manage Cards
              </Link>
            </article>

            <article className="financeCard savingCard">
              <div className="financeCardTop">
                <h3>Saving Goal</h3>
                <span className="financeIcon">🎯</span>
              </div>
              <p className="financeLabel">Monthly Saving Plan</p>
              <h2 className="financeAmount">
                {formatMoney(plan.monthlySaving || 0)}
              </h2>
              <p className="financeSmallText">{plan.goalName || "No goal yet"}</p>
              <Link to="/plans" className="cardActionBtn">
                View Plan
              </Link>
            </article>
          </section>

          <section className="dashboardGrid">
            <div className="dashboardPanel recentTransactionsPanel">
              <div className="panelHeader">
                <h2>Recent Transactions</h2>
              </div>

              <div className="transactionList">
                {!transactions.length ? (
                  <div className="emptyPanelState">
                    No transactions yet. Start by adding one from the Transactions page.
                  </div>
                ) : (
                  transactions.slice(0, 5).map((transaction, index) => (
                    <div className="transactionItem" key={transaction.id || index}>
                      <div className="transactionLeft">
                        <h4>{transaction.title}</h4>
                        <p>
                          {transaction.category} •{" "}
                          {transaction.paymentLabel ||
                            transaction.paymentMethod ||
                            "Payment"}{" "}
                          • {formatDate(transaction.date)}
                        </p>
                      </div>

                      <div
                        className={`transactionRight ${
                          transaction.type === "income"
                            ? "positiveAmount"
                            : "negativeAmount"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatMoney(transaction.amount)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="dashboardPanel monthOverviewPanel">
              <div className="panelHeader">
                <h2>This Month Overview</h2>
              </div>

              <div className="progressList">
                <div className="progressItem">
                  <div className="progressLabelRow">
                    <span>Income Status</span>
                    <span>{hasProfile ? "Profile complete" : "Profile incomplete"}</span>
                  </div>
                  <div className="progressTrack">
                    <div
                      className="progressFill progressBlue"
                      style={{ width: hasProfile ? "100%" : "20%" }}
                    ></div>
                  </div>
                </div>

                <div className="progressItem">
                  <div className="progressLabelRow">
                    <span>Saving Progress</span>
                    <span>{savingPercent}%</span>
                  </div>
                  <div className="progressTrack">
                    <div
                      className="progressFill progressGreen"
                      style={{ width: `${savingPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="progressItem">
                  <div className="progressLabelRow">
                    <span>Cards Setup</span>
                    <span>
                      {cards.length} card{cards.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="progressTrack">
                    <div
                      className="progressFill progressPurple"
                      style={{ width: `${cardsPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="progressItem">
                  <div className="progressLabelRow">
                    <span>Budget Categories</span>
                    <span>
                      {categoryCount} categor{categoryCount === 1 ? "y" : "ies"}
                    </span>
                  </div>
                  <div className="progressTrack">
                    <div
                      className="progressFill progressOrange"
                      style={{ width: `${budgetPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboardPanel budgetPanel">
              <div className="panelHeader">
                <h2>Budget Categories</h2>
                <Link to="/budget" className="panelLink">
                  Manage
                </Link>
              </div>

              <div className="categoryList">
                {!categories.length ? (
                  <div className="emptyPanelState">
                    No categories added yet. Create your budget categories in plan setup.
                  </div>
                ) : (
                  categories.map((category, index) => {
                    const spent = Number(category.spent || 0);
                    const limit = Number(category.limit || 0);
                    const remaining = Math.max(0, limit - spent);
                    const percent =
                      limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

                    return (
                      <div
                        className="categoryItem"
                        key={category._id || category.name || index}
                      >
                        <div className="categoryTopRow">
                          <span className="categoryName">{category.name}</span>
                          <span className="categoryAmounts">
                            {formatMoney(spent)} / {formatMoney(limit)}
                          </span>
                        </div>

                        <div className="categoryBar">
                          <div
                            className="categoryBarFill"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>

                        <div className="categoryBottomRow">
                          <span>{Math.round(percent)}% used</span>
                          <span>{formatMoney(remaining)} left</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="dashboardPanel goalPanel">
              <div className="panelHeader">
                <h2>Main Goal</h2>
              </div>

              <div className="goalBox">
                <p className="goalType">{plan.goalType || "No goal type"}</p>
                <h3 className="goalName">
                  {plan.goalName || "No goal created yet"}
                </h3>
                <p className="goalMeta">
                  Target amount: {formatMoney(plan.targetAmount || 0)}
                </p>
                <p className="goalMeta">
                  Target date: {plan.targetDate ? formatDate(plan.targetDate) : "--"}
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}