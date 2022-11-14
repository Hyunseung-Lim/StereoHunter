from flask_login import UserMixin
from __init__ import db

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))
    photo = db.Column(db.String(1000))
    posts = db.Column(db.Integer)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    num = db.Column(db.Integer)
    name = db.Column(db.String(1000))
    bookData = db.Column(db.JSON)
    
# class Post(db.Model):
#     id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
#     post_num = db.Column(db.Integer)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
#     user = db.relationship('User', backref=db.backref('user', lazy=True))
#     post_image = db.Column(db.String(1000))
#     post_text = db.Column(db.JSON)