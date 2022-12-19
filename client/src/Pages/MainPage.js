import React, { useState, useEffect } from 'react'
import axios from "axios"

import { MainNavbar } from '../Components/Navbar/mainNavbar';
import { Historybar } from '../Components/Historybar/historybar';
import { Evaluation } from '../Components/Evaluation/evaluation';

export const MainPage = (props) => {
  const [profileData, setProfileData] = useState({'name':null})
  const [inputData, setInputData] = useState("");
  const [situationData, setSituationData] = useState("상황: 상황이 여기에 출력됩니다");
  const [dialogeData, setDialogeData] = useState("\"대사가 여기에 출력됩니다\"");
  const [logData, setLogData] = useState([{'id': '', 'input': '', 'output': '', 'ambiguous':''}]);
  const [clickedId, setClickedId] = useState("")
  const [evaluation, setEvaluation] = useState(false)
  const [ambiguousText, setAmbiguousText] = useState('')
  const [ambiguousBtn, setAmbiguousBtn] = useState(false)
  
  const inputHandler = (e) => {
    setInputData(e.target.value);
  }

  const ambiguousHandler = (e) => {
    setAmbiguousText(e.target.value);
    setAmbiguousBtn(true);
  }

  // get profile data from server
  function getData() {
    axios({
      method: "GET",
      url:"/profile",
      headers: {
        Authorization: 'Bearer ' + props.token
      }
    })
    .then((response) => {
      const res =response.data
      res.access_token && props.setToken(res.access_token)
      setProfileData(({
        name: res.name
      }))
      setLogData(
        res.logData
      )
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        axios({
          method: "POST",
          url:"/logout",
        })
        .then((response) => {
           props.removeToken()
        }).catch((error) => {
          if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
            }
        })
        }
    })
  }

  useEffect(() => {
    getData()
  }, []);

  // request output from clova
  function sendRequest() {
    setDialogeData("로딩중...")
    axios({
      method: "POST",
      url:"/getInput",
      headers: {
        Authorization: 'Bearer ' + props.token
      },
      data: { inputData: inputData }
    })
    .then((response) => {
      const res =response.data
      setDialogeData((
        "\"" + res.result + "\""
      ))
      setLogData(
        res.logData
      )
      setClickedId(res.logData[0].id);
    })
    setSituationData("상황: " + inputData)
  }
    
  const handleOnKeyPress = e => {
    if (e.key === 'Enter') {
      sendRequest();
      setInputData("");
    }
  };

  function setCurrent(situation, dialoge, id) {
    setSituationData("상황: " + situation);
    setDialogeData("\"" + dialoge + "\"");
    setAmbiguousText(logData[logData.findIndex(message => message.id === id)].ambiguous);
  }

  function setStereo(id, stereo) {
    axios({
      method: "POST",
      url:"/setStereo",
      headers: {
        Authorization: 'Bearer ' + props.token
      },
      data: { id: id, stereo: stereo }
    })
    .then((response) => {
      const res =response.data
      setLogData(
        res.logData
      )
      setAmbiguousText(logData[logData.findIndex(message => message.id === id)].ambiguous);
    })
  }

  function setAmbiguous() {
    axios({
      method: "POST",
      url:"/setAmbiguous",
      headers: {
        Authorization: 'Bearer ' + props.token
      },
      data: { id: clickedId, ambiguous: ambiguousText }
    })
    .then((response) => {
      const res =response.data
      setLogData(
        res.logData
      )
    })
    setAmbiguousBtn(false);
  }

  function isStereo() {
    setStereo(clickedId, "stereo")
  }

  function isNeutral() {
    setStereo(clickedId, "neutral")
  }

  function isAntiStereo() {
    setStereo(clickedId, "antiStereo")
  }

  function isAmbiguous() {
    setStereo(clickedId, "ambiguous")
  }

  function isUnrelated() {
    setStereo(clickedId, "unrelated")
  }

  function evaluationStart() {
    setEvaluation(true);
  }

  function evaluationFinish() {
    setEvaluation(false);
  }

  return (
    <div className='mainPage'>
      <MainNavbar name={profileData.name} removeToken={props.removeToken}/>
      <div className='container'>
        <div className='playContents'>
          { evaluation === false ?
            <div className='inputWindow'>
              <div className='inputWindowTitle'>상황을 입력해주세요.</div>
              <input className='input' value={inputData} onChange={inputHandler} onKeyPress={handleOnKeyPress}/>
            </div>
            :
            null
          }
          <div className='outputWindow'>
            <div className='situation'>
              {situationData}
            </div>
            <div className='dialoge'>
              {dialogeData}
            </div>
          </div>
          { clickedId === "" ? null
            :( evaluation === false ?
              <div className='stereoEvaluation'>
                <div className='stereoChecker'>
                  <button className='stereoBtn stereo' onClick={isStereo}>고정관념 있음</button>
                  <button className='stereoBtn neutral' onClick={isNeutral}>중립</button>
                  <button className='stereoBtn antiStereo' onClick={isAntiStereo}>고정관념과 반대</button>
                  <button className='stereoBtn ambiguous' onClick={isAmbiguous}>애매모호함</button>
                  <button className='stereoBtn unrelated' onClick={isUnrelated}>관련 없음</button>
                </div>
                { logData[logData.findIndex(message => message.id === clickedId)].isStereo === "stereo" ?
                  <div className='evaluationBtnHolder'>
                    <button className='evaluationBtn stereo' onClick={evaluationStart}>평가하기</button>
                  </div>
                : (
                    logData[logData.findIndex(message => message.id === clickedId)].isStereo === "antiStereo" ?
                    <div className='evaluationBtnHolder'>
                      <button className='evaluationBtn antiStereo' onClick={evaluationStart}>평가하기</button>
                    </div>
                    : (
                      logData[logData.findIndex(message => message.id === clickedId)].isStereo === "ambiguous" ?
                      <div className='ambiguousHolder'>
                        <div>판단하기 어렵다고 생각한 이유를 적어주세요.</div>
                        <textarea value={ambiguousText} onChange={ambiguousHandler}></textarea>
                        <button className={ambiguousBtn === true ? null : 'unclickable'} onClick={ambiguousBtn === true ? setAmbiguous : null}>완료</button>
                      </div>
                      : null
                    )
                  )   
                }
              </div>
              :
              <div className='stereoEvaluation'>
                <Evaluation id ={clickedId} token={props.token} setLogData ={setLogData} dialoge={logData[logData.findIndex(message => message.id === clickedId)].output} evaluationFinish={evaluationFinish}/>
              </div>              
            )
          }
        </div>
        <Historybar logData={logData} clickedId={clickedId} ambiguous = {ambiguousBtn} evaluation ={evaluation} setCurrent={setCurrent} setClickedId={setClickedId}/>        
      </div>
    </div>
  );
};
