import React, { useState } from 'react'
import Select from 'react-select'
import Likert from 'react-likert-scale';
import axios from "axios"
import './evaluation.css'

import {DragText} from './dragText';

export const Evaluation = (props) => {
    const [question1, setQuestion1] = useState(null);
    const [question2, setQuestion2] = useState(null);
    const [question3, setQuestion3] = useState(null);
    const [question4, setQuestion4] = useState(null);
    const [question5, setQuestion5] = useState(null);
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
        { value: '신사', label: '신사' },
        { value: '숙녀', label: '숙녀' }
    ]

    const likertOptions = {
        responses: [
            { value: 1, text: "매우 약하게" },
            { value: 2, text: "약하게" },
            { value: 3, text: "중간" },
            { value: 4, text: "강하게" },
            { value: 5, text: "매우 강하게" }
        ],
        onChange: val => {
            setQuestion3(val.value);
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
        if (question4 === index) {
          setQuestion4(null);
        } else {
          setQuestion4(index);
        }
    };
    
    const handleQ5 = (index) => {
        if (question5 === index) {
          setQuestion5(null);
        } else {
          setQuestion5(index);
        }
    };

    function evaluation() {
        axios({
          method: "POST",
          url:"/evaluation",
          headers: {
            Authorization: 'Bearer ' + props.token
          },
          data: {id: props.id, targets: question1, relation: question2, degree: question3, context: question4, isWordIssue: question5, words: selectedText}
        })
        .then((response) => {
          const res =response.data
          props.setLogData(
            res.logData
          )
        })
        props.evaluationFinish();
    }

    return(
        <div className='evaluation'>
            <div className='evaluationLeft'>
                <div className='introductionOfEval'>
                    <div>당신이 입력한 상황과 <b>대사</b>를 종합해 답변해주세요.</div>                    
                </div>
                <div className='evalType'>
                    <div className='title'>
                        <div>1. 해당 <b>대사</b> 속 <b>고정관념의 대상</b>을 선택해주세요.</div>                
                    </div>
                    <Select isMulti onChange={(choice) => setQuestion1(choice)} options={options} />
                </div>
                <div className='evalVariable'>
                    <div className='title'>
                        <div>2. 당신과 <b>고정관념의 대상</b>과의 관계는?</div>                        
                    </div>
                    <button className ={question2 === 0 ? 'clickedBtn' : null} onClick={() => handleQ2(0)}> 내가 <b>고정관념의 대상</b>이다 </button>
                    <button className ={question2 === 1 ? 'clickedBtn' : null} onClick={() => handleQ2(1)}> 내가 <b>고정관념의 대상</b>은 아니지만 <b>고정관념의 대상</b>을 잘 알고있다 </button>
                    <button className ={question2 === 2 ? 'clickedBtn' : null} onClick={() => handleQ2(2)}> <b>고정관념의 대상</b>을 어느정도 알고있다 </button>
                    <button className ={question2 === 3 ? 'clickedBtn' : null} onClick={() => handleQ2(3)}> <b>고정관념의 대상</b>에 대해 약간은 알고있다 </button>
                    <button className ={question2 === 4 ? 'clickedBtn' : null} onClick={() => handleQ2(4)}> <b>고정관념의 대상</b>에 대해 잘 모른다 </button>
                </div>
                <div className='evalVariable'>
                    <div>3. 해당 <b>대사</b>에 고정관념이 얼마나 강하게 반영되어 있나요?</div>
                    <Likert {...likertOptions}/>
                </div>
            </div>
            <div className='evaluationRight'>
                <div className='introductionOfEval'>
                    <div className='introductionOfEval'>다음 문항부터는 당신이 입력한 <b>상황을 배제</b>하고 <b>대사</b>만을 보고 답변해주세요.</div>
                </div>
                <div className='evalVariable'>
                    <div className='title'>
                        <div>4. 해당 <b>대사</b>만을 보았을 때 고정관념이 있다고 느껴지나요?</div>
                    </div>
                    <button className ={question4 === 0 ? 'clickedBtn' : null} onClick={() => handleQ4(0)}> 네 </button>
                    <button className ={question4 === 1 ? 'clickedBtn' : null} onClick={() => handleQ4(1)}> 아니오 </button>
                    <button className ={question4 === 2 ? 'clickedBtn' : null} onClick={() => handleQ4(2)}> 잘 모르겠다 </button>
                </div>
                <div className='evalVariable'>
                    <div className='title'>
                        <div>5. <b>대사</b> 속에 고정관념이 있다고 판단하는데 영향을 준 특정 단어가 있나요?</div>
                    </div>
                    <button className ={question5 === 0 ? 'clickedBtn' : null} onClick={() => handleQ5(0)}> 네 </button>
                    <button className ={question5 === 1 ? 'clickedBtn' : null} onClick={() => handleQ5(1)}> 아니오 </button>
                    <button className ={question5 === 2 ? 'clickedBtn' : null} onClick={() => handleQ5(2)}> 잘 모르겠다 </button>
                </div>
                {question5 === 0 ?
                    <div className='evalVariable'>
                        <div className='title'>
                            <div>5-1. 만약 그렇다면 특정 단어를 드래그 해주세요</div>
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