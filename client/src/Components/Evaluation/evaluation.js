import React, { useState } from 'react'
import Select from 'react-select'
import Likert from 'react-likert-scale';
import { Link } from 'react-router-dom'
import axios from "axios"
import './evaluation.css'


export const Evaluation = (props) => {
        
    const options = [
        { value: '여자', label: '여자' },
        { value: '남자', label: '남자' },
        { value: '엄마', label: '엄마' },
        { value: '아빠', label: '아빠' }
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
            console.log(val);
        }
    };

    return(
        <div className='evaluation'>
            <div className='evaluationLeft'>
                <div className='introductionOfEval'>
                    <text>당신이 입력한 상황과 <b>대사</b>를 종합해 답변해주세요.</text>                    
                </div>
                <div className='evalType'>
                    <div className='title'>
                        <text>1. 해당 대사 속 <b>고정관념의 대상</b>을 선택해주세요.</text>                
                    </div>
                    <Select isMulti options={options} />
                </div>
                <div className='evalVariable'>
                    <div className='title'>
                        <text>2, 당신과 <b>고정관념의 대상</b>과의 관계는?</text>                        
                    </div>
                    <button> 내가 그 대상임 </button>
                    <button> 내가 그 대상은 아니지만 관련있음 </button>
                    <button> 나와 직접적으로 관련없음 </button>
                </div>
                <div className='evalVariable'>
                    <text>3. 해당 대사에 고정관념이 얼마나 강하게 반영되어 있나요?</text>
                    <Likert {...likertOptions}/>
                </div>
            </div>
            <div className='evaluationRight'>
                <div className='introductionOfEval'>
                    <text className='introductionOfEval'>다음 문항부터는 당신이 입력한 상황 없이 <b>대사</b>만을 보고 답변해주세요.</text>
                </div>
                <div className='evalVariable'>
                    <div className='title'>
                        <text>4. 해당 <b>대사</b>만을 보았을 때 고정관념이 있다고 느껴지나요?</text>
                    </div>
                    <button> 네 </button>
                    <button> 아니오 </button>
                    <button> 잘 모르겠다 </button>
                </div>
                <div className='evalVariable'>
                    <div className='title'>
                        <text>5. <b>대사</b> 속에 고정관념이 있다고 판단하는데 영향을 준 특정 단어가 있나요?</text>
                    </div>
                    <button> 네 </button>
                    <button> 아니오 </button>
                    <button> 잘 모르겠다 </button>
                </div>
                <div className='evalVariable'>
                    <div className='title'>
                        <text>5-1. 만약 그렇다면 특정 단어를 드래그 해주세요</text>
                    </div>
                </div>
                <div className='evalSubmit'>
                    <button clasName='submitBtn' onClick={props.evaluationFinish}>완료</button>                    
                </div>

            </div>
        </div>
    )
}