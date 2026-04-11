const appData = getAppData();

if (!appData.user) {
    window.location.href = "signup.html";
}

const sidebarUserName = document.getElementById("sidebarUserName");
const sidebarAvatar = document.getElementById("sidebarAvatar");
const logoutBtn = document.getElementById("logoutBtn");

const cardForm = document.getElementById("cardForm");
const cashForm = document.getElementById("cashForm");
const cardsPreview = document.getElementById("cardsPreview");
const cashDisplay = document.getElementById("cashDisplay");

const cardType = document.getElementById("card-type");
const cardNumber = document.getElementById("card-number");
const cardName = document.getElementById("card-name");
const cardBalance = document.getElementById("card-balance");
const expMonth = document.getElementById("exp-month");
const expYear = document.getElementById("exp-year");
const cvv = document.getElementById("cvv");
const primaryCard = document.getElementById("primary-card");
const cashAmount = document.getElementById("cash-amount");

const cardTypeError = document.getElementById("cardTypeError");
const cardNumberError = document.getElementById("cardNumberError");
const cardNameError = document.getElementById("cardNameError");
const cardBalanceError = document.getElementById("cardBalanceError");
const expMonthError = document.getElementById("expMonthError");
const expYearError = document.getElementById("expYearError");
const cvvError = document.getElementById("cvvError");
const cashError = document.getElementById("cashError");

const fullName = appData.user?.fullname || "User";
const initials = fullName
    .split(" ")
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

sidebarUserName.textContent = fullName;
sidebarAvatar.textContent = initials || "U";

cardForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearCardErrors();

    let isValid = true;

    if (cardType.value === "") {
        showError(cardType, cardTypeError, "Please select a card type.");
        isValid = false;
    }

    const cleanNumber = cardNumber.value.replace(/\s/g, "");

    if (cardNumber.value.trim() === "") {
        showError(cardNumber, cardNumberError, "Card number is required.");
        isValid = false;
    } else if (!/^\d{16}$/.test(cleanNumber)) {
        showError(cardNumber, cardNumberError, "Card number must be exactly 16 digits.");
        isValid = false;
    }

    if (cardName.value.trim() === "") {
        showError(cardName, cardNameError, "Cardholder name is required.");
        isValid = false;
    }

    if (cardBalance.value.trim() === "") {
        showError(cardBalance, cardBalanceError, "Card balance is required.");
        isValid = false;
    } else if (Number(cardBalance.value) < 0) {
        showError(cardBalance, cardBalanceError, "Card balance cannot be negative.");
        isValid = false;
    }

    if (expMonth.value.trim() === "") {
        showError(expMonth, expMonthError, "Expiry month is required.");
        isValid = false;
    } else if (!/^\d{2}$/.test(expMonth.value) || Number(expMonth.value) < 1 || Number(expMonth.value) > 12) {
        showError(expMonth, expMonthError, "Enter a valid month between 01 and 12.");
        isValid = false;
    }

    if (expYear.value.trim() === "") {
        showError(expYear, expYearError, "Expiry year is required.");
        isValid = false;
    } else if (!/^\d{2}$/.test(expYear.value)) {
        showError(expYear, expYearError, "Year must be 2 digits.");
        isValid = false;
    }

    if (cvv.value.trim() === "") {
        showError(cvv, cvvError, "CVV is required.");
        isValid = false;
    } else if (!/^\d{3}$/.test(cvv.value)) {
        showError(cvv, cvvError, "CVV must be exactly 3 digits.");
        isValid = false;
    }

    if (!isValid) return;

    const newCard = {
        id: Date.now(),
        type: cardType.value,
        number: cleanNumber,
        name: cardName.value.trim(),
        balance: Number(cardBalance.value),
        month: expMonth.value,
        year: expYear.value,
        primary: primaryCard.checked
    };

    addCard(newCard);
    renderCards();
    cardForm.reset();
});

cashForm.addEventListener("submit", function (event) {
    event.preventDefault();
    cashError.textContent = "";
    cashAmount.classList.remove("inputError");

    if (cashAmount.value.trim() === "") {
        showError(cashAmount, cashError, "Please enter a cash amount.");
        return;
    }

    if (Number(cashAmount.value) < 0) {
        showError(cashAmount, cashError, "Cash amount cannot be negative.");
        return;
    }

    setCash(Number(cashAmount.value));
    renderCash();
    cashForm.reset();
});

logoutBtn.addEventListener("click", function () {
    const shouldLogout = confirm("Are you sure you want to log out?");

    if (shouldLogout) {
        localStorage.removeItem("financeFlowData");
        window.location.href = "signup.html";
    }
});

function renderCards() {
    const data = getAppData();
    cardsPreview.innerHTML = "";

    if (!data.cards || data.cards.length === 0) {
        cardsPreview.innerHTML = `
            <div class="emptyState">
                No cards added yet. Add your first card above.
            </div>
        `;
        return;
    }

    data.cards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("savedCard");

        if (card.type === "Visa") {
            cardElement.classList.add("savedVisa");
        } else if (card.type === "Mastercard") {
            cardElement.classList.add("savedMastercard");
        } else if (card.type === "Mada") {
            cardElement.classList.add("savedMada");
        }

        cardElement.innerHTML = `
            <div class="savedCardTop">
                <span class="savedCardBrand">${card.type}</span>
                ${card.primary ? '<span class="primaryBadge">Primary</span>' : ''}
            </div>
            <div class="savedCardNumber">${formatCardNumber(card.number)}</div>
            <div class="savedCardBottom">
                <div>
                    <div class="savedCardName">${card.name}</div>
                    <div class="savedCardExpiry">Exp: ${card.month}/${card.year}</div>
                </div>
                <div class="savedCardExpiry">Balance: ${formatMoney(card.balance || 0)}</div>
            </div>
        `;

        cardsPreview.appendChild(cardElement);
    });
}

function renderCash() {
    const data = getAppData();

    if (data.cash === 0 || data.cash === null) {
        cashDisplay.textContent = "No cash amount saved yet.";
    } else {
        cashDisplay.textContent = `Saved Cash Amount: ${formatMoney(data.cash)}`;
    }
}

function formatCardNumber(number) {
    return `•••• •••• •••• ${number.slice(-4)}`;
}

function formatMoney(amount) {
    return `$${Number(amount).toLocaleString()}`;
}

function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.classList.add("inputError");
}

function clearCardErrors() {
    document.querySelectorAll("#cardForm .errorMsg").forEach(error => {
        error.textContent = "";
    });

    document.querySelectorAll("#cardForm input, #cardForm select").forEach(field => {
        field.classList.remove("inputError");
    });
}

document.querySelectorAll("input, select").forEach(field => {
    field.addEventListener("input", function () {
        field.classList.remove("inputError");
        const error = field.parentElement.querySelector(".errorMsg");
        if (error) error.textContent = "";
    });

    field.addEventListener("change", function () {
        field.classList.remove("inputError");
        const error = field.parentElement.querySelector(".errorMsg");
        if (error) error.textContent = "";
    });
});

renderCards();
renderCash();