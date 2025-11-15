async function loadCourses() {
  const list = document.getElementById("courseList");
  const data = await api("/courses");

  data.forEach(c => {
    const div = document.createElement("div");
    div.textContent = `${c.course_code} - ${c.course_name}`;
    div.onclick = () => {
      localStorage.setItem("course_id", c.course_id);
      location.href = "exams.html";
    };
    list.appendChild(div);
  });
}

loadCourses();
