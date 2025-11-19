async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const result = await apiPost("/login", { email, password });

    if (result.error) {
        alert("Invalid login!");
        return;
    }

    localStorage.setItem("user_id", result.user_id);
    localStorage.setItem("role", result.role);

    if (result.role === "admin") location.href = "admin/admin_home.html";
    if (result.role === "faculty") location.href = "faculty/faculty_home.html";
    if (result.role === "student") location.href = "student/student_home.html";
}

async function registerUser() {
    const role = document.getElementById("role").value;

    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        role: role,
        dob: document.getElementById("dob").value,
        address: document.getElementById("address").value
    };

    const res = await apiPost("/register", data);

    if (res.error) {
        alert("Error: " + res.error);
        return;
    }

    // Store user details
    localStorage.setItem("user_id", res.user_id);
    localStorage.setItem("role", role);

    alert("Registration successful!");

    // Redirect based on role
    if (role === "admin") {
        location.href = "admin/admin_home.html";
    } 
    else if (role === "faculty") {
        location.href = "faculty/faculty_home.html";
    } 
    else if (role === "student") {
        location.href = "student/student_home.html";
    }
}
