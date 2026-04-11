const appData = getAppData();

if (!appData.user) {
    window.location.href = "signup.html";
}

const sidebarUserName = document.getElementById("sidebarUserName");
const sidebarAvatar = document.getElementById("sidebarAvatar");
const logoutBtn = document.getElementById("logoutBtn");

const totalNotificationsCount = document.getElementById("totalNotificationsCount");
const unreadNotificationsCount = document.getElementById("unreadNotificationsCount");
const goalNotificationsCount = document.getElementById("goalNotificationsCount");
const budgetNotificationsCount = document.getElementById("budgetNotificationsCount");

const notificationsList = document.getElementById("notificationsList");
const markAllReadBtn = document.getElementById("markAllReadBtn");

const fullName = appData.user?.fullname || "User";
const initials = fullName
    .split(" ")
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

sidebarUserName.textContent = fullName;
sidebarAvatar.textContent = initials || "U";

let notifications = getStoredNotifications();

renderNotifications();

markAllReadBtn.addEventListener("click", function () {
    notifications = notifications.map(item => ({
        ...item,
        read: true
    }));

    saveNotifications(notifications);
    renderNotifications();
});

logoutBtn.addEventListener("click", function () {
    const shouldLogout = confirm("Are you sure you want to log out?");

    if (shouldLogout) {
        localStorage.removeItem("financeFlowData");
        window.location.href = "signup.html";
    }
});

function getStoredNotifications() {
    const data = getAppData();

    if (data.notifications && Array.isArray(data.notifications)) {
        return data.notifications;
    }

    const generatedNotifications = generateNotificationsFromData(data);
    data.notifications = generatedNotifications;
    saveAppData(data);
    return generatedNotifications;
}

function saveNotifications(updatedNotifications) {
    const data = getAppData();
    data.notifications = updatedNotifications;
    saveAppData(data);
}

function generateNotificationsFromData(data) {
    const generated = [];
    const plan = data.plan || {};
    const cards = data.cards || [];
    const cash = Number(data.cash || 0);
    const profile = data.profile || {};
    const questionnaire = data.questionnaire || {};

    if (plan.goalName) {
        generated.push({
            id: cryptoRandomId(),
            type: "goal",
            title: "Goal setup completed",
            message: `Your goal "${plan.goalName}" has been saved successfully.`,
            read: false
        });
    }

    if (plan.monthlySaving) {
        generated.push({
            id: cryptoRandomId(),
            type: "goal",
            title: "Saving plan is active",
            message: `You are planning to save ${formatMoney(plan.monthlySaving)} each month.`,
            read: false
        });
    }

    if (plan.categories && plan.categories.length > 0) {
        const highestCategory = [...plan.categories].sort((a, b) => b.limit - a.limit)[0];

        generated.push({
            id: cryptoRandomId(),
            type: "budget",
            title: "Budget categories created",
            message: `${plan.categories.length} categories were added. Your highest limit is ${highestCategory.name} at ${formatMoney(highestCategory.limit)}.`,
            read: false
        });

        if (highestCategory.limit > 0) {
            const nearLimitAmount = Math.round(highestCategory.limit * 0.82);

            generated.push({
                id: cryptoRandomId(),
                type: "budget",
                title: "You are close to a category limit",
                message: `${highestCategory.name} is estimated at ${formatMoney(nearLimitAmount)} out of ${formatMoney(highestCategory.limit)}.`,
                read: false
            });
        }
    }

    if (cards.length > 0) {
        const primaryCard = cards.find(card => card.primary) || cards[0];

        generated.push({
            id: cryptoRandomId(),
            type: "account",
            title: "Card added successfully",
            message: `${cards.length} saved card${cards.length > 1 ? "s are" : " is"} on your account. ${primaryCard.type} ending in ${primaryCard.number.slice(-4)} is ready to use.`,
            read: true
        });
    }

    if (cash > 0) {
        generated.push({
            id: cryptoRandomId(),
            type: "account",
            title: "Cash balance saved",
            message: `Your current cash balance is ${formatMoney(cash)}.`,
            read: true
        });
    }

    if (profile.obligationType && profile.obligationAmount >= 0) {
        generated.push({
            id: cryptoRandomId(),
            type: "reminder",
            title: "Financial obligation reminder",
            message: `${profile.obligationType} has been recorded with an amount of ${formatMoney(profile.obligationAmount)}.`,
            read: false
        });
    }

    if (questionnaire.help) {
        generated.push({
            id: cryptoRandomId(),
            type: "insight",
            title: "Personalized support enabled",
            message: `FinanceFlow will focus on ${questionnaire.help.toLowerCase()} based on your answers.`,
            read: true
        });
    }

    if (generated.length === 0) {
        generated.push({
            id: cryptoRandomId(),
            type: "info",
            title: "Welcome to FinanceFlow",
            message: "Complete your setup to start receiving useful financial alerts and updates.",
            read: false
        });
    }

    return generated;
}

function renderNotifications() {
    const total = notifications.length;
    const unread = notifications.filter(item => !item.read).length;
    const goalCount = notifications.filter(item => item.type === "goal").length;
    const budgetCount = notifications.filter(item => item.type === "budget").length;

    totalNotificationsCount.textContent = total;
    unreadNotificationsCount.textContent = unread;
    goalNotificationsCount.textContent = goalCount;
    budgetNotificationsCount.textContent = budgetCount;

    if (notifications.length === 0) {
        notificationsList.innerHTML = `
            <div class="emptyPanelState">
                No notifications yet.
            </div>
        `;
        return;
    }

    notificationsList.innerHTML = "";

    notifications.forEach(notification => {
        const item = document.createElement("div");
        item.className = `notificationItem ${notification.read ? "read" : "unread"}`;

        item.innerHTML = `
            <div class="notificationLeft">
                <div class="notificationTypeBadge ${getBadgeClass(notification.type)}">
                    ${notification.type}
                </div>

                <div class="notificationContent">
                    <h3>${notification.title}</h3>
                    <p>${notification.message}</p>
                </div>
            </div>

            <div class="notificationRight">
                ${notification.read ? '<span class="notificationStatus readStatus">Read</span>' : '<span class="notificationStatus unreadStatus">Unread</span>'}
                <button class="notificationActionBtn" data-id="${notification.id}">
                    ${notification.read ? "Mark Unread" : "Mark Read"}
                </button>
            </div>
        `;

        notificationsList.appendChild(item);
    });

    attachNotificationButtons();
}

function attachNotificationButtons() {
    const buttons = document.querySelectorAll(".notificationActionBtn");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const id = button.dataset.id;

            notifications = notifications.map(notification => {
                if (notification.id === id) {
                    return {
                        ...notification,
                        read: !notification.read
                    };
                }

                return notification;
            });

            saveNotifications(notifications);
            renderNotifications();
        });
    });
}

function getBadgeClass(type) {
    if (type === "goal") return "badgeGoal";
    if (type === "budget") return "badgeBudget";
    if (type === "account") return "badgeAccount";
    if (type === "reminder") return "badgeReminder";
    return "badgeInfo";
}

function formatMoney(amount) {
    return `$${Number(amount).toLocaleString()}`;
}

function cryptoRandomId() {
    return Math.random().toString(36).slice(2, 11);
}