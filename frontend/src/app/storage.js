const STORAGE_KEY = "financeFlowData";

function getAppData() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
        const parsed = JSON.parse(savedData);

        // Migrate old single plan to plans array
        if (parsed.plan !== undefined && !Array.isArray(parsed.plans)) {
            parsed.plans = parsed.plan ? [parsed.plan] : [];
            delete parsed.plan;
            saveAppData(parsed);
        }

        return parsed;
    }

    return {
        user: null,
        questionnaire: null,
        profile: null,
        plans: [],
        cards: [],
        cash: 0,
        notifications: [],
        settings: {
            emailNotifications: true,
            budgetAlerts: true,
            monthlySummary: false,
            twoFactorAuth: false
        },
        transactions: []
    };
}

function saveAppData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function setUser(userData) {
    const data = getAppData();
    data.user = userData;
    saveAppData(data);
}

function setQuestionnaire(questionnaireData) {
    const data = getAppData();
    data.questionnaire = questionnaireData;
    saveAppData(data);
}

function setProfile(profileData) {
    const data = getAppData();
    data.profile = profileData;
    saveAppData(data);
}

function setPlan(planData) {
    const data = getAppData();
    if (!Array.isArray(data.plans)) {
        data.plans = [];
    }
    data.plans.push(planData);
    saveAppData(data);
}

function updatePlan(planId, updatedPlanData) {
    const data = getAppData();
    if (!Array.isArray(data.plans)) {
        data.plans = [];
    }
    const index = data.plans.findIndex(p => p._id === planId);
    if (index !== -1) {
        data.plans[index] = { ...data.plans[index], ...updatedPlanData };
    }
    saveAppData(data);
}

function deletePlan(planId) {
    const data = getAppData();
    data.plans = (data.plans || []).filter(p => p._id !== planId);
    saveAppData(data);
}

function getLatestPlan() {
    const data = getAppData();
    const plans = data.plans || [];
    return plans.length ? plans[plans.length - 1] : null;
}

function addCard(cardData) {
    const data = getAppData();

    if (cardData.primary) {
        data.cards = data.cards.map(card => ({
            ...card,
            primary: false
        }));
    }

    data.cards.push(cardData);
    saveAppData(data);
}

function setCards(cardsData) {
    const data = getAppData();
    data.cards = cardsData;
    saveAppData(data);
}

function setCash(cashAmount) {
    const data = getAppData();
    data.cash = cashAmount;
    saveAppData(data);
}

function setTransactions(transactionsData) {
    const data = getAppData();
    data.transactions = transactionsData;
    saveAppData(data);
}