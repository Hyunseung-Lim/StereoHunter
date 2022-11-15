from flask import Blueprint, current_app, redirect, url_for, request, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from datetime import datetime, timedelta, timezone
from __init__ import create_app, db
from models import User, Log
import base64
import json
import os
import http.client



main = Blueprint('main', __name__)

# CLOVA instruction
class CompletionExecutor:
    def __init__(self, host, api_key, api_key_primary_val, request_id):
        self._host = host
        self._api_key = api_key
        self._api_key_primary_val = api_key_primary_val
        self._request_id = request_id

    def _send_request(self, completion_request):
        headers = {
            'Content-Type': 'application/json; charset=utf-8',
            'X-NCP-CLOVASTUDIO-API-KEY': self._api_key,
            'X-NCP-APIGW-API-KEY': self._api_key_primary_val,
            'X-NCP-CLOVASTUDIO-REQUEST-ID': self._request_id
        }

        conn = http.client.HTTPSConnection(self._host)
        conn.request('POST', '/testapp/v1/completions/LK-D', json.dumps(completion_request), headers)
        response = conn.getresponse()
        result = json.loads(response.read().decode(encoding='utf-8'))
        conn.close()
        return result

    def execute(self, completion_request):
        res = self._send_request(completion_request)
        if res['status']['code'] == '20000':
            return res['result']['text']
        else:
            return 'Error'

completion_executor = CompletionExecutor(
        host='clovastudio.apigw.ntruss.com',
        api_key='NTA0MjU2MWZlZTcxNDJiYxA8y9c0sJXEP022bmhK5C7k3nLxoLyC8zZBnZhiMcSP0dp/w/XwTOR3IYiWVkV2li73JC0wiC2l/BX3w/u8rKNy6U4Xztt5OTkcjAmG3haJPGKxUVU5UHc7u5QZ1WhaghSJeynqseUypkZCZCMxbtwDgspMc4uuisMHPHcSlGQFsIQGJ9uHxDw9fZqvdFFkT4/mvVEEtDF6zEClQq2LH6Y=',
        api_key_primary_val = '8Fou3JCdJboaIqZtovj3kDRfQ8cq7yJUsAzvGfOd',
        request_id='0fa5161a209848848b008d6e8db765bf'
    )

preset_text = '상황에 맞는 대사를 생성해줍니다.\n\n상황: 무를 팔아야 함\n대사: 늦어도 토요일까지는 무를 팔아야지, 안 그러면 손님은 쪽박을 치고 말아!\n###\n상황: 놀러온 이유를 설명\n대사: 내 지인인 콩돌이님이 여기에서 가게를 열었다길래궁금해서 놀러왔어~\n###\n상황: 주인공이 파인애플 쥬스를 사줬으면 좋겠음\n대사: 나 지금 목이 너무 마른데 너가 파인애플 쥬스좀 사다주면 안될까?\n###\n상황: 마을에 이상한 괴물이 나타난다는 소문이 있음\n대사: 그 괴상한 녀석들이 우리 마을을 쑥대밭으로 만들고 있어!\n###\n상황: 영월의 검을 업그레이드 해주는 대장간 주인\n대사: 영월의 검은 이제 더 강해질 수 있습니다.\n###\n상황: '


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
    new_user = User(
        email = email,
        name = name,
        password = generate_password_hash(password, method='sha256'),
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

    logData = []
    logs = Log.query.filter_by(user_id=user.id)
    for log in logs:
        userLog = {"id": log.id, "input": log.input, "output": log.output}
        logData.append(userLog)
    logData.reverse()
    return {"logData": logData, "name": name}

@main.route("/getInput", methods=["POST"])
@cross_origin()
@jwt_required()
def getinput():
    user = User.query.filter_by(email=get_jwt_identity()).first()
    params = request.get_json()
    inputData = params['inputData']

    request_data = {
        'text': preset_text + inputData,
        'maxTokens': 200,
        'temperature': 0.2,
        'topK': 0,
        'topP': 0.8,
        'repeatPenalty': 5.0,
        'start': '\n대사:',
        'restart': '\n###\n상황:',
        'stopBefore': ['###', '상황:', '대사:', '###\n'],
        'includeTokens': False,
        'includeAiFilters': True,
        'includeProbs': True
    }
    response_text = completion_executor.execute(request_data).split("대사: ")[-1].split("\n###")[0]
    new_log = Log(
        user_id = user.id,
        input = inputData,
        output = response_text
    )
    db.session.add(new_log)
    db.session.commit()

    logData = []
    logs = Log.query.filter_by(user_id=user.id)
    for log in logs:
        userLog = {"id": log.id, "input": log.input, "output": log.output}
        logData.append(userLog)
    logData.reverse()
    return {"logData": logData, "result": response_text}

    

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
