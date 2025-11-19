from flask import Flask, jsonify, request
import psycopg
from schemas import (
    RegisterUser, LoginUser, CreateDepartment,
    AssignFaculty, CreateCourse, CreateExam, GradeExam
)
from flask_cors import CORS

app = Flask(__name__)

conn = psycopg.connect(
    dbname="dbms",
    user="postgres",
    password="kovoor@73",
    host="localhost",
    port="5432"
)


CORS(app)

@app.route("/register", methods=["POST"])
def register():
    try:
        data = RegisterUser(**request.json)
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO users(name, email, password, role, dob, address)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING user_id
        """, (data.name, data.email, data.password, data.role, data.dob, data.address))

        user_id = cur.fetchone()[0]
        conn.commit()

        return jsonify({"success": True, "user_id": user_id})

    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/login", methods=["POST"])
def login():
    try:
        data = LoginUser(**request.json)
        cur = conn.cursor()

        cur.execute("""
            SELECT user_id, role FROM users WHERE email=%s AND password=%s
        """, (data.email, data.password))

        user = cur.fetchone()
        if not user:
            return jsonify({"error": "INVALID_LOGIN"})

        return jsonify({"user_id": user[0], "role": user[1]})

    except Exception as e:
        return jsonify({"error": str(e)})


# -------------------------------------------
# ADMIN ROUTES
# -------------------------------------------

@app.route("/admin/dept/create", methods=["POST"])
def create_department():
    try:
        data = CreateDepartment(**request.json)
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO departments(dept_id, dept_name, dept_code)
            VALUES (%s, %s, %s)
        """, (data.dept_id, data.dept_name, data.dept_code))

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/admin/faculty/assign", methods=["POST"])
def assign_faculty():
    try:
        data = AssignFaculty(**request.json)
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO faculty(faculty_id, user_id, dept_id)
            VALUES (%s, %s, %s)
        """, (data.faculty_id, data.user_id, data.dept_id))

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/admin/student/assign", methods=["POST"])
def assign_student():
    try:
        from schemas import AssignStudent
        data = AssignStudent(**request.json)
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO students(user_id, semester, roll_number, cgpa)
            VALUES (%s, %s, %s, %s)
        """, (data.user_id, data.semester, data.roll_number, data.cgpa))

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/admin/course/create", methods=["POST"])
def create_course():
    try:
        data = CreateCourse(**request.json)
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO courses(course_id, dept_id, faculty_id, course_name, semester)
            VALUES (%s, %s, %s, %s, %s)
        """, (data.course_id, data.dept_id, data.faculty_id, data.course_name, data.semester))

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)})


# -------------------------------------------
# FACULTY ROUTES
# -------------------------------------------

@app.route("/faculty/exam/create", methods=["POST"])
def faculty_create_exam():
    try:
        data = CreateExam(**request.json)
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO exams(exam_id, course_id, exam_name, exam_date, total_marks)
            VALUES (%s, %s, %s, %s, %s)
        """, (data.exam_id, data.course_id, data.exam_name, data.exam_date, data.total_marks))

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/faculty/exam/grade", methods=["POST"])
def grade_student():
    try:
        data = GradeExam(**request.json)
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO exam_results(exam_id, student_id, marks_obtained, grade)
            VALUES (%s, %s, %s, %s)
        """, (data.exam_id, data.student_id, data.marks, data.grade))

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)})


# -------------------------------------------
# STUDENT ROUTES
# -------------------------------------------

@app.route("/student/exam/enroll", methods=["POST"])
def student_enroll_exam():
    try:
        exam_id = request.json["exam_id"]
        user_id = request.json["user_id"]

        cur = conn.cursor()
        cur.execute("""
            INSERT INTO exam_results(exam_id, student_id, marks_obtained)
            VALUES (%s, %s, 0)
        """, (exam_id, user_id))

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/student/course/enroll", methods=["POST"])
def student_enroll_course():
    try:
        user_id = request.json["user_id"]
        course_id = request.json["course_id"]

        cur = conn.cursor()
        cur.execute("""
            INSERT INTO student_courses(user_id, course_id)
            VALUES (%s, %s)
        """, (user_id, course_id))

        conn.commit()
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/student/results/<user_id>", methods=["GET"])
def student_results(user_id):
    cur = conn.cursor()
    cur.execute("""
        SELECT exam_id, marks_obtained, grade
        FROM exam_results
        WHERE student_id=%s
    """, (user_id,))
    data = cur.fetchall()
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
