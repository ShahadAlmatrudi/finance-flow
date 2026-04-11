const STORAGE_KEY = "financeFlowData";

function getAppData() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
        return JSON.parse(savedData);
    }

    return {
        user: null,
        questionnaire: null,
        profile: null,
        plan: null,
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
    data.plan = planData;
    saveAppData(data);
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