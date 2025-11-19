async function createDept() {
  const dept_id = document.getElementById("dept_id").value;
  const dept_name = document.getElementById("dept_name").value;
  const dept_code = document.getElementById("dept_code").value;
  const res = await apiPost("/admin/dept/create", { dept_id, dept_name, dept_code });
  if (res.error) alert("Error: " + res.error);
  else alert("Department created!");
}

async function assignFaculty() {
  const faculty_id = document.getElementById("faculty_id").value;
  const user_id = Number(document.getElementById("user_id").value);
  const dept_id = document.getElementById("dept").value;
  const res = await apiPost("/admin/faculty/assign", { faculty_id, user_id, dept_id });
  if (res.error) alert("Error: " + res.error);
  else alert("Faculty assigned!");
}

async function assignStudent() {
  const user_id = Number(document.getElementById("stu_user_id").value);
  const semester = Number(document.getElementById("semester").value);
  const roll_number = document.getElementById("roll_number").value;
  const cgpa = parseFloat(document.getElementById("cgpa").value);
  const res = await apiPost("/admin/student/assign", { user_id, semester, roll_number, cgpa });
  if (res.error) alert("Error: " + res.error);
  else alert("Student assigned!");
}

async function createCourse() {
  const course_id = document.getElementById("course_id").value;
  const dept_id = document.getElementById("course_dept").value;
  const faculty_id = document.getElementById("course_faculty").value;
  const course_name = document.getElementById("course_name").value;
  const semester = Number(document.getElementById("course_sem").value);
  const res = await apiPost("/admin/course/create", { course_id, dept_id, faculty_id, course_name, semester });
  if (res.error) alert("Error: " + res.error);
  else alert("Course created!");
}
