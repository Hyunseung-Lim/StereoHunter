import React, { useState } from 'react'
import { MultiSelect } from 'react-multi-select-component'
import Likert from 'react-likert-scale';
import axios from "axios"
import './evaluation.css'

import {DragText} from './dragText';

export const Evaluation = (props) => {
    const [question1, setQuestion1] = useState([]);
    const [question2, setQuestion2] = useState(null);
    const [question3, setQuestion3] = useState(null);
    const [question4, setQuestion4] = useState(null);
    const [question5, setQuestion5] = useState(null);
    const [question6, setQuestion6] = useState(null);
    const [selectedText, setSelectedText] = useState([]);

    const options = [
        { value: '남자', label: '남자' },
        { value: '여자', label: '여자' },
        { value: '아빠', label: '아빠' },
        { value: '엄마', label: '엄마' },
        { value: '남편', label: '남편' },
        { value: '아내', label: '아내' },
        { value: '할아버지', label: '할아버지' },
        { value: '할머니', label: '할머니' },
        { value: '남자아이', label: '남자아이' },
        { value: '여자아이', label: '여자아이' },
        { value: '남학생', label: '남학생' },
        { value: '여학생', label: '여학생' },
        { value: '아들', label: '아들' },
        { value: '딸', label: '딸' },
        { value: '아저씨', label: '아저씨' },
        { value: '아줌마', label: '아줌마' },
        { value: '남자친구', label: '남자친구' },
        { value: '여자친구', label: '여자친구' },
        { value: '동성애자', label: '동성애자' },
        { value: '양성애자', label: '양성애자' },
        { value: '트랜스젠더', label: '트랜스젠더' },
        { value: '미용사', label: '미용사' },
        { value: '사업가', label: '사업가' },
        { value: '축구선수', label: '축구선수' },
        { value: '건설 노동자', label: '건설 노동자' },
        { value: '회계사', label: '회계사' },
        { value: '소방관', label: '소방관' },
        { value: '소프트웨어 개발자', label: '소프트웨어 개발자' },
        { value: '경호원', label: '경호원' },
        { value: '제빵사', label: '제빵사' },
        { value: '의사', label: '의사' },
        { value: '운동선수', label: '운동선수' },
        { value: '예술가', label: '예술가' },
        { value: '댄서', label: '댄서' },
        { value: '경비원', label: '경비원' },
        { value: '목수', label: '목수' },
        { value: '정비공', label: '정비공' },
        { value: '배우', label: '배우' },
        { value: '음악가', label: '음악가' },
        { value: '탐정', label: '탐정' },
        { value: '정치인', label: '정치인' },
        { value: '모델', label: '모델' },
        { value: '변호사', label: '변호사' },
        { value: '농부', label: '농부' },
        { value: '작가', label: '작가' },
        { value: '사서', label: '사서' },
        { value: '군인', label: '군인' },
        { value: '부동산 중개인', label: '부동산 중개인' },
        { value: '과학자', label: '과학자' },
        { value: '검사', label: '검사' },
        { value: '은행원', label: '은행원' },
        { value: '요리사', label: '요리사' },
        { value: '죄수', label: '죄수' },
        { value: '배관공', label: '배관공' },
        { value: '복서', label: '복서' },
        { value: '가정부', label: '가정부' },
        { value: '프로듀서', label: '프로듀서' },
        { value: '연구자', label: '연구자' },
        { value: '판사', label: '판사' },
        { value: '바텐더', label: '바텐더' },
        { value: '경제학자', label: '경제학자' },
        { value: '심리학자', label: '심리학자' },
        { value: '판매원', label: '판매원' },
        { value: '엔지니어', label: '엔지니어' },
        { value: '개그맨', label: '개그맨' },
        { value: '화가', label: '화가' },
        { value: '공무원', label: '공무원' },
        { value: '외교관', label: '외교관' },
        { value: '시인', label: '시인' },
        { value: '선생님', label: '선생님' },
        { value: '배달부', label: '배달부' },
        { value: '조종사', label: '조종사' },
        { value: '교수', label: '교수' },
        { value: '약사', label: '약사' },
        { value: '가수', label: '가수' },
        { value: '비서', label: '비서' },
        { value: '디자이너', label: '디자이너' },
        { value: '기자', label: '기자' },
        { value: '간호사', label: '간호사' },
        { value: '종업원', label: '종업원' },
        { value: '건축가', label: '건축가' },
        { value: '감독', label: '감독' },
        { value: '셰프', label: '셰프' },
        { value: '사진가', label: '사진가' },
        { value: '청소부', label: '청소부' },
        { value: '피아니스트', label: '피아니스트' },
        { value: '작곡가', label: '작곡가' },
        { value: '한국인', label: '한국인' },
        { value: '북한인', label: '북한인' },
        { value: '일본인', label: '일본인' },
        { value: '중국인', label: '중국인' },
        { value: '미국인', label: '미국인' },
        { value: '인도인', label: '인도인' },
        { value: '유럽인', label: '유럽인' },
        { value: '중동인', label: '중동인' },
        { value: '동남아인', label: '동남아인' },
        { value: '아프리카인', label: '아프리카인' },
        { value: '러시아인', label: '러시아인' },
        { value: '히스패닉', label: '히스패닉' },
        { value: '코피노', label: '코피노' }
    ]

    const likertOption3s = {
        responses: [
            { value: 1, text: "전혀 모른다" },
            { value: 2, text: "잘 모른다" },
            { value: 3, text: "어느 정도 알고 있다" },
            { value: 4, text: "잘 알고 있다" },
            { value: 5, text: "매우 잘 알고 있다" }            
        ],
        onChange: val => {
            setQuestion3(val.value);
        }
    };

    const likertOption4s = {
        responses: [
            { value: 1, text: "매우 약하게" },
            { value: 2, text: "약하게" },
            { value: 3, text: "중간" },
            { value: 4, text: "강하게" },
            { value: 5, text: "매우 강하게" }
        ],
        onChange: val => {
            setQuestion4(val.value);
        }
    };

    const handleQ2 = (index) => {
        if (question2 === index) {
          setQuestion2(null);
        } else {
          setQuestion2(index);
        }
    };

    const handleQ4 = (index) => {
        if (question5 === index) {
          setQuestion5(null);
        } else {
          setQuestion5(index);
        }
    };
    
    const handleQ5 = (index) => {
        if (question6 === index) {
          setQuestion6(null);
        } else {
          setQuestion6(index);
        }
    };

    function evaluation() {
        axios({
          method: "POST",
          url:"/evaluation",
          headers: {
            Authorization: 'Bearer ' + props.token
          },
          data: {id: props.id, targets: question1.map(response => response.value), relation: question2, familiar: question3, degree: question4, context: question5, isWordIssue: question6, words: selectedText}
        })
        .then((response) => {
          const res =response.data
          props.setLogData(
            res.logData
          )
          props.setCheckedVoca(props.getCheckedVoca(res.logData))
        })
        props.evaluationFinish();
    }

    return(
        <div className='evaluation'>
            <div className='evaluationLeft'>
                <div className='introductionOfEval'>
                    <div>[1~4] 당신이 입력한 상황과 <b>대사</b>를 종합해 답변해주세요.</div>                    
                </div>
                <div className='evalType'>
                    <div className='title'>
                        <div><b>1.</b> 해당 <b>대사</b> 속 <b>고정관념의 대상</b>을 선택해주세요.</div>
                        <div className='secondaryTitle'>복수 선택 가능합니다. 만약 대상이 리스트에 포함되어 있지 않다면 직접 추가해주세요.</div>
                    </div>
                    <MultiSelect
                        options={options}
                        value={question1}
                        hasSelectAll={false}
                        isCreatable
                        onChange={setQuestion1}
                        labelledBy="Select"
                    />
                </div>
                <div className='evalVariable'>
                    <div className='title'>
                        <div><b>2.</b> 당신은 <b>고정관념의 대상</b>에 해당하시나요?</div>
                        <div className='secondaryTitle'>대상이 여럿인 경우, 가장 주요한 대상 하나를 선정하여 답변해주세요.</div>                     
                    </div>
                    <div className='buttonHolder'>
                        <button className ={question2 === 0 ? 'clickedBtn' : null} onClick={() => handleQ2(0)}> 네 </button>
                        <button className ={question2 === 1 ? 'clickedBtn' : null} onClick={() => handleQ2(1)}> 아니오 </button>
                        <button className ={question2 === 2 ? 'clickedBtn' : null} onClick={() => handleQ2(2)}> 잘 모르겠다 </button>                        
                    </div>
                </div>
                <div className='evalVariable'>
                    <div><b>3.</b> <b>고정관념의 대상</b>에 대해 얼마나 잘 알고 있나요?</div>
                    <div className='secondaryTitle'>대상이 여럿인 경우, 가장 주요한 대상 하나를 선정하여 답변해주세요.</div>     
                    <Likert {...likertOption3s}/>
                </div>
                <div className='evalVariable'>
                    <div><b>4.</b> 해당 <b>대사</b>에 고정관념이 얼마나 강하게 반영되어 있나요?</div>
                    <Likert {...likertOption4s}/>
                </div>
            </div>
            <div className='evaluationRight'>
                <div className='introductionOfEval'>
                    <div className='introductionOfEval'>[5~6] 다음 문항부터는 당신이 입력한 <b>상황을 배제</b>하고 오직 <b>대사</b>만을 보고 답변해주세요.</div>
                </div>
                <div className='evalVariable'>
                    <div className='title'>
                        <div><b>5.</b> 해당 <b>대사만</b>을 보았을 때도 고정관념이 있다고 느껴지나요?</div>
                    </div>
                    <div className='buttonHolder'>
                        <button className ={question5 === 0 ? 'clickedBtn' : null} onClick={() => handleQ4(0)}> 네 </button>
                        <button className ={question5 === 1 ? 'clickedBtn' : null} onClick={() => handleQ4(1)}> 아니오 </button>
                        <button className ={question5 === 2 ? 'clickedBtn' : null} onClick={() => handleQ4(2)}> 잘 모르겠다 </button>                        
                    </div>
                </div>
                <div className='evalVariable'>
                    <div className='title'>
                        <div><b>6.</b> <b>대사</b> 속에 고정관념이 있다고 판단하는데 영향을 준 <b>특정 단어</b>가 있나요?</div>
                    </div>
                    <div className='buttonHolder'>
                        <button className ={question6 === 0 ? 'clickedBtn' : null} onClick={() => handleQ5(0)}> 네 </button>
                        <button className ={question6 === 1 ? 'clickedBtn' : null} onClick={() => handleQ5(1)}> 아니오 </button>
                        <button className ={question6 === 2 ? 'clickedBtn' : null} onClick={() => handleQ5(2)}> 잘 모르겠다 </button>                        
                    </div>
                </div>
                {question6 === 0 ?
                    <div className='evalVariable'>
                        <div className='title'>
                            <div><b>6-1.</b> 만약 그렇다면 <b>특정 단어</b>를 드래그해주세요.</div>
                            <div className='secondaryTitle'>리셋 버튼을 누르면 다시 드래그하실 수 있습니다.</div>     
                        </div>
                        <DragText dialoge={props.dialoge} selectedText={selectedText} setSelectedText={setSelectedText}/>
                    </div>
                    :
                    null      
                }

                <div className='evalSubmit'>
                    <button clasname='submitBtn' onClick={evaluation}>완료</button>                    
                </div>
            </div>
        </div>
    )
}