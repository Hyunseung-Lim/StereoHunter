import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"

import { MainNavbar } from '../Components/Navbar/mainNavbar';

export const MainPage = (props) => {
  const [userName, setUserName] = useState(null);
  const [profileData, setProfileData] = useState({'name':null})
  const [booksData, setBooksData] = useState([{'num':null, 'name':null, 'bookData':null}, {'num':null, 'name':null, 'bookData':null}])

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
      setBooksData(res.books)
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
      <MainNavbar
        name={profileData.name}
        removeToken={props.removeToken}
      />
      <div className='mainPageTitle'>읽고 싶은 책을 선택해주세요.</div>
    </div>
  );
};
