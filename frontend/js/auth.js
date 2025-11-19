async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorBox = document.getElementById("errorBox");

    const result = await apiPost("/login", { email, password });

    if (result.error) {
        if (result.error === "AUTHORISATION_PENDING") {
            errorBox.style.display = "block";
            errorBox.innerText = "Your account is pending approval. Please contact the admin.";
            return;
        }
        errorBox.style.display = "block";
        errorBox.innerText = "Invalid email or password!";
        return;
    }
    errorBox.style.display = "none";

    if (result.role === "admin") {
        // Admin response: { user_id, role }
        localStorage.setItem("user_id", result.user_id);
        localStorage.setItem("role", "admin");
        location.href = "admin/admin_home.html";
        return;
    }

    if (result.role === "student") {
        // Student response: { role: "student", data: [...] }
        // NATURAL JOIN returns *everything*, user_id is at index 0
        const student = result.data;
        localStorage.setItem("user_id", student[0]);
        localStorage.setItem("role", "student");
        location.href = "student/student_home.html";
        return;
    }

    if (result.role === "faculty") {
        // Faculty response: { role: "faculty", data: [...] }
        const faculty = result.data;
        localStorage.setItem("user_id", faculty[0]);
        localStorage.setItem("role", "faculty");
        location.href = "faculty/faculty_home.html";
        return;
    }
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
