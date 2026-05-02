const appData = getAppData();

if (!appData.user) {
    window.location.href = "signup.html";
}

const dashboardUserName = document.getElementById("dashboardUserName");
const sidebarUserName = document.getElementById("sidebarUserName");
const sidebarAvatar = document.getElementById("sidebarAvatar");
const logoutBtn = document.getElementById("logoutBtn");

const cashAmountCard = document.getElementById("cashAmountCard");
const cardsCountCard = document.getElementById("cardsCountCard");
const primaryCardText = document.getElementById("primaryCardText");
const monthlySavingCard = document.getElementById("monthlySavingCard");
const goalNameCard = document.getElementById("goalNameCard");

const transactionList = document.getElementById("transactionList");
const categoryList = document.getElementById("categoryList");

const incomeProgress = document.getElementById("incomeProgress");
const savingProgress = document.getElementById("savingProgress");
const cardsProgress = document.getElementById("cardsProgress");
const budgetProgress = document.getElementById("budgetProgress");

const incomeStatusText = document.getElementById("incomeStatusText");
const savingProgressText = document.getElementById("savingProgressText");
const cardsProgressText = document.getElementById("cardsProgressText");
const budgetProgressText = document.getElementById("budgetProgressText");

const goalTypeText = document.getElementById("goalTypeText");
const goalNameText = document.getElementById("goalNameText");
const goalTargetText = document.getElementById("goalTargetText");
const goalDateText = document.getElementById("goalDateText");

const fullName = appData.user?.fullname || "User";
const firstName = fullName.split(" ")[0];
const initials = fullName
    .split(" ")
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

dashboardUserName.textContent = firstName;
sidebarUserName.textContent = fullName;
sidebarAvatar.textContent = initials || "U";

const cashAmount = Number(appData.cash || 0);
const cards = appData.cards || [];

// Read from plans array, use the latest plan
const plans = appData.plans || [];
const plan = plans.length ? plans[plans.length - 1] : {};

const profile = appData.profile || {};
const transactions = appData.transactions || [];

cashAmountCard.textContent = formatMoney(cashAmount);
cardsCountCard.textContent = cards.length;

const primaryCard = cards.find(card => card.primary);

if (primaryCard) {
    primaryCardText.textContent = `Primary card: ${primaryCard.type} •••• ${primaryCard.number.slice(-4)}`;
} else if (cards.length > 0) {
    primaryCardText.textContent = `Latest card: ${cards[cards.length - 1].type} •••• ${cards[cards.length - 1].number.slice(-4)}`;
} else {
    primaryCardText.textContent = "No primary card set";
}

monthlySavingCard.textContent = formatMoney(plan.monthlySaving || 0);
goalNameCard.textContent = plan.goalName || "No goal yet";
goalTypeText.textContent = plan.goalType || "No goal type";
goalNameText.textContent = plan.goalName || "No goal created yet";
goalTargetText.textContent = `Target amount: ${formatMoney(plan.targetAmount || 0)}`;
goalDateText.textContent = `Target date: ${plan.targetDate ? formatDate(plan.targetDate) : "--"}`;

renderTransactions();
renderCategories();
renderProgress();

logoutBtn.addEventListener("click", function () {
    const shouldLogout = confirm("Are you sure you want to log out?");

    if (shouldLogout) {
        localStorage.removeItem("financeFlowData");
        window.location.href = "signup.html";
    }
});

function renderTransactions() {
    if (!transactions.length) {
        transactionList.innerHTML = `
            <div class="emptyPanelState">
                No transactions yet. Start by adding one from the Transactions page.
            </div>
        `;
        return;
    }

    transactionList.innerHTML = "";

    transactions.slice(0, 5).forEach(transaction => {
        const item = document.createElement("div");
        item.className = "transactionItem";

        item.innerHTML = `
            <div class="transactionLeft">
                <h4>${transaction.title}</h4>
                <p>${transaction.category} • ${transaction.paymentLabel || transaction.paymentMethod} • ${formatDate(transaction.date)}</p>
            </div>
            <div class="transactionRight ${transaction.type === "income" ? "positiveAmount" : "negativeAmount"}">
                ${transaction.type === "income" ? "+" : "-"}${formatMoney(transaction.amount)}
            </div>
        `;

        transactionList.appendChild(item);
    });
}

function renderCategories() {
    const categories = plan.categories || [];

    if (!categories.length) {
        categoryList.innerHTML = `
            <div class="emptyPanelState">
                No categories added yet. Create your budget categories in plan setup.
            </div>
        `;
        return;
    }

    categoryList.innerHTML = "";

    categories.forEach(category => {
        const spent = Number(category.spent || 0);
        const limit = Number(category.limit || 0);
        const remaining = Math.max(0, limit - spent);
        const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

        const item = document.createElement("div");
        item.className = "categoryItem";

        item.innerHTML = `
            <div class="categoryTopRow">
                <span class="categoryName">${category.name}</span>
                <span class="categoryAmounts">${formatMoney(spent)} / ${formatMoney(limit)}</span>
            </div>
            <div class="categoryBar">
                <div class="categoryBarFill" style="width: ${percent}%"></div>
            </div>
            <div class="categoryBottomRow">
                <span>${Math.round(percent)}% used</span>
                <span>${formatMoney(remaining)} left</span>
            </div>
        `;

        categoryList.appendChild(item);
    });
}

function renderProgress() {
    const hasProfile = !!profile && !!profile.salaryRange;
    const savingPercent = plan.monthlySaving
        ? Math.min(Math.round((Number(plan.monthlySaving) / Math.max(Number(plan.targetAmount || plan.monthlySaving), 1)) * 100), 100)
        : 0;
    const cardsPercent = Math.min(cards.length * 30, 100);
    const categoryCount = plan.categories?.length || 0;
    const budgetPercent = Math.min(categoryCount * 20, 100);

    incomeProgress.style.width = hasProfile ? "100%" : "20%";
    savingProgress.style.width = `${savingPercent}%`;
    cardsProgress.style.width = `${cardsPercent}%`;
    budgetProgress.style.width = `${budgetPercent}%`;

    incomeStatusText.textContent = hasProfile ? "Profile complete" : "Profile incomplete";
    savingProgressText.textContent = `${savingPercent}%`;
    cardsProgressText.textContent = `${cards.length} card${cards.length !== 1 ? "s" : ""}`;
    budgetProgressText.textContent = `${categoryCount} categor${categoryCount === 1 ? "y" : "ies"}`;
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