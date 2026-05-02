import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAppData } from "../utils/storage";
import logo from "../assets/financeflow-logo.png";

const API_BASE = "http://localhost:3000/api";

export default function Cards() {
  const navigate = useNavigate();

  const [sidebarUserName, setSidebarUserName] = useState("User");
  const [sidebarAvatar, setSidebarAvatar] = useState("U");

  const [cards, setCards] = useState([]);
  const [cashDisplayText, setCashDisplayText] = useState(
    "No cash amount saved yet."
  );

  const [cardType, setCardType] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardBalance, setCardBalance] = useState("");
  const [primaryCard, setPrimaryCard] = useState(false);
  const [cashAmount, setCashAmount] = useState("");

  const [cardTypeError, setCardTypeError] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [cardBalanceError, setCardBalanceError] = useState("");
  const [cashError, setCashError] = useState("");

  const getUserId = () => {
    const data = getAppData() || {};
    return data.user?.id || data.user?._id;
  };

  useEffect(() => {
    const appData = getAppData() || {};

    if (!appData.user) {
      navigate("/signup");
      return;
    }

    const fullName = appData.user?.fullname || "User";
    const initials = fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    setSidebarUserName(fullName);
    setSidebarAvatar(initials || "U");

    loadCards();
    loadCash();
  }, [navigate]);

  const loadCards = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const response = await fetch(`${API_BASE}/cards?userId=${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load cards");
      }

      setCards(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const loadCash = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const response = await fetch(`${API_BASE}/cash?userId=${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load cash");
      }

      if (!data.balance) {
        setCashDisplayText("No cash amount saved yet.");
      } else {
        setCashDisplayText(`Saved Cash Amount: ${formatMoney(data.balance)}`);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    const shouldLogout = window.confirm("Are you sure you want to log out?");

    if (shouldLogout) {
      localStorage.removeItem("financeFlowData");
      navigate("/signup");
    }
  };

  const formatCardNumber = (number) => {
    return `•••• •••• •••• ${String(number).slice(-4)}`;
  };

  const formatMoney = (amount) => {
    return `$${Number(amount || 0).toLocaleString()}`;
  };

  const clearCardErrors = () => {
    setCardTypeError("");
    setCardNumberError("");
    setCardBalanceError("");
  };

  const handleCardSubmit = async (event) => {
    event.preventDefault();
    clearCardErrors();

    let isValid = true;
    const cleanNumber = cardNumber.replace(/\s/g, "");

    if (cardType === "") {
      setCardTypeError("Please select a card type.");
      isValid = false;
    }

    if (cardNumber.trim() === "") {
      setCardNumberError("Card number is required.");
      isValid = false;
    } else if (!/^\d{16}$/.test(cleanNumber)) {
      setCardNumberError("Card number must be exactly 16 digits.");
      isValid = false;
    }

    if (cardBalance.trim() === "") {
      setCardBalanceError("Card balance is required.");
      isValid = false;
    } else if (Number(cardBalance) < 0) {
      setCardBalanceError("Card balance cannot be negative.");
      isValid = false;
    }

    if (!isValid) return;

    const userId = getUserId();

    try {
      const response = await fetch(`${API_BASE}/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          cardNumber: cleanNumber,
          cardName: cardType,
          balance: Number(cardBalance),
          primary: primaryCard,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save card");
      }

      setCardType("");
      setCardNumber("");
      setCardBalance("");
      setPrimaryCard(false);

      loadCards();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCashSubmit = async (event) => {
    event.preventDefault();
    setCashError("");

    if (cashAmount.trim() === "") {
      setCashError("Please enter a cash amount.");
      return;
    }

    if (Number(cashAmount) < 0) {
      setCashError("Cash amount cannot be negative.");
      return;
    }

    const userId = getUserId();

    try {
      const response = await fetch(`${API_BASE}/cash`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          balance: Number(cashAmount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save cash");
      }

      setCashAmount("");
      setCashDisplayText(`Saved Cash Amount: ${formatMoney(data.balance)}`);
    } catch (error) {
      alert(error.message);
    }
  };

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
            <Link to="/budget" className="navItem">
              Budget
            </Link>
            <Link to="/analytics" className="navItem">
              Analytics
            </Link>
            <Link to="/cards" className="navItem active">
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
              <h1 className="pageHeading">Cards & Cash</h1>
              <p className="pageSubheading">
                Add your card number and current balance so FinanceFlow can
                update your balance after imported transactions.
              </p>
            </div>
          </header>

          <section className="transactionsTopGrid">
            <article className="dashboardPanel">
              <div className="panelHeader">
                <h2>Add Card Balance Source</h2>
              </div>

              <form onSubmit={handleCardSubmit} className="settingsForm">
                <div className="settingsGrid">
                  <div className="inputGroup">
                    <label htmlFor="card-type">Card Type</label>
                    <select
                      id="card-type"
                      value={cardType}
                      onChange={(e) => {
                        setCardType(e.target.value);
                        setCardTypeError("");
                      }}
                      className={cardTypeError ? "inputError" : ""}
                    >
                      <option value="">Select card type</option>
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="Mada">Mada</option>
                    </select>
                    <small className="errorMsg">{cardTypeError}</small>
                  </div>

                  <div className="inputGroup">
                    <label htmlFor="card-number">Card Number</label>
                    <input
                      type="text"
                      id="card-number"
                      placeholder="Enter 16-digit card number"
                      value={cardNumber}
                      onChange={(e) => {
                        setCardNumber(e.target.value);
                        setCardNumberError("");
                      }}
                      className={cardNumberError ? "inputError" : ""}
                    />
                    <small className="errorMsg">{cardNumberError}</small>
                  </div>
                </div>

                <div className="settingsGrid">
                  <div className="inputGroup">
                    <label htmlFor="card-balance">Current Card Balance</label>
                    <input
                      type="number"
                      id="card-balance"
                      placeholder="Enter current balance"
                      value={cardBalance}
                      onChange={(e) => {
                        setCardBalance(e.target.value);
                        setCardBalanceError("");
                      }}
                      className={cardBalanceError ? "inputError" : ""}
                    />
                    <small className="errorMsg">{cardBalanceError}</small>
                  </div>

                  <div className="inputGroup inlineCheckGroup">
                    <label className="optionLabel checkboxOption">
                      <input
                        type="checkbox"
                        checked={primaryCard}
                        onChange={(e) => setPrimaryCard(e.target.checked)}
                      />
                      Set as primary card
                    </label>
                  </div>
                </div>

                <div className="settingsActionRow">
                  <button type="submit" className="primaryBtn smallBtn">
                    Save Card
                  </button>
                </div>
              </form>
            </article>

            <article className="dashboardPanel">
              <div className="panelHeader">
                <h2>Cash Balance</h2>
              </div>

              <form onSubmit={handleCashSubmit} className="settingsForm">
                <div className="inputGroup">
                  <label htmlFor="cash-amount">Current Cash Amount</label>
                  <input
                    type="number"
                    id="cash-amount"
                    placeholder="Enter amount"
                    value={cashAmount}
                    onChange={(e) => {
                      setCashAmount(e.target.value);
                      setCashError("");
                    }}
                    className={cashError ? "inputError" : ""}
                  />
                  <small className="errorMsg">{cashError}</small>
                </div>

                <div className="settingsActionRow">
                  <button type="submit" className="primaryBtn smallBtn">
                    Save Cash
                  </button>
                </div>
              </form>

              <div className="cashDisplay">{cashDisplayText}</div>
            </article>
          </section>

          <section className="dashboardPanel">
            <div className="panelHeader">
              <h2>Saved Cards</h2>
            </div>

            <div className="cardsPreview">
              {cards.length === 0 ? (
                <div className="emptyState">
                  No cards added yet. Add your first card above.
                </div>
              ) : (
                cards.map((card) => (
                  <div
                    key={card._id}
                    className={`savedCard ${
                      card.cardName === "Visa"
                        ? "savedVisa"
                        : card.cardName === "Mastercard"
                        ? "savedMastercard"
                        : card.cardName === "Mada"
                        ? "savedMada"
                        : ""
                    }`}
                  >
                    <div className="savedCardTop">
                      <span className="savedCardBrand">{card.cardName}</span>
                    </div>

                    <div className="savedCardNumber">
                      {formatCardNumber(card.cardNumber)}
                    </div>

                    <div className="savedCardBottom">
                      <div>
                        <div className="savedCardName">
                          Card ending in {String(card.cardNumber).slice(-4)}
                        </div>
                        <div className="savedCardExpiry">
                          Used for transaction matching
                        </div>
                      </div>

                      <div className="savedCardExpiry">
                        Balance: {formatMoney(card.balance || 0)}
                      </div>
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