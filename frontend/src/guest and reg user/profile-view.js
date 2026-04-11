const appData = getAppData();

if (!appData.user) {
    window.location.href = "signup.html";
}

const sidebarUserName = document.getElementById("sidebarUserName");
const sidebarAvatar = document.getElementById("sidebarAvatar");
const logoutBtn = document.getElementById("logoutBtn");

const profileSummaryAvatar = document.getElementById("profileSummaryAvatar");
const profileSummaryName = document.getElementById("profileSummaryName");
const profileSummaryEmail = document.getElementById("profileSummaryEmail");
const summaryOccupation = document.getElementById("summaryOccupation");
const summaryIncomeRange = document.getElementById("summaryIncomeRange");
const summaryCountry = document.getElementById("summaryCountry");
const summary2FA = document.getElementById("summary2FA");

const accountInfoForm = document.getElementById("accountInfoForm");
const financialProfileForm = document.getElementById("financialProfileForm");
const preferencesForm = document.getElementById("preferencesForm");

const editFullname = document.getElementById("editFullname");
const editEmail = document.getElementById("editEmail");
const editPassword = document.getElementById("editPassword");
const editConfirmPassword = document.getElementById("editConfirmPassword");

const editAge = document.getElementById("editAge");
const editCountry = document.getElementById("editCountry");
const editOccupation = document.getElementById("editOccupation");
const editSalaryRange = document.getElementById("editSalaryRange");
const editIncomeFrequency = document.getElementById("editIncomeFrequency");
const editIncomeSource = document.getElementById("editIncomeSource");
const editObligationType = document.getElementById("editObligationType");
const editObligationAmount = document.getElementById("editObligationAmount");

const emailNotifications = document.getElementById("emailNotifications");
const budgetAlerts = document.getElementById("budgetAlerts");
const monthlySummary = document.getElementById("monthlySummary");
const twoFactorAuth = document.getElementById("twoFactorAuth");

const editFullnameError = document.getElementById("editFullnameError");
const editEmailError = document.getElementById("editEmailError");
const editPasswordError = document.getElementById("editPasswordError");
const editConfirmPasswordError = document.getElementById("editConfirmPasswordError");

const editAgeError = document.getElementById("editAgeError");
const editCountryError = document.getElementById("editCountryError");
const editOccupationError = document.getElementById("editOccupationError");
const editSalaryRangeError = document.getElementById("editSalaryRangeError");
const editIncomeFrequencyError = document.getElementById("editIncomeFrequencyError");
const editIncomeSourceError = document.getElementById("editIncomeSourceError");
const editObligationTypeError = document.getElementById("editObligationTypeError");
const editObligationAmountError = document.getElementById("editObligationAmountError");

const accountSuccessMsg = document.getElementById("accountSuccessMsg");
const financialSuccessMsg = document.getElementById("financialSuccessMsg");
const preferencesSuccessMsg = document.getElementById("preferencesSuccessMsg");

loadPageData();

accountInfoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearAccountErrors();
    accountSuccessMsg.textContent = "";

    let isValid = true;

    if (editFullname.value.trim() === "") {
        showError(editFullname, editFullnameError, "Full name is required.");
        isValid = false;
    }

    if (editEmail.value.trim() === "") {
        showError(editEmail, editEmailError, "Email is required.");
        isValid = false;
    } else if (!editEmail.value.includes("@")) {
        showError(editEmail, editEmailError, "Email must contain '@'.");
        isValid = false;
    } else if (!editEmail.value.endsWith(".com")) {
        showError(editEmail, editEmailError, "Email must end with '.com'.");
        isValid = false;
    }

    if (editPassword.value.trim() === "") {
        showError(editPassword, editPasswordError, "Password is required.");
        isValid = false;
    } else if (editPassword.value.trim().length < 6) {
        showError(editPassword, editPasswordError, "Password must be at least 6 characters.");
        isValid = false;
    }

    if (editConfirmPassword.value.trim() === "") {
        showError(editConfirmPassword, editConfirmPasswordError, "Please confirm your password.");
        isValid = false;
    } else if (editPassword.value !== editConfirmPassword.value) {
        showError(editConfirmPassword, editConfirmPasswordError, "Passwords do not match.");
        isValid = false;
    }

    if (!isValid) return;

    const data = getAppData();
    data.user = {
        fullname: editFullname.value.trim(),
        email: editEmail.value.trim(),
        password: editPassword.value.trim()
    };

    saveAppData(data);
    accountSuccessMsg.textContent = "Account information saved successfully.";
    refreshSummary();
});

financialProfileForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearFinancialErrors();
    financialSuccessMsg.textContent = "";

    let isValid = true;

    if (editAge.value.trim() === "") {
        showError(editAge, editAgeError, "Age is required.");
        isValid = false;
    } else if (Number(editAge.value) < 16) {
        showError(editAge, editAgeError, "Age must be 16 or older.");
        isValid = false;
    }

    if (editCountry.value === "") {
        showError(editCountry, editCountryError, "Please select your country.");
        isValid = false;
    }

    if (editOccupation.value === "") {
        showError(editOccupation, editOccupationError, "Please select your occupation.");
        isValid = false;
    }

    if (editSalaryRange.value === "") {
        showError(editSalaryRange, editSalaryRangeError, "Please select your income range.");
        isValid = false;
    }

    if (editIncomeFrequency.value === "") {
        showError(editIncomeFrequency, editIncomeFrequencyError, "Please select your income frequency.");
        isValid = false;
    }

    if (editIncomeSource.value === "") {
        showError(editIncomeSource, editIncomeSourceError, "Please select your primary income source.");
        isValid = false;
    }

    if (editObligationType.value === "") {
        showError(editObligationType, editObligationTypeError, "Please select your financial obligation.");
        isValid = false;
    }

    if (editObligationAmount.value.trim() === "") {
        showError(editObligationAmount, editObligationAmountError, "Obligation amount is required.");
        isValid = false;
    } else if (Number(editObligationAmount.value) < 0) {
        showError(editObligationAmount, editObligationAmountError, "Amount cannot be negative.");
        isValid = false;
    }

    if (!isValid) return;

    const data = getAppData();
    data.profile = {
        age: Number(editAge.value),
        country: editCountry.value,
        occupation: editOccupation.value,
        salaryRange: editSalaryRange.value,
        incomeFrequency: editIncomeFrequency.value,
        incomeSource: editIncomeSource.value,
        obligationType: editObligationType.value,
        obligationAmount: Number(editObligationAmount.value)
    };

    saveAppData(data);
    financialSuccessMsg.textContent = "Financial profile saved successfully.";
    refreshSummary();
});

preferencesForm.addEventListener("submit", function (event) {
    event.preventDefault();
    preferencesSuccessMsg.textContent = "";

    const data = getAppData();

    data.settings = {
        emailNotifications: emailNotifications.checked,
        budgetAlerts: budgetAlerts.checked,
        monthlySummary: monthlySummary.checked,
        twoFactorAuth: twoFactorAuth.checked
    };

    saveAppData(data);
    preferencesSuccessMsg.textContent = "Preferences saved successfully.";
    refreshSummary();
});

logoutBtn.addEventListener("click", function () {
    const shouldLogout = confirm("Are you sure you want to log out?");

    if (shouldLogout) {
        localStorage.removeItem("financeFlowData");
        window.location.href = "signup.html";
    }
});

function loadPageData() {
    const data = getAppData();
    const user = data.user || {};
    const profile = data.profile || {};
    const settings = data.settings || {
        emailNotifications: true,
        budgetAlerts: true,
        monthlySummary: false,
        twoFactorAuth: false
    };

    editFullname.value = user.fullname || "";
    editEmail.value = user.email || "";
    editPassword.value = user.password || "";
    editConfirmPassword.value = user.password || "";

    editAge.value = profile.age || "";
    editCountry.value = profile.country || "";
    editOccupation.value = profile.occupation || "";
    editSalaryRange.value = profile.salaryRange || "";
    editIncomeFrequency.value = profile.incomeFrequency || "";
    editIncomeSource.value = profile.incomeSource || "";
    editObligationType.value = profile.obligationType || "";
    editObligationAmount.value = profile.obligationAmount ?? "";

    emailNotifications.checked = !!settings.emailNotifications;
    budgetAlerts.checked = !!settings.budgetAlerts;
    monthlySummary.checked = !!settings.monthlySummary;
    twoFactorAuth.checked = !!settings.twoFactorAuth;

    refreshSummary();
}

function refreshSummary() {
    const data = getAppData();
    const user = data.user || {};
    const profile = data.profile || {};
    const settings = data.settings || {};

    const fullName = user.fullname || "User";
    const initials = fullName
        .split(" ")
        .map(part => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    sidebarUserName.textContent = fullName;
    sidebarAvatar.textContent = initials || "U";

    profileSummaryAvatar.textContent = initials || "U";
    profileSummaryName.textContent = fullName;
    profileSummaryEmail.textContent = user.email || "No email saved";

    summaryOccupation.textContent = profile.occupation || "Not set";
    summaryIncomeRange.textContent = profile.salaryRange || "Not set";
    summaryCountry.textContent = profile.country || "Not set";
    summary2FA.textContent = settings.twoFactorAuth ? "Enabled" : "Disabled";
}

function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.classList.add("inputError");
}

function clearAccountErrors() {
    editFullnameError.textContent = "";
    editEmailError.textContent = "";
    editPasswordError.textContent = "";
    editConfirmPasswordError.textContent = "";

    editFullname.classList.remove("inputError");
    editEmail.classList.remove("inputError");
    editPassword.classList.remove("inputError");
    editConfirmPassword.classList.remove("inputError");
}

function clearFinancialErrors() {
    editAgeError.textContent = "";
    editCountryError.textContent = "";
    editOccupationError.textContent = "";
    editSalaryRangeError.textContent = "";
    editIncomeFrequencyError.textContent = "";
    editIncomeSourceError.textContent = "";
    editObligationTypeError.textContent = "";
    editObligationAmountError.textContent = "";

    [
        editAge,
        editCountry,
        editOccupation,
        editSalaryRange,
        editIncomeFrequency,
        editIncomeSource,
        editObligationType,
        editObligationAmount
    ].forEach(field => field.classList.remove("inputError"));
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