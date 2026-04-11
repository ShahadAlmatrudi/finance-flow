const appData = getAppData();

if (!appData.user) {
    window.location.href = "signup.html";
}

const sidebarUserName = document.getElementById("sidebarUserName");
const sidebarAvatar = document.getElementById("sidebarAvatar");
const logoutBtn = document.getElementById("logoutBtn");

const savingTargetText = document.getElementById("savingTargetText");
const cashStatusText = document.getElementById("cashStatusText");
const cardsStatusText = document.getElementById("cardsStatusText");
const categoriesStatusText = document.getElementById("categoriesStatusText");

const savingTargetBar = document.getElementById("savingTargetBar");
const cashStatusBar = document.getElementById("cashStatusBar");
const cardsStatusBar = document.getElementById("cardsStatusBar");
const categoriesStatusBar = document.getElementById("categoriesStatusBar");

const categoryManagerList = document.getElementById("categoryManagerList");
const addCategoryForm = document.getElementById("addCategoryForm");
const newCategoryName = document.getElementById("newCategoryName");
const newCategoryLimit = document.getElementById("newCategoryLimit");
const addCategoryError = document.getElementById("addCategoryError");

const accountBalanceList = document.getElementById("accountBalanceList");
const cashUpdateForm = document.getElementById("cashUpdateForm");
const updatedCashAmount = document.getElementById("updatedCashAmount");
const cashUpdateError = document.getElementById("cashUpdateError");

const budgetGoalType = document.getElementById("budgetGoalType");
const budgetGoalName = document.getElementById("budgetGoalName");
const budgetGoalTarget = document.getElementById("budgetGoalTarget");
const budgetGoalDate = document.getElementById("budgetGoalDate");
const budgetGoalSaving = document.getElementById("budgetGoalSaving");

const resetUsageBtn = document.getElementById("resetUsageBtn");

const fullName = appData.user?.fullname || "User";
const initials = fullName
    .split(" ")
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

sidebarUserName.textContent = fullName;
sidebarAvatar.textContent = initials || "U";

initializeBudgetData();
renderBudgetPage();

addCategoryForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addCategoryError.textContent = "";
    newCategoryName.classList.remove("inputError");
    newCategoryLimit.classList.remove("inputError");

    const name = newCategoryName.value.trim();
    const limit = Number(newCategoryLimit.value);

    if (name === "") {
        addCategoryError.textContent = "Category name is required.";
        newCategoryName.classList.add("inputError");
        return;
    }

    if (!newCategoryLimit.value || limit <= 0) {
        addCategoryError.textContent = "Enter a valid category limit.";
        newCategoryLimit.classList.add("inputError");
        return;
    }

    const data = getAppData();

    if (!data.plan) {
        data.plan = {};
    }

    if (!Array.isArray(data.plan.categories)) {
        data.plan.categories = [];
    }

    const exists = data.plan.categories.some(
        category => category.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
        addCategoryError.textContent = "This category already exists.";
        newCategoryName.classList.add("inputError");
        return;
    }

    data.plan.categories.push({
        name,
        limit,
        spent: 0
    });

    saveAppData(data);
    newCategoryName.value = "";
    newCategoryLimit.value = "";
    renderBudgetPage();
});

cashUpdateForm.addEventListener("submit", function (event) {
    event.preventDefault();
    cashUpdateError.textContent = "";
    updatedCashAmount.classList.remove("inputError");

    const newCash = Number(updatedCashAmount.value);

    if (updatedCashAmount.value === "" || newCash < 0) {
        cashUpdateError.textContent = "Enter a valid cash amount.";
        updatedCashAmount.classList.add("inputError");
        return;
    }

    setCash(newCash);
    updatedCashAmount.value = "";
    renderBudgetPage();
});

resetUsageBtn.addEventListener("click", function () {
    const data = getAppData();

    if (data.plan?.categories?.length) {
        data.plan.categories = data.plan.categories.map(category => ({
            ...category,
            spent: 0
        }));

        saveAppData(data);
        renderBudgetPage();
    }
});

logoutBtn.addEventListener("click", function () {
    const shouldLogout = confirm("Are you sure you want to log out?");

    if (shouldLogout) {
        localStorage.removeItem("financeFlowData");
        window.location.href = "signup.html";
    }
});

function initializeBudgetData() {
    const data = getAppData();

    if (data.plan?.categories?.length) {
        let changed = false;

        data.plan.categories = data.plan.categories.map(category => {
            if (typeof category.spent !== "number") {
                changed = true;
                return {
                    ...category,
                    spent: 0
                };
            }

            return category;
        });

        if (changed) {
            saveAppData(data);
        }
    }
}

function renderBudgetPage() {
    const data = getAppData();
    const plan = data.plan || {};
    const cards = data.cards || [];
    const cash = Number(data.cash || 0);
    const categories = plan.categories || [];

    renderTopStatus(plan, cards, cash, categories);
    renderCategoryManager(categories);
    renderAccounts(cards, cash);
    renderGoal(plan);
}

function renderTopStatus(plan, cards, cash, categories) {
    const savingAmount = Number(plan.monthlySaving || 0);
    const targetAmount = Number(plan.targetAmount || 0);

    savingTargetText.textContent = formatMoney(savingAmount);
    cashStatusText.textContent = formatMoney(cash);
    cardsStatusText.textContent = `${cards.length} card${cards.length !== 1 ? "s" : ""}`;
    categoriesStatusText.textContent = `${categories.length} categor${categories.length === 1 ? "y" : "ies"}`;

    const savingWidth = targetAmount > 0
        ? Math.min((savingAmount / targetAmount) * 100, 100)
        : (savingAmount > 0 ? 100 : 0);

    const cashWidth = Math.min(cash / 5000 * 100, 100);
    const cardsWidth = Math.min(cards.length * 25, 100);
    const categoriesWidth = Math.min(categories.length * 18, 100);

    savingTargetBar.style.width = `${savingWidth}%`;
    cashStatusBar.style.width = `${cashWidth}%`;
    cardsStatusBar.style.width = `${cardsWidth}%`;
    categoriesStatusBar.style.width = `${categoriesWidth}%`;
}

function renderCategoryManager(categories) {
    if (!categories.length) {
        categoryManagerList.innerHTML = `
            <div class="emptyPanelState">
                No categories added yet. Add your first category below.
            </div>
        `;
        return;
    }

    categoryManagerList.innerHTML = "";

    categories.forEach((category, index) => {
        const item = document.createElement("div");
        item.className = "categoryManagerItem";

        const spent = Number(category.spent || 0);
        const limit = Number(category.limit || 0);
        const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

        item.innerHTML = `
            <div class="categoryManagerTop">
                <div>
                    <h3>${category.name}</h3>
                    <p>${formatMoney(spent)} spent of ${formatMoney(limit)}</p>
                </div>

                <div class="categoryManagerActions">
                    <button type="button" class="secondaryBtn smallBtn editLimitBtn" data-index="${index}">
                        Edit
                    </button>
                    <button type="button" class="dangerGhostBtn smallBtn deleteCategoryBtn" data-index="${index}">
                        Delete
                    </button>
                </div>
            </div>

            <div class="categoryBar">
                <div class="categoryBarFill" style="width: ${percent}%"></div>
            </div>

            <div class="categoryManagerBottom">
                <span>${Math.round(percent)}% used</span>
                <span>${formatMoney(limit - spent)} left</span>
            </div>
        `;

        categoryManagerList.appendChild(item);
    });

    attachCategoryButtons();
}

function attachCategoryButtons() {
    const editButtons = document.querySelectorAll(".editLimitBtn");
    const deleteButtons = document.querySelectorAll(".deleteCategoryBtn");

    editButtons.forEach(button => {
        button.addEventListener("click", function () {
            const index = Number(button.dataset.index);
            const data = getAppData();
            const category = data.plan.categories[index];

            const newLimit = prompt(`Enter new limit for ${category.name}:`, category.limit);

            if (newLimit === null) return;

            const numericLimit = Number(newLimit);

            if (!newLimit || numericLimit <= 0) {
                alert("Please enter a valid limit greater than 0.");
                return;
            }

            data.plan.categories[index].limit = numericLimit;

            if (data.plan.categories[index].spent > numericLimit) {
                data.plan.categories[index].spent = numericLimit;
            }

            saveAppData(data);
            renderBudgetPage();
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const index = Number(button.dataset.index);
            const data = getAppData();
            const categoryName = data.plan.categories[index].name;

            const confirmed = confirm(`Delete category "${categoryName}"?`);

            if (!confirmed) return;

            data.plan.categories.splice(index, 1);
            saveAppData(data);
            renderBudgetPage();
        });
    });
}

function renderAccounts(cards, cash) {
    accountBalanceList.innerHTML = "";

    if (!cards.length && cash === 0) {
        accountBalanceList.innerHTML = `
            <div class="emptyPanelState">
                No cash or cards saved yet.
            </div>
        `;
        return;
    }

    if (cards.length) {
        cards.forEach(card => {
            const item = document.createElement("div");
            item.className = "accountRow";

            item.innerHTML = `
                <div class="accountLeft">
                    <div class="accountIcon">💳</div>
                    <div>
                        <h4>${card.name}</h4>
                        <p>${card.type} •••• ${card.number.slice(-4)} ${card.primary ? "• Primary" : ""}</p>
                    </div>
                </div>
                <div class="accountAmount">${formatMoney(card.balance || 0)}</div>
            `;

            accountBalanceList.appendChild(item);
        });
    }

    const cashRow = document.createElement("div");
    cashRow.className = "accountRow";

    cashRow.innerHTML = `
        <div class="accountLeft">
            <div class="accountIcon">💵</div>
            <div>
                <h4>Cash</h4>
                <p>Available balance</p>
            </div>
        </div>
        <div class="accountAmount">${formatMoney(cash)}</div>
    `;

    accountBalanceList.appendChild(cashRow);
}

function renderGoal(plan) {
    budgetGoalType.textContent = plan.goalType || "No goal type";
    budgetGoalName.textContent = plan.goalName || "No goal set yet";
    budgetGoalTarget.textContent = `Target amount: ${formatMoney(plan.targetAmount || 0)}`;
    budgetGoalDate.textContent = `Target date: ${plan.targetDate ? formatDate(plan.targetDate) : "--"}`;
    budgetGoalSaving.textContent = `Monthly saving: ${formatMoney(plan.monthlySaving || 0)}`;
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