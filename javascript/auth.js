document.getElementById("loginBtn")?.addEventListener("click", async () => {
  const email = email.value;
  const password = password.value;

  try {
    const data = await api("/login", "POST", { email, password });
    localStorage.setItem("token", data.token);
    location.href = "dashboard.html";
  } catch (e) {
    alert("Login failed: " + e.message);
  }
});
