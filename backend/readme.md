# 📘 **Student Exam System**

Base URL (local):

```
http://localhost:5000
```

---

# ------------------------------------------

# **AUTHENTICATION**

# ------------------------------------------

## **POST /register**

Register a user.

### **Request Body**

```json
{
  "name": "Rohith",
  "email": "rohith@example.com",
  "password": "mypassword",
  "role": "student",
  "dob": "2003-07-12",
  "address": "Kochi, Kerala"
}
```

---

## **POST /login**

Login user.

### **Request Body**

```json
{
  "email": "rohith@example.com",
  "password": "mypassword"
}
```

---

# ------------------------------------------

# **ADMIN FUNCTIONALITY**

# ------------------------------------------

## **POST /admin/department/create**

Create a new department.

### **Request Body**

```json
{
  "dept_name": "Computer Science",
  "dept_code": "CSE"
}
```

---

## **POST /admin/faculty/assign**

Assign an existing user as faculty under a department.

### **Request Body**

```json
{
  "user_id": 12,
  "dept_id": 1,
  "salary": 55000
}
```

---

# ------------------------------------------

# **FACULTY FUNCTIONALITY**

# ------------------------------------------

## **POST /faculty/exam/create**

Create an exam for a course.

### **Request Body**

```json
{
  "course_id": 5,
  "exam_date": "2025-02-15",
  "total_marks": 100,
  "exam_name": "Midterm Examination"
}
```

---

## **POST /faculty/exam/grade**

Grade a student's submitted exam.

### **Request Body**

```json
{
  "exam_id": 3,
  "student_id": 21,
  "marks_obtained": 86,
  "grade": "A"
}
```

---

## **GET /faculty/students/search?q=VALUE**

Search students by:

* name
* email
* roll number

### Example:

```
/faculty/students/search?q=roh
```

### **Response**

```json
{
  "students": [
    [21, "Rohith", "rohith@example.com", "CS23B001"]
  ]
}
```

---

# ------------------------------------------

# **STUDENT FUNCTIONALITY**

# ------------------------------------------

## **POST /student/course/enroll**

Enroll student into a course.

### **Request Body**

```json
{
  "user_id": 21,
  "course_id": 5
}
```

---

## **POST /student/exam/submit**

Submit exam answers (simple scoring).

### **Request Body**

```json
{
  "exam_id": 3,
  "student_id": 21,
  "marks_obtained": 72
}
```

---

## **GET /student/results/{user_id}**

View student results.

### Example:

```
/student/results/21
```

### **Response Example**

```json
{
  "results": [
    ["Midterm Examination", 100, 72, "B+"]
  ]
}
```

---

# ------------------------------------------

# **Summary Table**

# ------------------------------------------

| Method | Endpoint                   | Purpose           | Body             |
| ------ | -------------------------- | ----------------- | ---------------- |
| POST   | `/register`                | Create user       | RegisterUser     |
| POST   | `/login`                   | Login             | LoginUser        |
| POST   | `/admin/department/create` | Create department | CreateDepartment |
| POST   | `/admin/faculty/assign`    | Assign faculty    | AssignFaculty    |
| POST   | `/faculty/exam/create`     | Create exam       | CreateExam       |
| POST   | `/faculty/exam/grade`      | Grade exam        | GradeExam        |
| GET    | `/faculty/students/search` | Search students   | Query param      |
| POST   | `/student/course/enroll`   | Enroll in course  | EnrollCourse     |
| POST   | `/student/exam/submit`     | Submit exam       | TakeExam         |
| GET    | `/student/results/{id}`    | View results      | —                |

---
