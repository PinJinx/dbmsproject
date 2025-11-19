async function loadUnassignedStudents() {
    const list = document.getElementById("studentList");
    list.innerHTML = "Loading...";

    const data = await apiGet("/admin/student/unassigned");

    if (data.error) {
        list.innerHTML = "Error loading data!";
        return;
    }

    if (data.length === 0) {
        list.innerHTML = "<p>No unassigned students found.</p>";
        return;
    }

    list.innerHTML = "";

    data.forEach(item => {
        const div = document.createElement("div");
        div.className = "list-item";
        div.innerHTML = `
            <b>${item.name}</b><br>
            ${item.email}
        `;
        div.onclick = () => selectStudent(div, item.user_id);
        list.appendChild(div);
    });
}

let selectedUserId = null;

function selectStudent(element, userId) {
    document.querySelectorAll(".list-item").forEach(x => x.classList.remove("selected"));
    element.classList.add("selected");
    selectedUserId = userId;
}

async function assignStudent() {
    const semester = document.getElementById("semester").value;
    const roll_number = document.getElementById("roll").value;
    const cgpa = document.getElementById("cgpa").value;

    const errorBox = document.getElementById("errorBox");
    const successBox = document.getElementById("successBox");

    if (!selectedUserId) {
        errorBox.style.display = "block";
        errorBox.innerText = "Please select a student!";
        return;
    }

    if (!semester || !roll_number || !cgpa) {
        errorBox.style.display = "block";
        errorBox.innerText = "Please fill all fields!";
        return;
    }

    const res = await apiPost("/admin/student/assign", {
        user_id: selectedUserId,
        semester,
        roll_number,
        cgpa
    });

    if (res.error) {
        errorBox.style.display = "block";
        errorBox.innerText = res.error;
        return;
    }

    successBox.style.display = "block";
    successBox.innerText = "Student assigned successfully!";
    setTimeout(() => {
        window.location.href = "admin_home.html";
    }, 1500);
    loadUnassignedStudents();
}

window.onload = loadUnassignedStudents;
