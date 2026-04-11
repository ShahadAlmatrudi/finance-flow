const STORAGE_KEY = "financeFlowData";

export function getAppData() {
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
      twoFactorAuth: false,
    },
    transactions: [],
  };
}

export function saveAppData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function setUser(userData) {
  const data = getAppData();
  data.user = userData;
  saveAppData(data);
}

export function setQuestionnaire(questionnaireData) {
  const data = getAppData();
  data.questionnaire = questionnaireData;
  saveAppData(data);
}

export function setProfile(profileData) {
  const data = getAppData();
  data.profile = profileData;
  saveAppData(data);
}

export function setPlan(planData) {
  const data = getAppData();
  data.plan = planData;
  saveAppData(data);
}

export function addCard(cardData) {
  const data = getAppData();

  if (!Array.isArray(data.cards)) {
    data.cards = [];
  }

  if (cardData.primary) {
    data.cards = data.cards.map((card) => ({
      ...card,
      primary: false,
    }));
  }

  data.cards.push(cardData);
  saveAppData(data);
}

export function setCards(cardsData) {
  const data = getAppData();
  data.cards = cardsData;
  saveAppData(data);
}

export function setCash(cashAmount) {
  const data = getAppData();
  data.cash = cashAmount;
  saveAppData(data);
}

export function setTransactions(transactionsData) {
  const data = getAppData();
  data.transactions = transactionsData;
  saveAppData(data);
}