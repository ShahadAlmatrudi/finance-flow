const welcomeUserName = document.getElementById("welcomeUserName");
const summaryGoal = document.getElementById("summaryGoal");
const summarySaving = document.getElementById("summarySaving");
const summaryCards = document.getElementById("summaryCards");
const summaryCash = document.getElementById("summaryCash");
const signOutBtn = document.getElementById("signOutBtn");

const appData = getAppData();

if (!appData.user) {
    window.location.href = "signup.html";
}

const fullName = appData.user?.fullname || "User";
const firstName = fullName.split(" ")[0];

welcomeUserName.textContent = firstName;

if (appData.plan?.goalName) {
    summaryGoal.textContent = appData.plan.goalName;
}

if (appData.plan?.monthlySaving) {
    summarySaving.textContent = formatMoney(appData.plan.monthlySaving);
}

if (appData.cards) {
    summaryCards.textContent = appData.cards.length;
}

if (typeof appData.cash === "number") {
    summaryCash.textContent = formatMoney(appData.cash);
}

signOutBtn.addEventListener("click", function () {
    const shouldSignOut = confirm("Are you sure you want to sign out?");

    if (shouldSignOut) {
        localStorage.removeItem("financeFlowData");
        window.location.href = "signup.html";
    }
});

function formatMoney(amount) {
    return `$${Number(amount).toLocaleString()}`;
}