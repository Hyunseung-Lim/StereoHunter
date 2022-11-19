import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"

import { MainNavbar } from '../Components/Navbar/mainNavbar';
import { Historybar } from '../Components/Historybar/historybar';

export const MainPage = (props) => {
  const [profileData, setProfileData] = useState({'name':null})
  const [inputData, setInputData] = useState("");
  const [situationData, setSituationData] = useState("상황: 상황이 여기에 출력됩니다");
  const [dialogeData, setDialogeData] = useState("\"대사가 여기에 출력됩니다\"");
  const [logData, setLogData] = useState([{'id': '', 'input': '', 'output': ''}]);
  const [clickedId, setClickedId] = useState("")
  
  const inputHandler = (e) => {
    setInputData(e.target.value);
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
    e.preventDefault();
    if (e.key === 'Enter') {
      sendRequest();
    }
  };

  function setCurrent(situation, dialoge) {
    setSituationData("상황: " + situation);
    setDialogeData("\"" + dialoge + "\"");
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
    })
  }

  function isStereo() {
    setStereo(clickedId, "stereo")
  }

  function isAntiStereo() {
    setStereo(clickedId, "antiStereo")
  }

  function isUnrelated() {
    setStereo(clickedId, "unrelated")
  }

  return (
    <div className='mainPage'>
      <MainNavbar name={profileData.name} removeToken={props.removeToken}/>
      <div className='container'>
        <div className='playContents'>
          <div className='inputWindow'>
            <div className='inputWindowTitle'>상황을 입력해주세요.</div>
            <input className='input' value={inputData} onChange={inputHandler} onKeyPress={handleOnKeyPress}/>
          </div>
          <div className='outputWindow'>
            <div className='situation'>
              {situationData}
            </div>
            <div className='dialoge'>
              {dialogeData}
            </div>
          </div>
          { clickedId === "" ? null
            :
            <div className='stereoEvaluation'>
              <div className='stereoChecker'>
                <button className='stereoBtn stereo' onClick={isStereo}>고정관념 있음</button>
                <button className='stereoBtn antiStereo' onClick={isAntiStereo}>고정관념과 반대</button>
                <button className='stereoBtn unrelated' onClick={isUnrelated}>관련 없음</button>              
              </div>
            </div>        
          }
        </div>
        <Historybar logData={logData} clickedId={clickedId} setCurrent={setCurrent} setClickedId={setClickedId}/>        
      </div>
    </div>
  );
};
