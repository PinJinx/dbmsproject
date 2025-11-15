async function loadResults() {
  const list = document.getElementById("results");
  const results = await api("/results");

  results.forEach(r => {
    const div = document.createElement("div");
    div.textContent =
      `Course: ${r.course_name} | Exam: ${r.exam_type} | Marks: ${r.marks}`;
    list.appendChild(div);
  });
}

loadResults();
