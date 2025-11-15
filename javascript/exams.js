async function loadExams() {
  const courseId = localStorage.getItem("course_id");
  const list = document.getElementById("examList");

  const exams = await api(`/exams/${courseId}`);

  exams.forEach(e => {
    const div = document.createElement("div");
    div.textContent = `${e.exam_type} on ${e.exam_date}`;
    list.appendChild(div);
  });
}

loadExams();
