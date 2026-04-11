const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const data = getAppData();
  const savedUser = data.user;

  if (!savedUser) {
    loginError.textContent = "No account found. Please sign up first.";
    return;
  }

  if (email === savedUser.email && password === savedUser.password) {
    loginError.textContent = "";
    data.isLoggedIn = true;
    saveAppData(data);
    window.location.href = "dashboard.html";
  } else {
    loginError.textContent = "Incorrect email or password.";
  }
});