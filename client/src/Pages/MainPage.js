import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"

import { MainNavbar } from '../Components/Navbar/mainNavbar';
import { Historybar } from '../Components/Historybar/historybar';

export const MainPage = (props) => {
  const [profileData, setProfileData] = useState({'name':null})

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
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }

  useEffect(() => {
    getData()
  }, []);

  return (
    <div className='mainPage'>
      <MainNavbar name={profileData.name} removeToken={props.removeToken}/>
      <div className='container'>
        <div className='playContents'>
          <div className='inputWindow'>
            <div className='inputWindowTitle'>상황을 입력해주세요.</div>
            <input className='input'></input>
          </div>
        </div>
        <Historybar/>        
      </div>
    </div>
  );
};
