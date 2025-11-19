async function loadDepartments() {
    const depts = await apiGet("/dept/all");
    const deptSelects = document.querySelectorAll("#deptSelect");

    deptSelects.forEach(sel => {
        sel.innerHTML = `<option value="">Select Department</option>`;
        depts.forEach(d => {
            sel.innerHTML += `<option value="${d.dept_id}">${d.dept_name}</option>`;
        });
    });
}

// -------------------------
// LOAD COURSES FOR DEPT
// -------------------------
async function loadCoursesByDept() {
    const dept = document.getElementById("deptSelect").value;
    const courses = await apiGet(`/faculty/courses/by_dept/${dept}`);

    const sel = document.getElementById("courseSelect");
    sel.innerHTML = "";
    courses.forEach(c => {
        sel.innerHTML += `<option value="${c.course_id}">${c.course_name}</option>`;
    });
}

async function loadCoursesByDeptExam() {
    return loadCoursesByDept();
}

// -------------------------
// LOAD EXAMS FOR COURSE
// -------------------------
async function loadExamsByCourse() {
    const course = document.getElementById("courseSelect").value;
    const exams = await apiGet(`/faculty/exams/by_course/${course}`);

    const sel = document.getElementById("examSelect");
    sel.innerHTML = "";
    exams.forEach(e => {
        sel.innerHTML += `<option value="${e.exam_id}">${e.exam_name}</option>`;
    });
}

// -------------------------
// ENROLL IN COURSE
// -------------------------
async function enrollCourse() {
    const user_id = localStorage.getItem("user_id");
    const course_id = document.getElementById("courseSelect").value;

    const res = await apiPost("/student/course/enroll", {
        user_id,
        course_id
    });

    alert(res.success ? "Course Enrolled!" : res.error);

    if (res.success) window.location.href = "student_home.html";
}

// -------------------------
// ENROLL IN EXAM
// -------------------------
async function enrollExam() {
    const user_id = localStorage.getItem("user_id");
    const exam_id = document.getElementById("examSelect").value;

    const res = await apiPost("/student/exam/enroll", {
        user_id,
        exam_id
    });

    alert(res.success ? "Exam Enrolled!" : res.error);

    if (res.success) window.location.href = "student_home.html";
}

// -------------------------
async function loadResults() {
    const user_id = localStorage.getItem("user_id");
    const results = await apiGet(`/student/results/${user_id}`);

    let html = "";

    results.forEach(r => {
        html += `<p>Exam: ${r[0]} | Marks: ${r[1]} | Grade: ${r[2]}</p>`;
    });

    document.getElementById("results").innerHTML = html;
}
