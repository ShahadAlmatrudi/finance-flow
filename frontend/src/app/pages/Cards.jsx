import { useEffect, useState } from "react";
import { addCard, getAppData, setCash } from "../utils/storage";

export default function Cards() {
  const [sidebarUserName, setSidebarUserName] = useState("User");
  const [sidebarAvatar, setSidebarAvatar] = useState("U");

  const [cards, setCards] = useState([]);
  const [cashDisplayText, setCashDisplayText] = useState("No cash amount saved yet.");

  const [cardType, setCardType] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardBalance, setCardBalance] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [primaryCard, setPrimaryCard] = useState(false);
  const [cashAmount, setCashAmount] = useState("");

  const [cardTypeError, setCardTypeError] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [cardNameError, setCardNameError] = useState("");
  const [cardBalanceError, setCardBalanceError] = useState("");
  const [expMonthError, setExpMonthError] = useState("");
  const [expYearError, setExpYearError] = useState("");
  const [cvvError, setCvvError] = useState("");
  const [cashError, setCashError] = useState("");

  useEffect(() => {
    const appData = getAppData();

    if (!appData.user) {
      window.location.href = "/signup";
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

    renderCards();
    renderCash();
  }, []);

  const handleLogout = () => {
    const shouldLogout = window.confirm("Are you sure you want to log out?");

    if (shouldLogout) {
      localStorage.removeItem("financeFlowData");
      window.location.href = "/signup";
    }
  };

  const formatCardNumber = (number) => {
    return `•••• •••• •••• ${number.slice(-4)}`;
  };

  const formatMoney = (amount) => {
    return `$${Number(amount).toLocaleString()}`;
  };

  const clearCardErrors = () => {
    setCardTypeError("");
    setCardNumberError("");
    setCardNameError("");
    setCardBalanceError("");
    setExpMonthError("");
    setExpYearError("");
    setCvvError("");
  };

  const renderCards = () => {
    const data = getAppData();
    setCards(data.cards || []);
  };

  const renderCash = () => {
    const data = getAppData();

    if (data.cash === 0 || data.cash === null || data.cash === undefined) {
      setCashDisplayText("No cash amount saved yet.");
    } else {
      setCashDisplayText(`Saved Cash Amount: ${formatMoney(data.cash)}`);
    }
  };

  const handleCardSubmit = (event) => {
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

    if (cardName.trim() === "") {
      setCardNameError("Cardholder name is required.");
      isValid = false;
    }

    if (cardBalance.trim() === "") {
      setCardBalanceError("Card balance is required.");
      isValid = false;
    } else if (Number(cardBalance) < 0) {
      setCardBalanceError("Card balance cannot be negative.");
      isValid = false;
    }

    if (expMonth.trim() === "") {
      setExpMonthError("Expiry month is required.");
      isValid = false;
    } else if (
      !/^\d{2}$/.test(expMonth) ||
      Number(expMonth) < 1 ||
      Number(expMonth) > 12
    ) {
      setExpMonthError("Enter a valid month between 01 and 12.");
      isValid = false;
    }

    if (expYear.trim() === "") {
      setExpYearError("Expiry year is required.");
      isValid = false;
    } else if (!/^\d{2}$/.test(expYear)) {
      setExpYearError("Year must be 2 digits.");
      isValid = false;
    }

    if (cvv.trim() === "") {
      setCvvError("CVV is required.");
      isValid = false;
    } else if (!/^\d{3}$/.test(cvv)) {
      setCvvError("CVV must be exactly 3 digits.");
      isValid = false;
    }

    if (!isValid) return;

    const newCard = {
      id: Date.now(),
      type: cardType,
      number: cleanNumber,
      name: cardName.trim(),
      balance: Number(cardBalance),
      month: expMonth,
      year: expYear,
      primary: primaryCard,
    };

    addCard(newCard);
    renderCards();

    setCardType("");
    setCardNumber("");
    setCardName("");
    setCardBalance("");
    setExpMonth("");
    setExpYear("");
    setCvv("");
    setPrimaryCard(false);
  };

  const handleCashSubmit = (event) => {
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

    setCash(Number(cashAmount));
    renderCash();
    setCashAmount("");
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
            <a href="/dashboard" className="navItem">
              Dashboard
            </a>
            <a href="/transactions" className="navItem">
              Transactions
            </a>
            <a href="/budget" className="navItem">
              Budget
            </a>
            <a href="/analytics" className="navItem">
              Analytics
            </a>
            <a href="/cards" className="navItem active">
              Cards
            </a>
            <a href="/notifications" className="navItem">
              Notifications
            </a>
            <a href="/profile-view" className="navItem">
              Account Settings
            </a>
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
                Manage your saved cards and available cash balance.
              </p>
            </div>
          </header>

          <section className="transactionsTopGrid">
            <article className="dashboardPanel">
              <div className="panelHeader">
                <h2>Add New Card</h2>
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
                    <label htmlFor="card-name">Cardholder Name</label>
                    <input
                      type="text"
                      id="card-name"
                      placeholder="Enter cardholder name"
                      value={cardName}
                      onChange={(e) => {
                        setCardName(e.target.value);
                        setCardNameError("");
                      }}
                      className={cardNameError ? "inputError" : ""}
                    />
                    <small className="errorMsg">{cardNameError}</small>
                  </div>

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
                </div>

                <div className="settingsGrid">
                  <div className="inputGroup">
                    <label htmlFor="exp-month">Exp. Month</label>
                    <input
                      type="text"
                      id="exp-month"
                      placeholder="MM"
                      value={expMonth}
                      onChange={(e) => {
                        setExpMonth(e.target.value);
                        setExpMonthError("");
                      }}
                      className={expMonthError ? "inputError" : ""}
                    />
                    <small className="errorMsg">{expMonthError}</small>
                  </div>

                  <div className="inputGroup">
                    <label htmlFor="exp-year">Exp. Year</label>
                    <input
                      type="text"
                      id="exp-year"
                      placeholder="YY"
                      value={expYear}
                      onChange={(e) => {
                        setExpYear(e.target.value);
                        setExpYearError("");
                      }}
                      className={expYearError ? "inputError" : ""}
                    />
                    <small className="errorMsg">{expYearError}</small>
                  </div>
                </div>

                <div className="settingsGrid">
                  <div className="inputGroup">
                    <label htmlFor="cvv">CVV / CVC</label>
                    <input
                      type="text"
                      id="cvv"
                      placeholder="3 digits"
                      value={cvv}
                      onChange={(e) => {
                        setCvv(e.target.value);
                        setCvvError("");
                      }}
                      className={cvvError ? "inputError" : ""}
                    />
                    <small className="errorMsg">{cvvError}</small>
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
                    key={card.id}
                    className={`savedCard ${
                      card.type === "Visa"
                        ? "savedVisa"
                        : card.type === "Mastercard"
                        ? "savedMastercard"
                        : card.type === "Mada"
                        ? "savedMada"
                        : ""
                    }`}
                  >
                    <div className="savedCardTop">
                      <span className="savedCardBrand">{card.type}</span>
                      {card.primary && (
                        <span className="primaryBadge">Primary</span>
                      )}
                    </div>
                    <div className="savedCardNumber">
                      {formatCardNumber(card.number)}
                    </div>
                    <div className="savedCardBottom">
                      <div>
                        <div className="savedCardName">{card.name}</div>
                        <div className="savedCardExpiry">
                          Exp: {card.month}/{card.year}
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