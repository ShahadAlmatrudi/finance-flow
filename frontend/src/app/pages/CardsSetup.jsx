import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCard, getAppData, setCash } from "../utils/storage";

export default function CardsSetup() {
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [cash, setCashState] = useState(null);

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
    renderData();
  }, []);

  const renderData = () => {
    const data = getAppData();
    setCards(data.cards || []);
    setCashState(data.cash);
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
    renderData();

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
    renderData();
    setCashAmount("");
  };

  const formatCardNumber = (number) => {
    return `•••• •••• •••• ${number.slice(-4)}`;
  };

  const formatMoney = (amount) => {
    return `$${Number(amount).toLocaleString()}`;
  };

  return (
    <div className="flowPage">
      <main className="flowWrapper">
        <section className="formCard extraLargeCard cardsPageCard">
          <div className="stepHeader centerHeader">
            <span className="stepTag">Step 4 of 5</span>
            <h1 className="pageTitle">Add Your Cards & Cash</h1>
            <p className="pageSubtitle">
              Add your payment methods and current cash amount now. You can also
              manage them later.
            </p>
          </div>

          <div className="cardSection">
            <h2 className="subSectionTitle">Saved Cards</h2>
            <div className="cardsPreview">
              {cards.length === 0 ? (
                <div className="emptyState">
                  No cards added yet. Add your first card below.
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
          </div>

          <form onSubmit={handleCardSubmit} className="cardSection">
            <h2 className="subSectionTitle">Add New Card</h2>

            <div className="formRow">
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

            <div className="formRow">
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
                    id="primary-card"
                    checked={primaryCard}
                    onChange={(e) => setPrimaryCard(e.target.checked)}
                  />
                  Set as primary card
                </label>
              </div>
            </div>

            <div className="formRow">
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

            <div className="formRow">
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
            </div>

            <div className="actionRow leftActions">
              <button className="smallPrimaryBtn" type="submit">
                Save Card
              </button>
            </div>
          </form>

          <form onSubmit={handleCashSubmit} className="cardSection">
            <h2 className="subSectionTitle">Add Cash Amount</h2>

            <div className="cashRow">
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

              <div className="cashSaveBtnWrap">
                <button className="smallPrimaryBtn" type="submit">
                  Save Cash
                </button>
              </div>
            </div>

            <div className="cashDisplay">
              {cash === 0 || cash === null || cash === undefined
                ? "No cash amount saved yet."
                : `Saved Cash Amount: ${formatMoney(cash)}`}
            </div>
          </form>

          <div className="actionRow dualButtons">
            <button
              type="button"
              className="secondaryBtn"
              onClick={() => navigate("/welcome")}
            >
              Skip
            </button>
            <button
              type="button"
              className="primaryBtn"
              onClick={() => navigate("/welcome")}
            >
              Next
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}