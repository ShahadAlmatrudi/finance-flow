import { useEffect, useState } from "react";
import { getAppData, saveAppData } from "../utils/storage";
import { Link } from "react-router-dom";

export default function Transactions() {
  const [sidebarUserName, setSidebarUserName] = useState("User");
  const [sidebarAvatar, setSidebarAvatar] = useState("U");

  const [transactionTitle, setTransactionTitle] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("");
  const [transactionPaymentMethod, setTransactionPaymentMethod] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionNotes, setTransactionNotes] = useState("");

  const [transactionTitleError, setTransactionTitleError] = useState("");
  const [transactionAmountError, setTransactionAmountError] = useState("");
  const [transactionTypeError, setTransactionTypeError] = useState("");
  const [transactionCategoryError, setTransactionCategoryError] = useState("");
  const [transactionPaymentMethodError, setTransactionPaymentMethodError] =
    useState("");
  const [transactionDateError, setTransactionDateError] = useState("");
  const [transactionSuccessMsg, setTransactionSuccessMsg] = useState("");

  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [currentCash, setCurrentCash] = useState(0);

  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionFilter, setTransactionFilter] = useState("all");

  useEffect(() => {
    const data = getAppData();

    if (!data.user) {
      window.location.href = "/signup";
      return;
    }

    initializePage();
  }, []);

  const initializePage = () => {
    normalizeData();
    fillSidebarUser();
    setTodayDate();
    populateCategoryOptions();
    populatePaymentMethodOptions();
    renderSummary();
    renderTransactionsList();
  };

  const normalizeData = () => {
    const appData = getAppData();

    if (!appData.plan) {
      appData.plan = {};
    }

    if (!Array.isArray(appData.plan.categories)) {
      appData.plan.categories = [];
    }

    if (!Array.isArray(appData.cards)) {
      appData.cards = [];
    }

    if (!Array.isArray(appData.transactions)) {
      appData.transactions = [];
    }

    if (typeof appData.cash !== "number") {
      appData.cash = Number(appData.cash || 0);
    }

    if (
      appData.plan.categories.length === 0 &&
      Array.isArray(appData.questionnaire?.categories)
    ) {
      appData.plan.categories = appData.questionnaire.categories.map((name) => ({
        name,
        limit: 0,
        spent: 0,
      }));
    }

    appData.plan.categories = appData.plan.categories.map((category) => ({
      ...category,
      name: category.name,
      limit: Number(category.limit || 0),
      spent: Number(category.spent || 0),
    }));

    appData.cards = appData.cards.map((card) => ({
      ...card,
      balance: Number(card.balance || 0),
    }));

    saveAppData(appData);
  };

  const fillSidebarUser = () => {
    const appData = getAppData();
    const fullName = appData.user?.fullname || appData.user?.name || "User";

    const initials =
      fullName
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U";

    setSidebarUserName(fullName);
    setSidebarAvatar(initials);
  };

  const populateCategoryOptions = () => {
    const appData = getAppData();
    const planCategories = appData.plan?.categories || [];

    if (planCategories.length === 0) {
      setCategories([{ value: "General", label: "General" }]);
      return;
    }

    setCategories(
      planCategories.map((category) => ({
        value: category.name,
        label: category.name,
      }))
    );
  };

  const populatePaymentMethodOptions = () => {
    const appData = getAppData();
    const cards = appData.cards || [];
    const cash = Number(appData.cash || 0);

    const methods = [
      {
        value: "cash",
        label: `Cash (${formatMoney(cash)})`,
      },
      ...cards.map((card) => ({
        value: `card:${card.id}`,
        label: `${card.type} •••• ${card.number.slice(-4)} (${formatMoney(
          card.balance
        )})${card.primary ? " - Primary" : ""}`,
      })),
    ];

    setPaymentMethods(methods);
  };

  const applyTransactionEffect = (appData, transaction) => {
    const amount = Number(transaction.amount);

    if (!appData.plan) {
      appData.plan = {};
    }

    if (!Array.isArray(appData.plan.categories)) {
      appData.plan.categories = [];
    }

    if (!Array.isArray(appData.cards)) {
      appData.cards = [];
    }

    let category = appData.plan.categories.find(
      (item) => item.name === transaction.category
    );

    if (!category && transaction.category === "General") {
      category = { name: "General", limit: 0, spent: 0 };
      appData.plan.categories.push(category);
    }

    if (transaction.type === "expense") {
      if (category) {
        category.spent = Number(category.spent || 0) + amount;
      }

      if (transaction.paymentMethod === "cash") {
        const currentCash = Number(appData.cash || 0);

        if (currentCash < amount) {
          return {
            success: false,
            message: "Not enough cash balance for this transaction.",
          };
        }

        appData.cash = currentCash - amount;
      } else if (transaction.paymentMethod.startsWith("card:")) {
        const cardId = Number(transaction.paymentMethod.split(":")[1]);
        const card = appData.cards.find((item) => Number(item.id) === cardId);

        if (!card) {
          return {
            success: false,
            message: "Selected card was not found.",
          };
        }

        if (Number(card.balance || 0) < amount) {
          return {
            success: false,
            message: "Not enough balance in the selected card.",
          };
        }

        card.balance = Number(card.balance || 0) - amount;
      }
    }

    if (transaction.type === "income") {
      if (transaction.paymentMethod === "cash") {
        appData.cash = Number(appData.cash || 0) + amount;
      } else if (transaction.paymentMethod.startsWith("card:")) {
        const cardId = Number(transaction.paymentMethod.split(":")[1]);
        const card = appData.cards.find((item) => Number(item.id) === cardId);

        if (!card) {
          return {
            success: false,
            message: "Selected card was not found.",
          };
        }

        card.balance = Number(card.balance || 0) + amount;
      }
    }

    return { success: true };
  };

  const reverseTransactionEffect = (appData, transaction) => {
    const amount = Number(transaction.amount);

    const category = appData.plan?.categories?.find(
      (item) => item.name === transaction.category
    );

    if (transaction.type === "expense") {
      if (category) {
        category.spent = Math.max(0, Number(category.spent || 0) - amount);
      }

      if (transaction.paymentMethod === "cash") {
        appData.cash = Number(appData.cash || 0) + amount;
      } else if (transaction.paymentMethod.startsWith("card:")) {
        const cardId = Number(transaction.paymentMethod.split(":")[1]);
        const card = appData.cards.find((item) => Number(item.id) === cardId);

        if (card) {
          card.balance = Number(card.balance || 0) + amount;
        }
      }
    }

    if (transaction.type === "income") {
      if (transaction.paymentMethod === "cash") {
        appData.cash = Math.max(0, Number(appData.cash || 0) - amount);
      } else if (transaction.paymentMethod.startsWith("card:")) {
        const cardId = Number(transaction.paymentMethod.split(":")[1]);
        const card = appData.cards.find((item) => Number(item.id) === cardId);

        if (card) {
          card.balance = Math.max(0, Number(card.balance || 0) - amount);
        }
      }
    }
  };

  const renderSummary = () => {
    const appData = getAppData();
    const txs = appData.transactions || [];

    const income = txs
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const expenses = txs
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    setTotalTransactions(txs.length);
    setTotalIncome(income);
    setTotalExpenses(expenses);
    setCurrentCash(Number(appData.cash || 0));
  };

  const renderTransactionsList = () => {
    const appData = getAppData();
    let txs = appData.transactions || [];

    const searchValue = transactionSearch.trim().toLowerCase();
    const filterValue = transactionFilter;

    if (filterValue !== "all") {
      txs = txs.filter((item) => item.type === filterValue);
    }

    if (searchValue !== "") {
      txs = txs.filter((item) =>
        item.title.toLowerCase().includes(searchValue)
      );
    }

    setTransactions(txs);
  };

  useEffect(() => {
    renderTransactionsList();
  }, [transactionSearch, transactionFilter]);

  const refreshFormOptions = () => {
    populateCategoryOptions();
    populatePaymentMethodOptions();
    fillSidebarUser();
  };

  const getPaymentMethodLabel = (value, cards) => {
    if (value === "cash") {
      return "Cash";
    }

    if (value.startsWith("card:")) {
      const cardId = Number(value.split(":")[1]);
      const card = cards.find((item) => Number(item.id) === cardId);

      if (card) {
        return `${card.type} •••• ${card.number.slice(-4)}`;
      }
    }

    return value;
  };

  const setTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setTransactionDate(`${year}-${month}-${day}`);
  };

  const clearTransactionErrors = () => {
    setTransactionTitleError("");
    setTransactionAmountError("");
    setTransactionTypeError("");
    setTransactionCategoryError("");
    setTransactionPaymentMethodError("");
    setTransactionDateError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    clearTransactionErrors();
    setTransactionSuccessMsg("");

    let isValid = true;

    if (transactionTitle.trim() === "") {
      setTransactionTitleError("Transaction title is required.");
      isValid = false;
    }

    if (transactionAmount.trim() === "") {
      setTransactionAmountError("Amount is required.");
      isValid = false;
    } else if (Number(transactionAmount) <= 0) {
      setTransactionAmountError("Amount must be greater than 0.");
      isValid = false;
    }

    if (transactionType === "") {
      setTransactionTypeError("Please select a transaction type.");
      isValid = false;
    }

    if (transactionCategory === "") {
      setTransactionCategoryError("Please select a category.");
      isValid = false;
    }

    if (transactionPaymentMethod === "") {
      setTransactionPaymentMethodError("Please select a payment method.");
      isValid = false;
    }

    if (transactionDate === "") {
      setTransactionDateError("Please select a date.");
      isValid = false;
    }

    if (!isValid) return;

    const appData = getAppData();
    const amount = Number(transactionAmount);

    const newTransaction = {
      id: Date.now(),
      title: transactionTitle.trim(),
      amount,
      type: transactionType,
      category: transactionCategory,
      paymentMethod: transactionPaymentMethod,
      paymentLabel: getPaymentMethodLabel(
        transactionPaymentMethod,
        appData.cards || []
      ),
      date: transactionDate,
      notes: transactionNotes.trim(),
    };

    const result = applyTransactionEffect(appData, newTransaction);

    if (!result.success) {
      window.alert(result.message);
      return;
    }

    if (!Array.isArray(appData.transactions)) {
      appData.transactions = [];
    }

    appData.transactions.unshift(newTransaction);
    saveAppData(appData);

    setTransactionTitle("");
    setTransactionAmount("");
    setTransactionType("");
    setTransactionCategory("");
    setTransactionPaymentMethod("");
    setTransactionNotes("");
    setTodayDate();

    populateCategoryOptions();
    populatePaymentMethodOptions();
    renderSummary();
    renderTransactionsList();
    setTransactionSuccessMsg("Transaction saved successfully.");
  };

  const handleDeleteTransaction = (id) => {
    const appData = getAppData();
    const transactionToDelete = appData.transactions.find(
      (item) => Number(item.id) === Number(id)
    );

    if (!transactionToDelete) return;

    const confirmed = window.confirm(
      `Delete transaction "${transactionToDelete.title}"?`
    );

    if (!confirmed) return;

    reverseTransactionEffect(appData, transactionToDelete);
    appData.transactions = appData.transactions.filter(
      (item) => Number(item.id) !== Number(id)
    );

    saveAppData(appData);
    refreshFormOptions();
    renderSummary();
    renderTransactionsList();
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

  return (
    <div className="appPageBody">
      <div className="appLayout">
        <aside className="sidebar">
          <div className="sidebarBrand">
            <a href="/dashboard" className="sidebarLogo">
              💸 FinanceFlow
            </a>
          </div>

          <nav className="sidebarNav">
            <Link to="/dashboard" className="navItem">
              Dashboard
            </Link>
            <Link to="/transactions" className="navItem active">
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
              <h1 className="pageHeading">Transactions</h1>
              <p className="pageSubheading">
                Add income and expenses manually to track your finances.
              </p>
            </div>
          </header>

          <section className="transactionsTopGrid">
            <article className="dashboardPanel">
              <div className="panelHeader">
                <h2>Add New Transaction</h2>
              </div>

              <form onSubmit={handleSubmit} className="settingsForm">
                <div className="settingsGrid">
                  <div className="inputGroup">
                    <label htmlFor="transactionTitle">Transaction Title</label>
                    <input
                      type="text"
                      id="transactionTitle"
                      placeholder="e.g. Grocery Shopping"
                      value={transactionTitle}
                      onChange={(e) => {
                        setTransactionTitle(e.target.value);
                        setTransactionTitleError("");
                      }}
                      className={transactionTitleError ? "inputError" : ""}
                    />
                    <small className="errorMsg">{transactionTitleError}</small>
                  </div>

                  <div className="inputGroup">
                    <label htmlFor="transactionAmount">Amount</label>
                    <input
                      type="number"
                      id="transactionAmount"
                      placeholder="Enter amount"
                      value={transactionAmount}
                      onChange={(e) => {
                        setTransactionAmount(e.target.value);
                        setTransactionAmountError("");
                      }}
                      className={transactionAmountError ? "inputError" : ""}
                    />
                    <small className="errorMsg">{transactionAmountError}</small>
                  </div>
                </div>

                <div className="settingsGrid">
                  <div className="inputGroup">
                    <label htmlFor="transactionType">Transaction Type</label>
                    <select
                      id="transactionType"
                      value={transactionType}
                      onChange={(e) => {
                        setTransactionType(e.target.value);
                        setTransactionTypeError("");
                      }}
                      className={transactionTypeError ? "inputError" : ""}
                    >
                      <option value="">Select type</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                    <small className="errorMsg">{transactionTypeError}</small>
                  </div>

                  <div className="inputGroup">
                    <label htmlFor="transactionCategory">Category</label>
                    <select
                      id="transactionCategory"
                      value={transactionCategory}
                      onChange={(e) => {
                        setTransactionCategory(e.target.value);
                        setTransactionCategoryError("");
                      }}
                      className={transactionCategoryError ? "inputError" : ""}
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    <small className="errorMsg">{transactionCategoryError}</small>
                  </div>
                </div>

                <div className="settingsGrid">
                  <div className="inputGroup">
                    <label htmlFor="transactionPaymentMethod">
                      Payment Method
                    </label>
                    <select
                      id="transactionPaymentMethod"
                      value={transactionPaymentMethod}
                      onChange={(e) => {
                        setTransactionPaymentMethod(e.target.value);
                        setTransactionPaymentMethodError("");
                      }}
                      className={
                        transactionPaymentMethodError ? "inputError" : ""
                      }
                    >
                      <option value="">Select payment method</option>
                      {paymentMethods.map((method) => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                    <small className="errorMsg">
                      {transactionPaymentMethodError}
                    </small>
                  </div>

                  <div className="inputGroup">
                    <label htmlFor="transactionDate">Date</label>
                    <input
                      type="date"
                      id="transactionDate"
                      value={transactionDate}
                      onChange={(e) => {
                        setTransactionDate(e.target.value);
                        setTransactionDateError("");
                      }}
                      className={transactionDateError ? "inputError" : ""}
                    />
                    <small className="errorMsg">{transactionDateError}</small>
                  </div>
                </div>

                <div className="inputGroup">
                  <label htmlFor="transactionNotes">Notes</label>
                  <textarea
                    id="transactionNotes"
                    rows="4"
                    placeholder="Optional notes"
                    value={transactionNotes}
                    onChange={(e) => setTransactionNotes(e.target.value)}
                  ></textarea>
                </div>

                <div className="settingsActionRow">
                  <button type="submit" className="primaryBtn smallBtn">
                    Save Transaction
                  </button>
                </div>

                <p className="settingsSuccessMsg">{transactionSuccessMsg}</p>
              </form>
            </article>

            <article className="dashboardPanel">
              <div className="panelHeader">
                <h2>Quick Summary</h2>
              </div>

              <div className="transactionsSummaryList">
                <div className="analyticsSnapshotItem">
                  <span className="analyticsSnapshotLabel">
                    Total Transactions
                  </span>
                  <strong className="analyticsSnapshotValue">
                    {totalTransactions}
                  </strong>
                </div>

                <div className="analyticsSnapshotItem">
                  <span className="analyticsSnapshotLabel">Total Income</span>
                  <strong className="analyticsSnapshotValue">
                    {formatMoney(totalIncome)}
                  </strong>
                </div>

                <div className="analyticsSnapshotItem">
                  <span className="analyticsSnapshotLabel">Total Expenses</span>
                  <strong className="analyticsSnapshotValue">
                    {formatMoney(totalExpenses)}
                  </strong>
                </div>

                <div className="analyticsSnapshotItem">
                  <span className="analyticsSnapshotLabel">Current Cash</span>
                  <strong className="analyticsSnapshotValue">
                    {formatMoney(currentCash)}
                  </strong>
                </div>
              </div>
            </article>
          </section>

          <section className="dashboardPanel">
            <div className="panelHeader">
              <h2>Saved Transactions</h2>
            </div>

            <div className="transactionsToolbar">
              <input
                type="text"
                className="searchInput"
                placeholder="Search transactions by title..."
                value={transactionSearch}
                onChange={(e) => setTransactionSearch(e.target.value)}
              />
              <select
                className="transactionsFilter"
                value={transactionFilter}
                onChange={(e) => setTransactionFilter(e.target.value)}
              >
                <option value="all">All Transactions</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>
            </div>

            <div className="transactionsList">
              {transactions.length === 0 ? (
                <div className="emptyPanelState">No transactions found.</div>
              ) : (
                transactions.map((transaction) => (
                  <div className="transactionCardItem" key={transaction.id}>
                    <div className="transactionCardLeft">
                      <div
                        className={`transactionTypeIcon ${
                          transaction.type === "income"
                            ? "incomeIcon"
                            : "expenseIcon"
                        }`}
                      >
                        {transaction.type === "income" ? "↗" : "↘"}
                      </div>

                      <div className="transactionCardContent">
                        <h3>{transaction.title}</h3>
                        <p>
                          {transaction.category} •{" "}
                          {transaction.paymentLabel ||
                            transaction.paymentMethod}{" "}
                          • {formatDate(transaction.date)}
                        </p>
                        {transaction.notes ? <small>{transaction.notes}</small> : null}
                      </div>
                    </div>

                    <div className="transactionCardRight">
                      <strong
                        className={
                          transaction.type === "income"
                            ? "positiveAmount"
                            : "negativeAmount"
                        }
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatMoney(transaction.amount)}
                      </strong>
                      <button
                        type="button"
                        className="dangerGhostBtn smallBtn deleteTransactionBtn"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}