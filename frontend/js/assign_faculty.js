async function loadUnassignedFaculty() {
    const list = document.getElementById("facultyList");
    list.innerHTML = "Loading...";

    const data = await apiGet("/admin/faculty/unassigned");

    if (data.error) {
        list.innerHTML = "Error loading data!";
        return;
    }

    if (data.length === 0) {
        list.innerHTML = "<p>No unassigned faculty found.</p>";
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
        div.onclick = () => selectFaculty(div, item.user_id);
        list.appendChild(div);
    });
}

let selectedUserId = null;

function selectFaculty(element, userId) {
    document.querySelectorAll(".list-item").forEach(x => x.classList.remove("selected"));
    element.classList.add("selected");
    selectedUserId = userId;
}

async function assignFaculty() {
    const faculty_id = document.getElementById("faculty_id").value;
    const dept_id = document.getElementById("dept_id").value;

    const errorBox = document.getElementById("errorBox");
    const successBox = document.getElementById("successBox");

    if (!selectedUserId) {
        errorBox.style.display = "block";
        errorBox.innerText = "Please select a faculty!";
        return;
    }

    if (!faculty_id || !dept_id) {
        errorBox.style.display = "block";
        errorBox.innerText = "Please fill all fields!";
        return;
    }

    const res = await apiPost("/admin/faculty/assign", {
        faculty_id,
        user_id: selectedUserId,
        dept_id
    });

    if (res.error) {
        errorBox.style.display = "block";
        errorBox.innerText = res.error;
        return;
    }

    successBox.style.display = "block";
    successBox.innerText = "Faculty assigned successfully!";
    setTimeout(() => {
        window.location.href = "admin_home.html";
    }, 1500);

    loadUnassignedFaculty();
    
}

async function loadDepartments() {
    const dropdown = document.getElementById("dept_id");
    dropdown.innerHTML = "<option>Loading...</option>";

    const data = await apiGet("/dept/all");

    dropdown.innerHTML = ""; 

    data.forEach(dep => {
        const opt = document.createElement("option");
        opt.value = dep.dept_id;
        opt.textContent = `${dep.dept_name} (ID: ${dep.dept_id})`;
        dropdown.appendChild(opt);
    });
}

window.onload = () => {
    loadUnassignedFaculty();
    loadDepartments();
};

