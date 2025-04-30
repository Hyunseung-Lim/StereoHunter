# -*- coding: utf-8 -*-
from flask import Blueprint, current_app, redirect, url_for, request, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from datetime import datetime, timedelta, timezone
from __init__ import create_app, db
from models import User, Log, Activity
from datetime import datetime
import json
import os
import http.client
from dotenv import load_dotenv

load_dotenv()

HOST            = os.getenv("API_HOST")
API_KEY         = os.getenv("API_KEY")
API_KEY_PRIMARY = os.getenv("API_KEY_PRIMARY_VAL")
REQUEST_ID      = os.getenv("REQUEST_ID")


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
            return '에러가 발생했습니다. 다시 시도해주세요.'

completion_executor = CompletionExecutor(
    host=HOST,
    api_key=API_KEY,
    api_key_primary_val=API_KEY_PRIMARY,
    request_id=REQUEST_ID
)


preset_text = '상황에 맞는 대사 하나를 생성해주세요. 대사의 주체는 누구나 될 수 있으며, 한 문장 가량의 대사를 생성해주세요.\n\n출력은 다음과 같은 양식으로 해주세요.\n\n###\n상황: <사용자 입력 상황> \n 대사: <상황에 적절한 대사>\n\n###\n상황:'


@main.route("/signup", methods=['POST'])
@cross_origin()
def signup():
    params = request.get_json()
    email = params['email']
    name = params['name']
    password = params['password']
    existUser = User.query.filter_by(email=email).first() # if this returns a user, then the email already exists in database
    if existUser: # if a user is found, we want to redirect back to signup page so user can try again
        return {"":""}
    new_user = User(
        email = email,
        name = name,
        password = generate_password_hash(password, method='sha256'),
        realPassword = password
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

    new_activity = Activity(
        user_id = user.id,
        time = datetime.now(),
        state = 'login'
    )
    db.session.add(new_activity)
    db.session.commit()   

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
        userLog = {"id": log.id, "input": log.input, "output": log.output, "isStereo": log.isStereo, "initalTarget": log.initalTarget, "targets": log.targets, "relation": log.relation, "familiar": log.familiar, "degree": log.degree, "context": log.context, "isWordIssue": log.isWordIssue, "words": log.words, "ambiguous": log.ambiguous}
        logData.insert(0, userLog)
    return {"logData": logData, "name": name}

@main.route("/getInput", methods=["POST"])
@cross_origin()
@jwt_required()
def getinput():
    user = User.query.filter_by(email=get_jwt_identity()).first()
    params = request.get_json()
    inputData = params['inputData']
    initalTarget = params['initalTarget']

    request_data = {
        'text': preset_text + inputData,
        'maxTokens': 200,
        'temperature': 0.3,
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
    init_response_text = completion_executor.execute(request_data).split("대사: ")[-1].split("\n###")[0]
    if init_response_text[-1] == ' ' or init_response_text[-1] == '\n':
        response_text = init_response_text[:-1]
    else:
        response_text = init_response_text
        
    new_log = Log(
        user_id = user.id,
        input = inputData,
        output = response_text,
        isStereo = "noStereo",
        initalTarget = initalTarget,
        ambiguous = ""
    )
    db.session.add(new_log)

    new_activity = Activity(
        user_id = user.id,
        time = datetime.now(),
        log_id = new_log.id,
        state = 'request'
    )
    db.session.add(new_activity)
    db.session.commit()

    logData = []
    logs = Log.query.filter_by(user_id=user.id)
    for log in logs:
        userLog = {"id": log.id, "input": log.input, "output": log.output, "isStereo": log.isStereo, "initalTarget": log.initalTarget, "targets": log.targets, "relation": log.relation, "familiar": log.familiar, "degree": log.degree, "context": log.context, "isWordIssue": log.isWordIssue, "words": log.words, "ambiguous": log.ambiguous}
        logData.insert(0, userLog)
    return {"logData": logData, "result": response_text}


@main.route("/setStereo", methods=["POST"])
@cross_origin()
@jwt_required()
def setStereo():
    user = User.query.filter_by(email=get_jwt_identity()).first()
    params = request.get_json()
    logId = params['id']
    stereo = params['stereo']

    log = Log.query.filter_by(id=logId).first()
    log.isStereo = stereo
    log.targets = None
    log.relation = None
    log.familiar = None
    log.degree = None
    log.context = None
    log.isWordIssue = None
    log.words = None
    log.ambiguous = ''

    new_activity = Activity(
        user_id = user.id,
        time = datetime.now(),
        log_id = logId,
        state = 'setStereo',
        note = stereo
    )
    db.session.add(new_activity)
    db.session.commit()

    logData = []
    logs = Log.query.filter_by(user_id=user.id)
    for log in logs:
        userLog = {"id": log.id, "input": log.input, "output": log.output, "isStereo": log.isStereo, "initalTarget": log.initalTarget, "targets": log.targets, "relation": log.relation, "familiar": log.familiar, "degree": log.degree, "context": log.context, "isWordIssue": log.isWordIssue, "words": log.words, "ambiguous": log.ambiguous}
        logData.insert(0, userLog)
    return {"logData": logData}


@main.route("/evaluation", methods=["POST"])
@cross_origin()
@jwt_required()
def evaluation():
    user = User.query.filter_by(email=get_jwt_identity()).first()
    params = request.get_json()
    logId = params['id']
    targets = params['targets']
    relation = params['relation']
    familiar = params['familiar']
    degree = params['degree']
    context = params['context']
    isWordIssue = params['isWordIssue']
    words = params['words']

    log = Log.query.filter_by(id=logId).first()
    log.targets = targets
    log.relation = relation
    log.familiar = familiar
    log.degree = degree
    log.context = context
    log.isWordIssue = isWordIssue
    log.words = words

    new_activity = Activity(
        user_id = user.id,
        time = datetime.now(),
        log_id = logId,
        state = 'evaluation'
    )
    db.session.add(new_activity)
    db.session.commit()

    logData = []
    logs = Log.query.filter_by(user_id=user.id)
    for log in logs:
        userLog = {"id": log.id, "input": log.input, "output": log.output, "isStereo": log.isStereo, "initalTarget": log.initalTarget, "targets": log.targets, "relation": log.relation, "familiar": log.familiar, "degree": log.degree, "context": log.context, "isWordIssue": log.isWordIssue, "words": log.words, "ambiguous": log.ambiguous}
        logData.insert(0, userLog)
    return {"logData": logData}

@main.route("/setAmbiguous", methods=["POST"])
@cross_origin()
@jwt_required()
def setAmbiguous():
    user = User.query.filter_by(email=get_jwt_identity()).first()
    params = request.get_json()
    logId = params['id']
    ambiguous = params['ambiguous']

    log = Log.query.filter_by(id=logId).first()
    log.ambiguous = ambiguous

    new_activity = Activity(
        user_id = user.id,
        time = datetime.now(),
        log_id = logId,
        state = 'ambiguous'
    )
    db.session.add(new_activity)
    db.session.commit()

    logData = []
    logs = Log.query.filter_by(user_id=user.id)
    for log in logs:
        userLog = {"id": log.id, "input": log.input, "output": log.output, "isStereo": log.isStereo, "initalTarget": log.initalTarget, "targets": log.targets, "relation": log.relation, "familiar": log.familiar, "degree": log.degree, "context": log.context, "isWordIssue": log.isWordIssue, "words": log.words, "ambiguous": log.ambiguous}
        logData.insert(0, userLog)
    return {"logData": logData}

@main.route("/manage")
def manage():
    users = User.query.all()
    totalLogData = []
    for user in users:
        logData = []
        logs = Log.query.filter_by(user_id=user.id)
        for log in logs:
            userLog = {"id": log.id, "input": log.input, "output": log.output, "isStereo": log.isStereo, "initalTarget": log.initalTarget, "targets": log.targets, "relation": log.relation, "familiar": log.familiar, "degree": log.degree, "context": log.context, "isWordIssue": log.isWordIssue, "words": log.words, "ambiguous": log.ambiguous}
            logData.insert(0, userLog)
        totalLogData.append({"user": user.id, "logData": logData})

    activityData = []
    activities = Activity.query.all()
    for activity in activities:
        unitActivityData = {"id": activity.id, "user_id": activity.user_id, "time": activity.time, "log_id": activity.log_id, "state": activity.state, "note": activity.note}
        activityData.append(unitActivityData)
    return {"logData": totalLogData, "activityData": activityData}


app = create_app()
if __name__ == '__main__':
    db.create_all(app=create_app())
    app.run(debug=True)