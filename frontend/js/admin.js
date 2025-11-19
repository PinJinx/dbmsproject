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

async function createCourse() {
    const data = {
        course_id: document.getElementById("cid").value,
        dept_id: document.getElementById("dept").value,
        faculty_id: document.getElementById("fid").value,
        course_name: document.getElementById("cname").value,
        semester: Number(document.getElementById("sem").value)
    };

    const res = await apiPost("/admin/course/create", data);
    alert(res.success ? "Course Created!" : res.error);
}
