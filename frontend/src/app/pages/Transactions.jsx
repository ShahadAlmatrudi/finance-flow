import { useEffect, useState } from "react";
import { getAppData } from "../utils/storage";
import { Link } from "react-router-dom";
import logo from "../assets/financeflow-logo.png";

const API_BASE = "http://localhost:3000/api";

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

  const getUserId = () => {
    const data = getAppData() || {};
    return data.user?.id || data.user?._id;
  };

  useEffect(() => {
    const data = getAppData();

    if (!data.user) {
      window.location.href = "/signup";
      return;
    }

    fillSidebarUser();
    loadPageData();
  }, []);

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

  const loadPageData = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const cardsResponse = await fetch(`${API_BASE}/cards?userId=${userId}`);
      const cardsData = await cardsResponse.json();

      if (!cardsResponse.ok) {
        throw new Error(cardsData.message || "Failed to load cards");
      }

      setCards(cardsData);

      if (cardsData.length > 0) {
        setSelectedCardId(cardsData[0]._id);
      }

      const cashResponse = await fetch(`${API_BASE}/cash?userId=${userId}`);
      const cashData = await cashResponse.json();

      if (!cashResponse.ok) {
        throw new Error(cashData.message || "Failed to load cash");
      }

      setCashBalance(Number(cashData.balance || 0));

      const transactionsResponse = await fetch(
        `${API_BASE}/transactions?userId=${userId}`
      );
      const transactionsData = await transactionsResponse.json();

      if (!transactionsResponse.ok) {
        throw new Error(
          transactionsData.message || "Failed to load transactions"
        );
      }

      setTransactions(transactionsData);
    } catch (error) {
      alert(error.message);
    }
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
    return cards.find((card) => String(card._id) === String(selectedCardId));
  };

  const getPaymentLabel = () => {
    if (selectedSource === "cash") return "Cash";

    const card = getSelectedCard();
    if (!card) return "Card";

    return `${card.cardName} •••• ${String(card.cardNumber).slice(-4)}`;
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

    const paymentLabel = getPaymentLabel();

    const extractedTransactions = [
      {
        id: "preview-1",
        title: "Simulated restaurant transaction",
        amount: 35,
        type: "expense",
        category: "Food",
        paymentLabel,
        date: new Date().toISOString(),
        notes: `Preview from ${pdfFileName}`,
      },
      {
        id: "preview-2",
        title: "Simulated shopping transaction",
        amount: 120,
        type: "expense",
        category: "Shopping",
        paymentLabel,
        date: new Date().toISOString(),
        notes: `Preview from ${pdfFileName}`,
      },
      {
        id: "preview-3",
        title: "Simulated income transaction",
        amount: 500,
        type: "income",
        category: "Allowance",
        paymentLabel,
        date: new Date().toISOString(),
        notes: `Preview from ${pdfFileName}`,
      },
    ];

    setPreviewTransactions(extractedTransactions);
  };

  const handleImportTransactions = async () => {
    if (previewTransactions.length === 0) {
      alert("No transactions to import.");
      return;
    }

    const userId = getUserId();

    try {
      const response = await fetch(`${API_BASE}/transactions/import-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          source: selectedSource,
          cardId: selectedSource === "card" ? selectedCardId : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to import transactions");
      }

      setPreviewTransactions([]);
      setPdfFileName("");
      setSuccessMsg("Transactions imported successfully. Balance updated.");

      loadPageData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleClearPreview = () => {
    setPreviewTransactions([]);
    setPdfFileName("");
    setSuccessMsg("");
  };

  const handleDeleteTransaction = async (id) => {
    const transactionToDelete = transactions.find(
      (item) => String(item._id) === String(id)
    );

    if (!transactionToDelete) return;

    const confirmed = window.confirm(
      `Delete transaction "${transactionToDelete.description}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE}/transactions/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete transaction");
      }

      loadPageData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    const shouldLogout = window.confirm("Are you sure you want to log out?");

    if (shouldLogout) {
      localStorage.removeItem("financeFlowData");
      window.location.href = "/signup";
    }
  };

  const filteredTransactions = transactions.filter((item) => {
    const searchValue = transactionSearch.trim().toLowerCase();

    if (transactionFilter !== "all" && item.type !== transactionFilter) {
      return false;
    }

    if (searchValue !== "") {
      return (
        item.description?.toLowerCase().includes(searchValue) ||
        item.category?.toLowerCase().includes(searchValue)
      );
    }

    return true;
  });

  const totalIncome = filteredTransactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalExpenses = filteredTransactions
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
                          <option key={card._id} value={card._id}>
                            {card.cardName} ••••{" "}
                            {String(card.cardNumber).slice(-4)} (
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
                    {filteredTransactions.length}
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
                placeholder="Search transactions by title or category..."
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
              {filteredTransactions.length === 0 ? (
                <div className="emptyPanelState">
                  No transactions found. Upload a PDF statement to import
                  transactions.
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div className="transactionCardItem" key={transaction._id}>
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
                        <h3>{transaction.description}</h3>
                        <p>
                          {transaction.category} • {transaction.source} •{" "}
                          {formatDate(transaction.date)}
                        </p>
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
                        onClick={() => handleDeleteTransaction(transaction._id)}
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