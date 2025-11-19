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
            return jsonify({"error": "INVALID_LOGIN"}), 401

        user_id, role = user[0], user[1].lower()

        if role == "student":
            cur.execute("""
                SELECT * 
                FROM users 
                NATURAL JOIN students 
                WHERE user_id=%s
            """, (user_id,))

            student = cur.fetchone()
            if not student:
                return jsonify({"error": "AUTHORISATION_PENDING"}), 403

            return jsonify({"role": "student", "data": student})
        if role == "faculty":
            cur.execute("""
                SELECT * 
                FROM users 
                NATURAL JOIN faculty 
                WHERE user_id=%s
            """, (user_id,))

            faculty = cur.fetchone()
            if not faculty:
                return jsonify({"error": "AUTHORISATION_PENDING"}), 403

            return jsonify({"role": "faculty", "data": faculty})
        return jsonify({"user_id": user_id, "role": "admin"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------------------------
# ADMIN ROUTES
# -------------------------------------------

@app.route("/admin/faculty/by_dept/<dept_id>", methods=["GET"])
def get_faculty_by_department(dept_id):
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT f.faculty_id, u.user_id, u.name, u.email 
            FROM faculty f
            JOIN users u ON f.user_id = u.user_id
            WHERE f.dept_id = %s
        """, (dept_id,))

        rows = cur.fetchall()

        return jsonify([
            {
                "faculty_id": r[0],
                "user_id": r[1],
                "name": r[2],
                "email": r[3]
            }
        for r in rows])

    except Exception as e:
        return jsonify({"error": str(e)})




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


@app.route("/admin/faculty/unassigned", methods=["GET"])
def get_unassigned_faculty():
    try:
        cur = conn.cursor()

        cur.execute("""
            SELECT user_id, name, email 
            FROM users
            WHERE role = 'faculty'
            AND user_id NOT IN (
                SELECT user_id FROM faculty
            )
        """)

        faculty = cur.fetchall()

        return jsonify([{
            "user_id": f[0],
            "name": f[1],
            "email": f[2]
        } for f in faculty])

    except Exception as e:
        return jsonify({"error": str(e)})



@app.route("/admin/student/unassigned", methods=["GET"])
def get_unassigned_students():
    try:
        cur = conn.cursor()

        cur.execute("""
            SELECT user_id, name, email
            FROM users
            WHERE role = 'student'
            AND user_id NOT IN (
                SELECT user_id FROM students
            )
        """)

        students = cur.fetchall()

        return jsonify([{
            "user_id": s[0],
            "name": s[1],
            "email": s[2]
        } for s in students])

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
    

@app.route("/dept/all", methods=["GET"])
def get_all_departments():
    try:
        cur = conn.cursor()

        cur.execute("""
            SELECT dept_id, dept_name 
            FROM departments
            ORDER BY dept_id
        """)

        departments = cur.fetchall()

        return jsonify([
            {
                "dept_id": d[0],
                "dept_name": d[1]
            } for d in departments
        ])

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
@app.route("/faculty/courses/by_dept/<dept_id>", methods=["GET"])
def get_courses_by_dept(dept_id):
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT course_id, course_name 
            FROM courses
            WHERE dept_id = %s
            ORDER BY course_id
        """, (dept_id,))

        rows = cur.fetchall()

        return jsonify([
            {"course_id": r[0], "course_name": r[1]}
            for r in rows
        ])

    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/faculty/exams/by_course/<course_id>", methods=["GET"])
def get_exams_by_course(course_id):
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT exam_id, exam_name 
            FROM exams
            WHERE course_id = %s
            ORDER BY exam_id
        """, (course_id,))

        rows = cur.fetchall()

        return jsonify([
            {"exam_id": r[0], "exam_name": r[1]} for r in rows
        ])

    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/faculty/exam/students/<exam_id>", methods=["GET"])
def get_students_in_exam(exam_id):
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT er.student_id, u.name, er.marks_obtained, er.grade
            FROM exam_results er
            JOIN users u ON er.student_id = u.user_id
            WHERE er.exam_id = %s
        """, (exam_id,))

        rows = cur.fetchall()

        return jsonify([
            {
                "student_id": r[0],
                "name": r[1],
                "marks": r[2] if r[2] is not None else "",
                "grade": r[3] if r[3] is not None else ""
            }
            for r in rows
        ])

    except Exception as e:
        return jsonify({"error": str(e)})


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

        # Update existing exam result
        cur.execute("""
            UPDATE exam_results
            SET marks_obtained = %s, grade = %s
            WHERE exam_id = %s AND student_id = %s
        """, (data.marks, data.grade, data.exam_id, data.student_id))

        # If no row was updated → the student is not enrolled
        if cur.rowcount == 0:
            return jsonify({"error": "STUDENT_NOT_ENROLLED"}), 400

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
    app.run(host="0.0.0.0", port=5000, debug=True)

