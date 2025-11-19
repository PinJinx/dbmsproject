async function enrollCourse() {
  const user_id = localStorage.getItem("user_id");
  const course_id = document.getElementById("en_course_id").value;
  const res = await apiPost("/student/course/enroll", { user_id, course_id });
  if (res.error) alert("Error: " + res.error);
  else alert("Enrolled in course!");
}

async function enrollExam() {
  const user_id = localStorage.getItem("user_id");
  const exam_id = document.getElementById("en_exam_id").value;
  const res = await apiPost("/student/exam/enroll", { user_id, exam_id });
  if (res.error) alert("Error: " + res.error);
  else alert("Enrolled for exam!");
}

async function loadResults() {
  const user_id = localStorage.getItem("user_id");
  if (!user_id) { document.getElementById("results").innerText = "Not logged in."; return; }
  const res = await apiGet(`/student/results/${user_id}`);
  if (res.error) {
    document.getElementById("results").innerText = "Error: " + res.error;
    return;
  }
  if (!Array.isArray(res) || res.length === 0) {
    document.getElementById("results").innerText = "No results yet.";
    return;
  }
  let html = "";
  res.forEach(r => {
    html += `<p><strong>Exam:</strong> ${r[0]} &nbsp; <strong>Marks:</strong> ${r[1]} &nbsp; <strong>Grade:</strong> ${r[2] || "-"}</p>`;
  });
  document.getElementById("results").innerHTML = html;
}
