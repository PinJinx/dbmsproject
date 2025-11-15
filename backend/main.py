from flask import Flask, jsonify,request
import psycopg
from schemas import RegisterUser,LoginUser
app = Flask(__name__)

conn = psycopg.connect(
    dbname="dbmsproject",
    user="postgres",
    password="kovoor@73",
    host="localhost",
    port="5432"
)

@app.route('/')
def index():
    return jsonify({'Test':'Hello'})



@app.route('/register', methods=['POST'])
def register_user():
    try:
        cursor = conn.cursor()
        user = RegisterUser(**request.get_json())
        cursor.execute('''
        INSERT INTO users (name, email, password, role,dob,address)
        VALUES (%s, %s, %s, %s,%s,%s);''',(user.name,user.email,user.password,user.role,user.dob,user.address))
        conn.commit()
        cursor.close()
        return jsonify({"Sucess":"Database Updated"}),200
        
    except Exception as e:
        return jsonify({"Error":str(e)}),201




@app.route('/login', methods=['POST'])
def login_user():
    try:
        cursor = conn.cursor()
        user = LoginUser(**request.get_json())
        cursor.execute('''
        select * from users where email=%s and password=%s 
        ''',(user.email,user.password))
        
        response = cursor.fetchone()
        if(response == None):
            return jsonify({"Error":"User_Not_Found"}),400
        else:
            cursor.close()
            return jsonify({"data":response}),200
    except Exception as e:
        return jsonify({"Error":str(e)}),201



@app.route('/course/add', methods=['POST'])
def add_course():
    try:
        cursor = conn.cursor()
        user = LoginUser(**request.get_json())
        cursor.execute('''
        select * from users where email=%s and password_hash=%s 
        ''',(user.email,user.password))
        
        response = cursor.fetchone()
        if(response == None):
            return jsonify({"Error":"User_Not_Found"}),400
        else:
            cursor.close()
            return jsonify({"data":response}),200
    except Exception as e:
        return jsonify({"Error":str(e)}),201



if __name__ == '__main__':
    app.run(debug=True)







