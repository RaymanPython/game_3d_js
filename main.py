import flask
from flask import Flask
from flask import request, abort, render_template, redirect
import json
import sqlite3
import sqlalchemy as sa
import sqlalchemy.orm as orm
from sqlalchemy.orm import Session
import sqlalchemy.ext.declarative as dec
import datetime
from sqlalchemy import orm
from data.users import User, User_records
from data import db_session
from flask import send_from_directory

from flask import json
from forms.user import RegisterForm




app = Flask(__name__)
app.config['JS_FOLDER'] = 'js'
app.config['IMG_FOLDER'] = 'img'
blueprint = flask.Blueprint(
    'js_api',
    __name__,
    template_folder='templates'
)


@blueprint.route('/js_api/js/<string:js_name>', methods=['GET'])
def get_js(js_name):
    return send_from_directory(app.config["JS_FOLDER"], js_name)

@blueprint.route('/js_api/img/<string:img_name>', methods=['GET'])
def get_jmg(img_name):
    return send_from_directory(app.config["IMG_FOLDER"], img_name)
       


@app.route('/')
def index():
    return render_template('index.html')



@app.before_first_request
def startup():
    db_session.global_init("db/blogs.db")





if __name__ == "__main__":
    app.register_blueprint(blueprint)
    app.run()