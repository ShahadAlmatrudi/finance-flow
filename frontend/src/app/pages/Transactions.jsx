import { useEffect, useState } from "react";
import { getAppData, saveAppData } from "../utils/storage";
import { Link } from "react-router-dom";
import logo from "../assets/financeflow-logo.png";

export default function Transactions() {
  const [sidebarUserName, setSidebarUserName] = useState("User");
  const [sidebarAvatar, setSidebarAvatar] = useState("U");

  const [cards, setCards] = useState([]);
  const [cashBalance, setCashBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const [selectedSource, setSelectedSource] = useState("card");
  const [selectedCardId, setSelectedCardId] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");
  const [previewTransactions, setPreviewTransactions] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionFilter, setTransactionFilter] = useState("all");

  useEffect(() => {
    const data = getAppData();

    if (!data.user) {
      window.location.href = "/signup";
      return;
    }

    normalizeData();
    fillSidebarUser();
    loadPageData();
  }, []);

  useEffect(() => {
    renderTransactionsList();
  }, [transactionSearch, transactionFilter]);

  const normalizeData = () => {
    const appData = getAppData();

    if (!appData.plan) appData.plan = {};
    if (!Array.isArray(appData.plan.categories)) appData.plan.categories = [];
    if (!Array.isArray(appData.cards)) appData.cards = [];
    if (!Array.isArray(appData.transactions)) appData.transactions = [];
    if (typeof appData.cash !== "number") {
      appData.cash = Number(appData.cash || 0);
    }

    appData.cards = appData.cards.map((card) => ({
      ...card,
      balance: Number(card.balance || 0),
    }));

    appData.plan.categories = appData.plan.categories.map((category) => ({
      ...category,
      limit: Number(category.limit || 0),
      spent: Number(category.spent || 0),
    }));

    saveAppData(appData);
  };

  const loadPageData = () => {
    const appData = getAppData();

    setCards(appData.cards || []);
    setCashBalance(Number(appData.cash || 0));
    setTransactions(appData.transactions || []);

    if (appData.cards?.length > 0) {
      setSelectedCardId(String(appData.cards[0].id));
    }
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

  const formatMoney = (amount) => {
    return `$${Number(amount || 0).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSelectedCard = () => {
    return cards.find((card) => String(card.id) === String(selectedCardId));
  };

  const getPaymentLabel = () => {
    if (selectedSource === "cash") return "Cash";

    const card = getSelectedCard();
    if (!card) return "Card";

    return `${card.type} •••• ${String(card.number).slice(-4)}`;
  };

  const addCategoryIfMissing = (appData, categoryName) => {
    if (!appData.plan) appData.plan = {};
    if (!Array.isArray(appData.plan.categories)) appData.plan.categories = [];

    let category = appData.plan.categories.find(
      (item) => item.name === categoryName
    );

    if (!category && categoryName !== "Income") {
      category = {
        name: categoryName,
        limit: 0,
        spent: 0,
      };

      appData.plan.categories.push(category);
    }

    return category;
  };

  const applyTransactionEffect = (appData, transaction) => {
    const amount = Number(transaction.amount);

    if (transaction.type === "expense") {
      const category = addCategoryIfMissing(appData, transaction.category);

      if (category) {
        category.spent = Number(category.spent || 0) + amount;
      }

      if (transaction.paymentMethod === "cash") {
        const currentCash = Number(appData.cash || 0);

        if (currentCash < amount) {
          return {
            success: false,
            message: `Not enough cash balance for ${transaction.title}.`,
          };
        }

        appData.cash = currentCash - amount;
      }

      if (transaction.paymentMethod.startsWith("card:")) {
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
            message: `Not enough balance in the selected card for ${transaction.title}.`,
          };
        }

        card.balance = Number(card.balance || 0) - amount;
      }
    }

    if (transaction.type === "income") {
      if (transaction.paymentMethod === "cash") {
        appData.cash = Number(appData.cash || 0) + amount;
      }

      if (transaction.paymentMethod.startsWith("card:")) {
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

    if (transaction.type === "expense") {
      const category = appData.plan?.categories?.find(
        (item) => item.name === transaction.category
      );

      if (category) {
        category.spent = Math.max(0, Number(category.spent || 0) - amount);
      }

      if (transaction.paymentMethod === "cash") {
        appData.cash = Number(appData.cash || 0) + amount;
      }

      if (transaction.paymentMethod?.startsWith("card:")) {
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
      }

      if (transaction.paymentMethod?.startsWith("card:")) {
        const cardId = Number(transaction.paymentMethod.split(":")[1]);
        const card = appData.cards.find((item) => Number(item.id) === cardId);

        if (card) {
          card.balance = Math.max(0, Number(card.balance || 0) - amount);
        }
      }
    }
  };

  const handlePdfChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }

    setPdfFileName(file.name);
    setSuccessMsg("");
  };

  const handleExtractFromPdf = () => {
    setSuccessMsg("");

    if (selectedSource === "card" && !selectedCardId) {
      alert("Please select a card first.");
      return;
    }

    if (!pdfFileName) {
      alert("Please choose a PDF statement first.");
      return;
    }

    const paymentMethod =
      selectedSource === "cash" ? "cash" : `card:${selectedCardId}`;

    const paymentLabel = getPaymentLabel();

    const extractedTransactions = [
      {
        id: Date.now() + 1,
        title: "Tamimi Market",
        amount: 120,
        type: "expense",
        category: "Food & Dining",
        paymentMethod,
        paymentLabel,
        date: "2026-04-20",
        notes: `Imported from ${pdfFileName}`,
      },
      {
        id: Date.now() + 2,
        title: "Netflix Subscription",
        amount: 49,
        type: "expense",
        category: "Entertainment",
        paymentMethod,
        paymentLabel,
        date: "2026-04-22",
        notes: `Imported from ${pdfFileName}`,
      },
      {
        id: Date.now() + 3,
        title: "Salary Deposit",
        amount: 5000,
        type: "income",
        category: "Income",
        paymentMethod,
        paymentLabel,
        date: "2026-04-25",
        notes: `Imported from ${pdfFileName}`,
      },
    ];

    setPreviewTransactions(extractedTransactions);
  };

  const handleImportTransactions = () => {
    if (previewTransactions.length === 0) {
      alert("No transactions to import.");
      return;
    }

    const appData = getAppData();

    if (!Array.isArray(appData.transactions)) {
      appData.transactions = [];
    }

    for (const transaction of previewTransactions) {
      const result = applyTransactionEffect(appData, transaction);

      if (!result.success) {
        alert(result.message);
        return;
      }
    }

    appData.transactions = [...previewTransactions, ...appData.transactions];

    saveAppData(appData);

    setPreviewTransactions([]);
    setPdfFileName("");
    setSuccessMsg("Transactions imported successfully. Balance updated.");

    loadPageData();
    renderTransactionsList();
  };

  const handleClearPreview = () => {
    setPreviewTransactions([]);
    setPdfFileName("");
    setSuccessMsg("");
  };

  const renderTransactionsList = () => {
    const appData = getAppData();
    let txs = appData.transactions || [];

    const searchValue = transactionSearch.trim().toLowerCase();

    if (transactionFilter !== "all") {
      txs = txs.filter((item) => item.type === transactionFilter);
    }

    if (searchValue !== "") {
      txs = txs.filter((item) =>
        item.title.toLowerCase().includes(searchValue)
      );
    }

    setTransactions(txs);
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
    loadPageData();
    renderTransactionsList();
  };

  const handleLogout = () => {
    const shouldLogout = window.confirm("Are you sure you want to log out?");

    if (shouldLogout) {
      localStorage.removeItem("financeFlowData");
      window.location.href = "/signup";
    }
  };

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

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
                Upload a bank statement PDF, review the extracted transactions,
                then import them to update your card or cash balance.
              </p>
            </div>
          </header>

          <section className="transactionsTopGrid">
            <article className="dashboardPanel">
              <div className="panelHeader">
                <h2>Import Transactions from PDF</h2>
              </div>

              <div className="settingsForm">
                <div className="settingsGrid">
                  <div className="inputGroup">
                    <label>Transaction Source</label>
                    <select
                      value={selectedSource}
                      onChange={(e) => {
                        setSelectedSource(e.target.value);
                        setPreviewTransactions([]);
                        setSuccessMsg("");
                      }}
                    >
                      <option value="card">Card Statement</option>
                      <option value="cash">Cash Transactions</option>
                    </select>
                  </div>

                  {selectedSource === "card" ? (
                    <div className="inputGroup">
                      <label>Select Card Number</label>
                      <select
                        value={selectedCardId}
                        onChange={(e) => {
                          setSelectedCardId(e.target.value);
                          setPreviewTransactions([]);
                          setSuccessMsg("");
                        }}
                      >
                        <option value="">Select card</option>
                        {cards.map((card) => (
                          <option key={card.id} value={card.id}>
                            {card.type} •••• {String(card.number).slice(-4)} (
                            {formatMoney(card.balance)})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="inputGroup">
                      <label>Cash Balance</label>
                      <input
                        type="text"
                        value={`Cash (${formatMoney(cashBalance)})`}
                        readOnly
                      />
                    </div>
                  )}
                </div>

                <div className="inputGroup">
                  <label htmlFor="pdfUpload">Upload PDF Statement</label>
                  <input
                    type="file"
                    id="pdfUpload"
                    accept="application/pdf"
                    onChange={handlePdfChange}
                  />
                  {pdfFileName && (
                    <small className="settingsSuccessMsg">
                      Selected file: {pdfFileName}
                    </small>
                  )}
                </div>

                <div className="settingsActionRow">
                  <button
                    type="button"
                    className="primaryBtn smallBtn"
                    onClick={handleExtractFromPdf}
                  >
                    Extract Transactions
                  </button>

                  {previewTransactions.length > 0 && (
                    <button
                      type="button"
                      className="secondaryBtn smallBtn"
                      onClick={handleClearPreview}
                    >
                      Clear Preview
                    </button>
                  )}
                </div>

                {successMsg && (
                  <p className="settingsSuccessMsg">{successMsg}</p>
                )}
              </div>
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
                    {transactions.length}
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
                    {formatMoney(cashBalance)}
                  </strong>
                </div>
              </div>
            </article>
          </section>

          {previewTransactions.length > 0 && (
            <section className="dashboardPanel">
              <div className="panelHeader">
                <h2>Preview Extracted Transactions</h2>
              </div>

              <div className="transactionsList">
                {previewTransactions.map((transaction) => (
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
                          {transaction.category} • {transaction.paymentLabel} •{" "}
                          {formatDate(transaction.date)}
                        </p>
                        <small>{transaction.notes}</small>
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
                    </div>
                  </div>
                ))}
              </div>

              <div className="settingsActionRow">
                <button
                  type="button"
                  className="primaryBtn smallBtn"
                  onClick={handleImportTransactions}
                >
                  Import Transactions
                </button>
              </div>
            </section>
          )}

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
                <div className="emptyPanelState">
                  No transactions found. Upload a PDF statement to import
                  transactions.
                </div>
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
                        {transaction.notes ? (
                          <small>{transaction.notes}</small>
                        ) : null}
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