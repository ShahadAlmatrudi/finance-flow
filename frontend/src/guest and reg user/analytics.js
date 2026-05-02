const appData = getAppData();

if (!appData.user) {
    window.location.href = "signup.html";
}

const sidebarUserName = document.getElementById("sidebarUserName");
const sidebarAvatar = document.getElementById("sidebarAvatar");
const logoutBtn = document.getElementById("logoutBtn");

const analyticsTotalSpending = document.getElementById("analyticsTotalSpending");
const analyticsTopCategory = document.getElementById("analyticsTopCategory");
const analyticsTopCategoryAmount = document.getElementById("analyticsTopCategoryAmount");
const analyticsGoalProgress = document.getElementById("analyticsGoalProgress");
const analyticsGoalName = document.getElementById("analyticsGoalName");
const analyticsSavingPlan = document.getElementById("analyticsSavingPlan");

const analyticsCategoryList = document.getElementById("analyticsCategoryList");
const analyticsInsightsList = document.getElementById("analyticsInsightsList");
const analyticsPerformanceList = document.getElementById("analyticsPerformanceList");
const analyticsSnapshotList = document.getElementById("analyticsSnapshotList");

const fullName = appData.user?.fullname || "User";
const initials = fullName
    .split(" ")
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

sidebarUserName.textContent = fullName;
sidebarAvatar.textContent = initials || "U";

initializeAnalyticsData();
renderAnalyticsPage();

logoutBtn.addEventListener("click", function () {
    const shouldLogout = confirm("Are you sure you want to log out?");

    if (shouldLogout) {
        localStorage.removeItem("financeFlowData");
        window.location.href = "signup.html";
    }
});

function initializeAnalyticsData() {
    const data = getAppData();
    const plans = data.plans || [];
    const latestPlan = plans.length ? plans[plans.length - 1] : null;

    if (latestPlan?.categories?.length) {
        let changed = false;

        latestPlan.categories = latestPlan.categories.map(category => {
            if (typeof category.spent !== "number") {
                changed = true;
                return {
                    ...category,
                    spent: generateDemoSpent(category.limit)
                };
            }

            return category;
        });

        if (changed) {
            // Update the plan inside the plans array
            data.plans[data.plans.length - 1] = latestPlan;
            saveAppData(data);
        }
    }
}

function renderAnalyticsPage() {
    const data = getAppData();
    const plans = data.plans || [];
    const plan = plans.length ? plans[plans.length - 1] : {};
    const profile = data.profile || {};
    const cards = data.cards || [];
    const cash = Number(data.cash || 0);
    const categories = plan.categories || [];

    const totalSpending = categories.reduce((sum, category) => sum + Number(category.spent || 0), 0);
    const highestCategory = getHighestCategory(categories);
    const goalProgressPercent = getGoalProgress(plan);

    analyticsTotalSpending.textContent = formatMoney(totalSpending);

    if (highestCategory) {
        analyticsTopCategory.textContent = highestCategory.name;
        analyticsTopCategoryAmount.textContent = `${formatMoney(highestCategory.spent)} used`;
    } else {
        analyticsTopCategory.textContent = "None";
        analyticsTopCategoryAmount.textContent = "$0 used";
    }

    analyticsGoalProgress.textContent = `${goalProgressPercent}%`;
    analyticsGoalName.textContent = plan.goalName || "No goal set";
    analyticsSavingPlan.textContent = formatMoney(plan.monthlySaving || 0);

    renderCategoryBreakdown(categories);
    renderInsights(categories, plan, profile, cards, cash);
    renderPerformance(categories);
    renderSnapshot(plan, profile, cards, cash, totalSpending);
}

function renderCategoryBreakdown(categories) {
    if (!categories.length) {
        analyticsCategoryList.innerHTML = `
            <div class="emptyPanelState">
                No category data yet. Add categories in your budget setup first.
            </div>
        `;
        return;
    }

    analyticsCategoryList.innerHTML = "";

    categories.forEach(category => {
        const spent = Number(category.spent || 0);
        const limit = Number(category.limit || 0);
        const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

        const item = document.createElement("div");
        item.className = "analyticsCategoryItem";

        item.innerHTML = `
            <div class="analyticsCategoryTop">
                <div>
                    <h3>${category.name}</h3>
                    <p>${formatMoney(spent)} spent out of ${formatMoney(limit)}</p>
                </div>
                <div class="analyticsCategoryPercent">${Math.round(percent)}%</div>
            </div>

            <div class="analyticsBar">
                <div class="analyticsBarFill" style="width: ${percent}%"></div>
            </div>

            <div class="analyticsCategoryBottom">
                <span>${formatMoney(limit - spent)} remaining</span>
                <span>${getCategoryStatus(percent)}</span>
            </div>
        `;

        analyticsCategoryList.appendChild(item);
    });
}

function renderInsights(categories, plan, profile, cards, cash) {
    const insights = [];

    if (categories.length > 0) {
        const highestCategory = getHighestCategory(categories);
        const lowestCategory = getLowestCategory(categories);

        if (highestCategory) {
            insights.push({
                title: "Highest spending area",
                text: `${highestCategory.name} is currently your highest spending category.`
            });
        }

        if (lowestCategory) {
            insights.push({
                title: "Most controlled category",
                text: `${lowestCategory.name} currently has the lowest spending level.`
            });
        }

        const nearLimitCategories = categories.filter(category => {
            const spent = Number(category.spent || 0);
            const limit = Number(category.limit || 0);
            return limit > 0 && (spent / limit) >= 0.8;
        });

        if (nearLimitCategories.length > 0) {
            insights.push({
                title: "Limit warning",
                text: `${nearLimitCategories[0].name} is close to reaching its budget limit.`
            });
        }
    }

    if (plan.monthlySaving) {
        insights.push({
            title: "Saving commitment",
            text: `You are planning to save ${formatMoney(plan.monthlySaving)} every month.`
        });
    }

    if (cards.length > 0) {
        insights.push({
            title: "Payment setup",
            text: `You have ${cards.length} saved card${cards.length > 1 ? "s" : ""} connected to your account.`
        });
    }

    if (cash > 0) {
        insights.push({
            title: "Cash availability",
            text: `Your current cash balance gives you ${formatMoney(cash)} in flexible spending power.`
        });
    }

    if (profile.salaryRange) {
        insights.push({
            title: "Income profile",
            text: `Your selected income range is ${profile.salaryRange}.`
        });
    }

    analyticsInsightsList.innerHTML = "";

    if (insights.length === 0) {
        analyticsInsightsList.innerHTML = `
            <div class="emptyPanelState">
                No insights yet. Complete more setup steps to unlock analytics.
            </div>
        `;
        return;
    }

    insights.slice(0, 5).forEach(insight => {
        const item = document.createElement("div");
        item.className = "analyticsInsightItem";

        item.innerHTML = `
            <h3>${insight.title}</h3>
            <p>${insight.text}</p>
        `;

        analyticsInsightsList.appendChild(item);
    });
}

function renderPerformance(categories) {
    if (!categories.length) {
        analyticsPerformanceList.innerHTML = `
            <div class="emptyPanelState">
                No performance data available yet.
            </div>
        `;
        return;
    }

    analyticsPerformanceList.innerHTML = "";

    categories.forEach(category => {
        const spent = Number(category.spent || 0);
        const limit = Number(category.limit || 0);
        const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

        const item = document.createElement("div");
        item.className = "analyticsPerformanceItem";

        item.innerHTML = `
            <div class="analyticsPerformanceLeft">
                <h3>${category.name}</h3>
                <p>${getPerformanceMessage(percent)}</p>
            </div>
            <div class="analyticsPerformanceRight ${getPerformanceClass(percent)}">
                ${Math.round(percent)}%
            </div>
        `;

        analyticsPerformanceList.appendChild(item);
    });
}

function renderSnapshot(plan, profile, cards, cash, totalSpending) {
    const snapshotItems = [
        {
            label: "Cash Balance",
            value: formatMoney(cash)
        },
        {
            label: "Saved Cards",
            value: `${cards.length}`
        },
        {
            label: "Income Range",
            value: profile.salaryRange || "Not set"
        },
        {
            label: "Income Frequency",
            value: profile.incomeFrequency || "Not set"
        },
        {
            label: "Goal Type",
            value: plan.goalType || "Not set"
        },
        {
            label: "Estimated Spending",
            value: formatMoney(totalSpending)
        }
    ];

    analyticsSnapshotList.innerHTML = "";

    snapshotItems.forEach(itemData => {
        const item = document.createElement("div");
        item.className = "analyticsSnapshotItem";

        item.innerHTML = `
            <span class="analyticsSnapshotLabel">${itemData.label}</span>
            <strong class="analyticsSnapshotValue">${itemData.value}</strong>
        `;

        analyticsSnapshotList.appendChild(item);
    });
}

function getHighestCategory(categories) {
    if (!categories.length) return null;

    return [...categories].sort((a, b) => Number(b.spent || 0) - Number(a.spent || 0))[0];
}

function getLowestCategory(categories) {
    if (!categories.length) return null;

    return [...categories].sort((a, b) => Number(a.spent || 0) - Number(b.spent || 0))[0];
}

function getGoalProgress(plan) {
    const targetAmount = Number(plan.targetAmount || 0);
    const monthlySaving = Number(plan.monthlySaving || 0);

    if (targetAmount <= 0 || monthlySaving <= 0) {
        return 0;
    }

    return Math.min(Math.round((monthlySaving / targetAmount) * 100), 100);
}

function getCategoryStatus(percent) {
    if (percent >= 90) return "Critical";
    if (percent >= 75) return "Warning";
    if (percent >= 50) return "Moderate";
    return "Healthy";
}

function getPerformanceMessage(percent) {
    if (percent >= 90) return "This category is very close to the limit.";
    if (percent >= 75) return "This category needs close monitoring.";
    if (percent >= 50) return "This category is within a moderate range.";
    return "This category is performing well.";
}

function getPerformanceClass(percent) {
    if (percent >= 90) return "performanceCritical";
    if (percent >= 75) return "performanceWarning";
    if (percent >= 50) return "performanceModerate";
    return "performanceHealthy";
}

function generateDemoSpent(limit) {
    const min = limit * 0.35;
    const max = limit * 0.85;
    return Math.round(Math.random() * (max - min) + min);
}

function formatMoney(amount) {
    return `$${Number(amount).toLocaleString()}`;
}