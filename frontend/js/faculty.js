async function createExam() {
    const data = {
        exam_id: document.getElementById("exam_id").value,
        course_id: document.getElementById("course_id").value,
        exam_name: document.getElementById("exam_name").value,
        exam_date: document.getElementById("exam_date").value,
        total_marks: Number(document.getElementById("total_marks").value)
    };

    const res = await apiPost("/faculty/exam/create", data);

    if (res.success) {
        alert("Exam Created!");
        window.location.href = "faculty_home.html";
    } else {
        alert(res.error);
    }
}


async function loadDepartments() {
    const deptSelect = document.getElementById("dept_id");

    const data = await apiGet("/dept/all");

    deptSelect.innerHTML = `<option value="">Select Department</option>`;

    data.forEach(d => {
        deptSelect.innerHTML += `
            <option value="${d.dept_id}">${d.dept_name} (${d.dept_id})</option>
        `;
    });
}



async function loadCourses() {
    const deptId = document.getElementById("dept_id").value;
    const courseSelect = document.getElementById("course_id");
    const examSelect = document.getElementById("exam_id");

    courseSelect.innerHTML = `<option>Loading...</option>`;
    examSelect.innerHTML = `<option>Select a course first</option>`;

    if (!deptId) return;

    const data = await apiGet(`/faculty/courses/by_dept/${deptId}`);

    courseSelect.innerHTML = `<option value="">Select Course</option>`;

    data.forEach(c => {
        courseSelect.innerHTML += `
            <option value="${c.course_id}">${c.course_name}</option>
        `;
    });
}

async function loadExams() {
    const courseId = document.getElementById("course_id").value;
    const examSelect = document.getElementById("exam_id");

    if (!courseId) {
        examSelect.innerHTML = `<option>Select a course first</option>`;
        return;
    }

    const data = await apiGet(`/faculty/exams/by_course/${courseId}`);

    examSelect.innerHTML = `<option value="">Select Exam</option>`;

    data.forEach(e => {
        examSelect.innerHTML += `
            <option value="${e.exam_id}">
                ${e.exam_name} (${e.exam_id})
            </option>
        `;
    });
}

async function loadStudents() {
    const examId = document.getElementById("exam_id").value;
    const table = document.getElementById("students_table");

    if (!examId) {
        table.innerHTML = "<tr><td>Select an exam</td></tr>";
        return;
    }

    const students = await apiGet(`/faculty/exam/students/${examId}`);

    if (!students.length) {
        table.innerHTML = "<tr><td>No students enrolled</td></tr>";
        return;
    }

    table.innerHTML = `
        <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Marks</th>
            <th>Grade</th>
            <th>Action</th>
        </tr>
    `;

    students.forEach(s => {
        table.innerHTML += `
            <tr>
                <td>${s.student_id}</td>
                <td>${s.name}</td>
                <td><input id="marks_${s.student_id}" value="${s.marks}"></td>
                <td><input id="grade_${s.student_id}" value="${s.grade}"></td>
                <td>
                    <button onclick="submitSingleGrade('${s.student_id}')">
                        Save
                    </button>
                </td>
            </tr>
        `;
    });
}

async function submitSingleGrade(studentId) {
    const examId = document.getElementById("exam_id").value;
    const marks = Number(document.getElementById(`marks_${studentId}`).value);
    const grade = document.getElementById(`grade_${studentId}`).value;

    const res = await apiPost("/faculty/exam/grade", {
        exam_id: examId,
        student_id: studentId,
        marks,
        grade
    });

    if (res.success) {
        alert("Updated!");
    } else {
        alert(res.error);
    }
}

// Grade Exam
async function gradeExam() {
    const data = {
        exam_id: document.getElementById("exam_id").value,
        student_id: document.getElementById("student_id").value,
        marks: Number(document.getElementById("marks").value),
        grade: document.getElementById("grade").value
    };

    const res = await apiPost("/faculty/exam/grade", data);

    if (res.success) {
        alert("Graded Successfully!");
        window.location.href = "faculty_home.html";
    } else {
        alert(res.error);
    }
}

window.onload = loadDepartments;
