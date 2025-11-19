async function enrollCourse() {
    const user_id = localStorage.getItem("user_id");
    const course_id = document.getElementById("cid").value;

    const res = await apiPost("/student/course/enroll", {
        user_id,
        course_id
    });

    alert(res.success ? "Enrolled!" : res.error);
}

async function enrollExam() {
    const user_id = localStorage.getItem("user_id");

    const res = await apiPost("/student/exam/enroll", {
        user_id,
        exam_id: document.getElementById("eid").value
    });

    alert(res.success ? "Enrolled for exam!" : res.error);
}

async function loadResults() {
    const user_id = localStorage.getItem("user_id");

    const results = await apiGet(`/student/results/${user_id}`);

    let html = "";

    results.forEach(r => {
        html += `<p>Exam: ${r[0]} | Marks: ${r[1]} | Grade: ${r[2]}</p>`;
    });

    document.getElementById("results").innerHTML = html;
}
