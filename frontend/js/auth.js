// Registration and login helper functions.
// After register, store user_id and role and redirect to their home.

async function registerUser() {
  const role = document.getElementById("role").value;
  const payload = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    role: role,
    dob: document.getElementById("dob").value,
    address: document.getElementById("address").value
  };

  const res = await apiPost("/register", payload);

  if (res.error) {
    alert("Register error: " + res.error);
    return;
  }
  if (!res.success) {
    alert("Register failed");
    return;
  }

  // Save and redirect to the correct home page
  localStorage.setItem("user_id", res.user_id);
  localStorage.setItem("role", role);

  alert("Registration successful!");

  if (role === "admin") location.href = "admin/admin_home.html";
  else if (role === "faculty") location.href = "faculty/faculty_home.html";
  else location.href = "student/student_home.html";
}

async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await apiPost("/login", { email, password });

  if (res.error) {
    alert("Login error: " + (res.error === "INVALID_LOGIN" ? "Invalid credentials" : res.error));
    return;
  }

  // store and redirect
  localStorage.setItem("user_id", res.user_id);
  localStorage.setItem("role", res.role);

  if (res.role === "admin") location.href = "admin/admin_home.html";
  else if (res.role === "faculty") location.href = "faculty/faculty_home.html";
  else location.href = "student/student_home.html";
}
