async function createDept() {
    const data = {
        dept_id: document.getElementById("id").value,
        dept_name: document.getElementById("name").value,
        dept_code: document.getElementById("code").value
    };

    const res = await apiPost("/admin/dept/create", data);

    alert(res.success ? "Department created!" : res.error);
}

async function assignFaculty() {
    const data = {
        faculty_id: document.getElementById("fid").value,
        user_id: Number(document.getElementById("uid").value),
        dept_id: document.getElementById("dept").value
    };

    const res = await apiPost("/admin/faculty/assign", data);
    alert(res.success ? "Assigned!" : res.error);
}

async function loadDepartments() {
    const deptSelect = document.getElementById("dept_id");
    deptSelect.innerHTML = "<option>Loading...</option>";

    const data = await apiGet("/dept/all");

    deptSelect.innerHTML = "";
    data.forEach(dep => {
        const opt = document.createElement("option");
        opt.value = dep.dept_id;
        opt.textContent = `${dep.dept_name} (ID: ${dep.dept_id})`;
        deptSelect.appendChild(opt);
    });
}

async function loadFacultyForDept() {
    const dept_id = document.getElementById("dept_id").value;
    const facSelect = document.getElementById("faculty_id");

    if (!dept_id) {
        facSelect.innerHTML = "<option>Select department first</option>";
        return;
    }

    facSelect.innerHTML = "<option>Loading...</option>";

    const data = await apiGet(`/admin/faculty/by_dept/${dept_id}`);

    facSelect.innerHTML = "";

    if (data.length === 0) {
        facSelect.innerHTML = "<option>No faculty available in this department</option>";
        return;
    }

    data.forEach(f => {
        const opt = document.createElement("option");
        opt.value = f.faculty_id;
        opt.textContent = `${f.name} (${f.email})`;
        facSelect.appendChild(opt);
    });
}

async function createCourse() {
    const course_id = document.getElementById("course_id").value.trim();
    const course_name = document.getElementById("course_name").value.trim();
    const semester = document.getElementById("semester").value.trim();
    const dept_id = document.getElementById("dept_id").value.trim();
    const faculty_id = document.getElementById("faculty_id").value.trim();

    const errorBox = document.getElementById("errorBox");
    const successBox = document.getElementById("successBox");
    errorBox.style.display = "none";
    successBox.style.display = "none";

    // Validation
    if (!course_id || !course_name || !semester || !dept_id || !faculty_id) {
        errorBox.style.display = "block";
        errorBox.innerText = "All fields must be filled!";
        return;
    }

    const res = await apiPost("/admin/course/create", {
        course_id,
        dept_id,
        faculty_id,
        course_name,
        semester
    });

    if (res.error) {
        errorBox.style.display = "block";
        errorBox.innerText = res.error;
        return;
    }

    successBox.style.display = "block";
    successBox.innerText = "Course created successfully! Redirecting...";

    setTimeout(() => {
        window.location.href = "admin_home.html";
    }, 1500);
}

window.onload = () => {
    loadDepartments();
    loadFacultyForDept();
    document.getElementById("dept_id").addEventListener("change", loadFacultyForDept);
};

