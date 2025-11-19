async function createExam() {
    const data = {
        exam_id: document.getElementById("eid").value,
        course_id: document.getElementById("cid").value,
        exam_name: document.getElementById("name").value,
        exam_date: document.getElementById("date").value,
        total_marks: Number(document.getElementById("marks").value)
    };

    const res = await apiPost("/faculty/exam/create", data);
    alert(res.success ? "Exam Created!" : res.error);
}

async function gradeExam() {
    const data = {
        exam_id: document.getElementById("eid").value,
        student_id: document.getElementById("sid").value,
        marks: Number(document.getElementById("marks").value),
        grade: document.getElementById("grade").value
    };

    const res = await apiPost("/faculty/exam/grade", data);
    alert(res.success ? "Grade submitted!" : res.error);
}
