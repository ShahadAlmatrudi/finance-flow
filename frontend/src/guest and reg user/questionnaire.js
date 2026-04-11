const questionnaireForm = document.getElementById("questionnaireForm");

const goalError = document.getElementById("goalError");
const trackingError = document.getElementById("trackingError");
const difficultyError = document.getElementById("difficultyError");
const helpError = document.getElementById("helpError");
const categoriesQuestionError = document.getElementById("categoriesQuestionError");

questionnaireForm.addEventListener("submit", function (event) {
    event.preventDefault();

    clearErrors();

    let isValid = true;

    const goal = document.querySelector('input[name="goal"]:checked');
    const tracking = document.querySelector('input[name="tracking"]:checked');
    const difficulty = document.querySelector('input[name="difficulty"]:checked');
    const help = document.querySelector('input[name="help"]:checked');
    const selectedCategories = document.querySelectorAll('input[name="categories"]:checked');

    if (!goal) {
        goalError.textContent = "Please choose your main financial goal.";
        isValid = false;
    }

    if (!tracking) {
        trackingError.textContent = "Please choose how often you track expenses.";
        isValid = false;
    }

    if (!difficulty) {
        difficultyError.textContent = "Please choose what makes budgeting difficult.";
        isValid = false;
    }

    if (!help) {
        helpError.textContent = "Please choose how FinanceFlow should help you.";
        isValid = false;
    }

    if (selectedCategories.length === 0) {
        categoriesQuestionError.textContent = "Please choose at least one category.";
        isValid = false;
    }

    if (isValid) {
        const questionnaireData = {
            goal: goal.value,
            tracking: tracking.value,
            difficulty: difficulty.value,
            help: help.value,
            categories: Array.from(selectedCategories).map(item => item.value)
        };

        setQuestionnaire(questionnaireData);
        window.location.href = "profile.html";
    }
});

function clearErrors() {
    document.querySelectorAll(".errorMsg").forEach(error => {
        error.textContent = "";
    });
}