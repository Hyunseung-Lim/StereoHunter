import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"
import './navbar.css'


export const MainNavbar = (props) => {

    function logout() {
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
        })}    

    return(
        <>
            <nav className='mainNavbar'>
                <div className='navbarContainer'>
                    <div className='title'> 
                        숨은 고정관념 찾기
                    </div>
                    <div>
                        {props.name} 님
                        <button className='submitBtn' onClick={logout}> logout </button>                              
                    </div>
                </div>
            </nav>
        </>
    )
}