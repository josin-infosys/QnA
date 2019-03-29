#   IMPORTS

from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_mysqldb import MySQL
from flask_mail import Mail, Message
from random import randint










#   CONFIGS

app = Flask(__name__)
app.secret_key = 'jabberwocky'

app.config["MYSQL_HOST"] = "cser.mysql.pythonanywhere-services.com"
app.config["MYSQL_USER"] = "cser"
app.config["MYSQL_PASSWORD"] = "g0dFATh3r"
app.config["MYSQL_DB"] = "cser$qnaDB"
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 465
app.config["MAIL_USERNAME"] = "cserqna@gmail.com"
app.config["MAIL_PASSWORD"] = "g0dFATh3r"
app.config["MAIL_USE_SSL"] = True

mysql = MySQL(app)
mail = Mail(app)










#   HOME VIEWS

@app.route('/')
def index():
    if 'uname' in session:
        if session['utype'] == 0:
            return redirect(url_for('userHome'))
        else:
            return redirect(url_for('editorHome'))
    return render_template('index.html')

@app.route('/login/')
def login():
    if 'uname' in session:
        if session['utype'] == 0:
            return redirect(url_for('userHome'))
        else:
            return redirect(url_for('editorHome'))
    return render_template('login.html')

@app.route('/login/action/', methods=["POST"])
def loginAction():
    uname = request.form['uname']
    pwd = request.form['pass']

    cur = mysql.connection.cursor()
    cur.execute('''select * from users''')
    rv = cur.fetchall()

    for item in rv:
        if item[2] == uname and item[4] == pwd:
            session['uname'] = uname
            session['utype'] = item[5]
            if item[5] == 0:
                return redirect(url_for('userHome'))
            else:
                return redirect(url_for('editorHome'))

    return "no"

@app.route('/register/')
def register():
    if 'uname' in session:
        if session['utype'] == 0:
            return redirect(url_for('userHome'))
        else:
            return redirect(url_for('editorHome'))
    return render_template('register.html')

@app.route('/register/otp/', methods=["POST"])
def regOtp():
    session['regFname'] = request.form['fname']
    session['regUname'] = request.form['uname']
    session['regPwd'] = request.form['pwd']
    session['regEmail'] = request.form['email']

    cur = mysql.connection.cursor()
    cur.execute('''select * from users''')
    rv = cur.fetchall()

    for item in rv:
        if item[2] == session['regUname']:
            return "uname"
        elif item[3] == session['regEmail']:
            return "email"

    session['regOtp'] = str(randint(100000,999999))

    msg = Message("Verify registration to QnA", sender="cserqna@gmail.com", recipients=[session['regEmail']])
    msg.body = "Your registration OTP is: " + str(session['regOtp'])
    mail.send(msg)

    return render_template('regOtp.html')

@app.route('/register/action/', methods=["POST"])
def registerAction():
    otp = request.form['otp']
    if otp == session['regOtp']:
        cur = mysql.connection.cursor()
        cur.execute('''insert into users(name, username, email, password, usertype) values(%s, %s, %s, %s, 0)''', (session['regFname'], session['regUname'], session['regEmail'], session['regPwd']))
        mysql.connection.commit()

        session['uname'] = session['regUname']
        session['utype'] = 0

        return "pass"

    return session['regOtp']

@app.route('/logout/')
def logout():
    session.clear()
    return redirect(url_for('index'))










#   USER VIEWS

@app.route('/user/home/')
def userHome():
    if 'uname' not in session:
        return redirect(url_for('index'))
    elif session['utype'] > 0:
        return redirect(url_for('editorHome'))
    return render_template('userHome.html')










#   EDITOR VIEWS

@app.route('/editor/home')
def editorHome():
    if 'uname' not in session:
        return redirect(url_for('index'))
    elif session['utype'] == 0:
        return redirect(url_for('userHome'))
    return render_template('editorHome.html')

