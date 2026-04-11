const data = getAppData();

if (!data.user) {
    window.location.href = "signup.html";
}

const sidebarUserName = document.getElementById("sidebarUserName");
const sidebarAvatar = document.getElementById("sidebarAvatar");
const logoutBtn = document.getElementById("logoutBtn");

const transactionForm = document.getElementById("transactionForm");
const transactionTitle = document.getElementById("transactionTitle");
const transactionAmount = document.getElementById("transactionAmount");
const transactionType = document.getElementById("transactionType");
const transactionCategory = document.getElementById("transactionCategory");
const transactionPaymentMethod = document.getElementById("transactionPaymentMethod");
const transactionDate = document.getElementById("transactionDate");
const transactionNotes = document.getElementById("transactionNotes");

const transactionTitleError = document.getElementById("transactionTitleError");
const transactionAmountError = document.getElementById("transactionAmountError");
const transactionTypeError = document.getElementById("transactionTypeError");
const transactionCategoryError = document.getElementById("transactionCategoryError");
const transactionPaymentMethodError = document.getElementById("transactionPaymentMethodError");
const transactionDateError = document.getElementById("transactionDateError");
const transactionSuccessMsg = document.getElementById("transactionSuccessMsg");

const totalTransactionsValue = document.getElementById("totalTransactionsValue");
const totalIncomeValue = document.getElementById("totalIncomeValue");
const totalExpensesValue = document.getElementById("totalExpensesValue");
const currentCashValue = document.getElementById("currentCashValue");

const transactionsList = document.getElementById("transactionsList");
const transactionSearch = document.getElementById("transactionSearch");
const transactionFilter = document.getElementById("transactionFilter");

initializePage();
attachEvents();

function initializePage() {
    normalizeData();
    fillSidebarUser();
    setTodayDate();
    populateCategoryOptions();
    populatePaymentMethodOptions();
    renderSummary();
    renderTransactionsList();
}

function attachEvents() {
    transactionForm.addEventListener("submit", function (event) {
        event.preventDefault();
        clearTransactionErrors();
        transactionSuccessMsg.textContent = "";

        let isValid = true;

        if (transactionTitle.value.trim() === "") {
            showError(transactionTitle, transactionTitleError, "Transaction title is required.");
            isValid = false;
        }

        if (transactionAmount.value.trim() === "") {
            showError(transactionAmount, transactionAmountError, "Amount is required.");
            isValid = false;
        } else if (Number(transactionAmount.value) <= 0) {
            showError(transactionAmount, transactionAmountError, "Amount must be greater than 0.");
            isValid = false;
        }

        if (transactionType.value === "") {
            showError(transactionType, transactionTypeError, "Please select a transaction type.");
            isValid = false;
        }

        if (transactionCategory.value === "") {
            showError(transactionCategory, transactionCategoryError, "Please select a category.");
            isValid = false;
        }

        if (transactionPaymentMethod.value === "") {
            showError(transactionPaymentMethod, transactionPaymentMethodError, "Please select a payment method.");
            isValid = false;
        }

        if (transactionDate.value === "") {
            showError(transactionDate, transactionDateError, "Please select a date.");
            isValid = false;
        }

        if (!isValid) return;

        const appData = getAppData();
        const amount = Number(transactionAmount.value);

        const newTransaction = {
            id: Date.now(),
            title: transactionTitle.value.trim(),
            amount,
            type: transactionType.value,
            category: transactionCategory.value,
            paymentMethod: transactionPaymentMethod.value,
            paymentLabel: getPaymentMethodLabel(transactionPaymentMethod.value, appData.cards || []),
            date: transactionDate.value,
            notes: transactionNotes.value.trim()
        };

        const result = applyTransactionEffect(appData, newTransaction);

        if (!result.success) {
            alert(result.message);
            return;
        }

        if (!Array.isArray(appData.transactions)) {
            appData.transactions = [];
        }

        appData.transactions.unshift(newTransaction);
        saveAppData(appData);

        transactionForm.reset();
        setTodayDate();
        populateCategoryOptions();
        populatePaymentMethodOptions();
        renderSummary();
        renderTransactionsList();

        transactionSuccessMsg.textContent = "Transaction saved successfully.";
    });

    transactionSearch.addEventListener("input", renderTransactionsList);
    transactionFilter.addEventListener("change", renderTransactionsList);

    logoutBtn.addEventListener("click", function () {
        const shouldLogout = confirm("Are you sure you want to log out?");

        if (shouldLogout) {
            localStorage.removeItem("financeFlowData");
            window.location.href = "signup.html";
        }
    });

    document.querySelectorAll("input, select, textarea").forEach((field) => {
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
}

function normalizeData() {
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

    if (appData.plan.categories.length === 0 && Array.isArray(appData.questionnaire?.categories)) {
        appData.plan.categories = appData.questionnaire.categories.map((name) => ({
            name,
            limit: 0,
            spent: 0
        }));
    }

    appData.plan.categories = appData.plan.categories.map((category) => ({
        ...category,
        name: category.name,
        limit: Number(category.limit || 0),
        spent: Number(category.spent || 0)
    }));

    appData.cards = appData.cards.map((card) => ({
        ...card,
        balance: Number(card.balance || 0)
    }));

    saveAppData(appData);
}

function fillSidebarUser() {
    const appData = getAppData();
    const fullName = appData.user?.fullname || appData.user?.name || "User";

    const initials = fullName
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U";

    sidebarUserName.textContent = fullName;
    sidebarAvatar.textContent = initials;
}

function populateCategoryOptions() {
    const appData = getAppData();
    const categories = appData.plan?.categories || [];

    transactionCategory.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select category";
    transactionCategory.appendChild(placeholder);

    if (categories.length === 0) {
        const fallback = document.createElement("option");
        fallback.value = "General";
        fallback.textContent = "General";
        transactionCategory.appendChild(fallback);
        return;
    }

    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.name;
        option.textContent = category.name;
        transactionCategory.appendChild(option);
    });
}

function populatePaymentMethodOptions() {
    const appData = getAppData();
    const cards = appData.cards || [];
    const cash = Number(appData.cash || 0);

    transactionPaymentMethod.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select payment method";
    transactionPaymentMethod.appendChild(placeholder);

    const cashOption = document.createElement("option");
    cashOption.value = "cash";
    cashOption.textContent = `Cash (${formatMoney(cash)})`;
    transactionPaymentMethod.appendChild(cashOption);

    cards.forEach((card) => {
        const option = document.createElement("option");
        option.value = `card:${card.id}`;
        option.textContent = `${card.type} •••• ${card.number.slice(-4)} (${formatMoney(card.balance)})${card.primary ? " - Primary" : ""}`;
        transactionPaymentMethod.appendChild(option);
    });
}

function applyTransactionEffect(appData, transaction) {
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

    let category = appData.plan.categories.find((item) => item.name === transaction.category);

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
                    message: "Not enough cash balance for this transaction."
                };
            }

            appData.cash = currentCash - amount;
        } else if (transaction.paymentMethod.startsWith("card:")) {
            const cardId = Number(transaction.paymentMethod.split(":")[1]);
            const card = appData.cards.find((item) => Number(item.id) === cardId);

            if (!card) {
                return {
                    success: false,
                    message: "Selected card was not found."
                };
            }

            if (Number(card.balance || 0) < amount) {
                return {
                    success: false,
                    message: "Not enough balance in the selected card."
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
                    message: "Selected card was not found."
                };
            }

            card.balance = Number(card.balance || 0) + amount;
        }
    }

    return { success: true };
}

function reverseTransactionEffect(appData, transaction) {
    const amount = Number(transaction.amount);

    const category = appData.plan?.categories?.find((item) => item.name === transaction.category);

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
}

function renderSummary() {
    const appData = getAppData();
    const transactions = appData.transactions || [];

    const totalIncome = transactions
        .filter((item) => item.type === "income")
        .reduce((sum, item) => sum + Number(item.amount), 0);

    const totalExpenses = transactions
        .filter((item) => item.type === "expense")
        .reduce((sum, item) => sum + Number(item.amount), 0);

    totalTransactionsValue.textContent = transactions.length;
    totalIncomeValue.textContent = formatMoney(totalIncome);
    totalExpensesValue.textContent = formatMoney(totalExpenses);
    currentCashValue.textContent = formatMoney(Number(appData.cash || 0));
}

function renderTransactionsList() {
    const appData = getAppData();
    let transactions = appData.transactions || [];

    const searchValue = transactionSearch.value.trim().toLowerCase();
    const filterValue = transactionFilter.value;

    if (filterValue !== "all") {
        transactions = transactions.filter((item) => item.type === filterValue);
    }

    if (searchValue !== "") {
        transactions = transactions.filter((item) =>
            item.title.toLowerCase().includes(searchValue)
        );
    }

    if (transactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="emptyPanelState">
                No transactions found.
            </div>
        `;
        return;
    }

    transactionsList.innerHTML = "";

    transactions.forEach((transaction) => {
        const item = document.createElement("div");
        item.className = "transactionCardItem";

        item.innerHTML = `
            <div class="transactionCardLeft">
                <div class="transactionTypeIcon ${transaction.type === "income" ? "incomeIcon" : "expenseIcon"}">
                    ${transaction.type === "income" ? "↗" : "↘"}
                </div>

                <div class="transactionCardContent">
                    <h3>${transaction.title}</h3>
                    <p>${transaction.category} • ${transaction.paymentLabel || transaction.paymentMethod} • ${formatDate(transaction.date)}</p>
                    ${transaction.notes ? `<small>${transaction.notes}</small>` : ""}
                </div>
            </div>

            <div class="transactionCardRight">
                <strong class="${transaction.type === "income" ? "positiveAmount" : "negativeAmount"}">
                    ${transaction.type === "income" ? "+" : "-"}${formatMoney(transaction.amount)}
                </strong>
                <button type="button" class="dangerGhostBtn smallBtn deleteTransactionBtn" data-id="${transaction.id}">
                    Delete
                </button>
            </div>
        `;

        transactionsList.appendChild(item);
    });

    attachDeleteButtons();
}

function attachDeleteButtons() {
    const deleteButtons = document.querySelectorAll(".deleteTransactionBtn");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const id = Number(button.dataset.id);
            const appData = getAppData();
            const transactionToDelete = appData.transactions.find((item) => Number(item.id) === id);

            if (!transactionToDelete) return;

            const confirmed = confirm(`Delete transaction "${transactionToDelete.title}"?`);

            if (!confirmed) return;

            reverseTransactionEffect(appData, transactionToDelete);
            appData.transactions = appData.transactions.filter((item) => Number(item.id) !== id);

            saveAppData(appData);
            refreshFormOptions();
            renderSummary();
            renderTransactionsList();
        });
    });
}

function refreshFormOptions() {
    populateCategoryOptions();
    populatePaymentMethodOptions();
    fillSidebarUser();
}

function getPaymentMethodLabel(value, cards) {
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
}

function setTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    transactionDate.value = `${year}-${month}-${day}`;
}

function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.classList.add("inputError");
}

function clearTransactionErrors() {
    [
        transactionTitleError,
        transactionAmountError,
        transactionTypeError,
        transactionCategoryError,
        transactionPaymentMethodError,
        transactionDateError
    ].forEach((error) => {
        error.textContent = "";
    });

    [
        transactionTitle,
        transactionAmount,
        transactionType,
        transactionCategory,
        transactionPaymentMethod,
        transactionDate
    ].forEach((field) => {
        field.classList.remove("inputError");
    });
}

function formatMoney(amount) {
    return `$${Number(amount).toLocaleString()}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}