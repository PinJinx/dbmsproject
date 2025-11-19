# schemas.py
from pydantic import BaseModel
from typing import Literal

class RegisterUser(BaseModel):
    name: str
    email: str
    password: str
    role: Literal["student", "faculty", "admin"]
    dob: str
    address: str

class LoginUser(BaseModel):
    email: str
    password: str

class CreateDepartment(BaseModel):
    dept_id: str
    dept_name: str
    dept_code: str

class AssignFaculty(BaseModel):
    faculty_id: str
    user_id: int
    dept_id: str

class AssignStudent(BaseModel):
    user_id: int
    semester: int
    roll_number: str
    cgpa: float


    
class CreateCourse(BaseModel):
    course_id: str
    dept_id: str
    faculty_id: str
    course_name: str
    semester: int

class CreateExam(BaseModel):
    exam_id: str
    course_id: str
    exam_date: str
    total_marks: int
    exam_name: str

class GradeExam(BaseModel):
    exam_id: str
    student_id: str
    marks: int
    grade: str
