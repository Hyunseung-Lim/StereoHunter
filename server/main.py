from flask import Blueprint, current_app, redirect, url_for, request, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from datetime import datetime, timedelta, timezone
from __init__ import create_app, db
from models import User, Book
import json
import os

main = Blueprint('main', __name__)

@main.route("/signup", methods=['POST'])
@cross_origin()
def signup():
    params = request.get_json()
    email = params['email']
    name = params['name']
    password = params['password']
    # photo = request.files["photo"]
    user = User.query.filter_by(email=email).first() # if this returns a user, then the email already exists in database
    if user: # if a user is found, we want to redirect back to signup page so user can try again
        # flash('Email address already exists')
        return {"":""}
    # if photo:
    #     # uniq_filename = make_unique(photo.filename)
    #     # photo_path = join(current_app.config['UPLOAD_FOLDER'],"photo",uniq_filename)
    #     # photo.save(photo_path)       
    #     pass
    # else:
    photo_path = ""
    new_user = User(
        email = email,
        name = name,
        password = generate_password_hash(password, method='sha256'),
        photo = os.path.split(photo_path)[1],
        posts = 0
    )
    db.session.add(new_user)
    db.session.commit()
    return {"msg": "make account successful"}
    

@main.after_request
@cross_origin()
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response    

@main.route("/token", methods=['POST'])
@cross_origin()
def create_token():
    params = request.get_json()
    email = params['email']
    password = params['password']
    user = User.query.filter_by(email=email).first()
    if not user:
        flash('Please sign up before!')
        return {"msg": "Wrong email or password"}, 401
    elif not check_password_hash(user.password, password):
        flash('Please check your login details and try again.')
        return {"msg": "Wrong email or password"}, 401

    access_token = create_access_token(identity=email)
    response = {"access_token":access_token}
    return response

@main.route("/logout", methods=["POST"])
@cross_origin()
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@main.route("/profile")
@jwt_required()
def profile():
    user = User.query.filter_by(email=get_jwt_identity()).first()
    name = user.name
    response = jsonify({"name": name})
    return response

    
    

# @main.route("/home")
# @jwt_required()
# def home():
#     user = User.query.filter_by(email=get_jwt_identity()).first()
#     posts = Post.query.filter_by(user_id=user.id)
#     posts_data = {}
#     for post in posts:
#         num = post.post_num
#         posts_data[num] = {
#             "post_image": post.post_image,
#             "post_text": post.post_text
#         }
#     return {"posts": posts_data}

# @main.route("/upload", methods=["POST"])
# @cross_origin()
# @jwt_required()
# def upload():
#     user = User.query.filter_by(email=get_jwt_identity()).first()
#     image = request.files['post_image']
#     post_text = request.form.get("post_text")
#     post_num = user.posts + 1
#     post_image = "u" + str(user.id) + "_p" + str(post_num) + ".png"
#     if image:
#         image.save(os.path.join(current_app.config['UPLOAD_FOLDER'] + "/photo/", post_image))
#     new_post = Post(
#         post_num = post_num,
#         user_id = user.id,
#         post_image = post_image,
#         post_text = post_text
#     )
#     user.posts = post_num
#     db.session.add(new_post)
#     db.session.commit()
#     return {"msg": post_text}

app = create_app()
if __name__ == '__main__':
    db.create_all(app=create_app())
    app.run(debug=True)