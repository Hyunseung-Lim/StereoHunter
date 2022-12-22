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
                        스테레오 헌터
                    </div>
                    <div className='navbarInfo'>
                        <div className='userName'>
                            {props.name} 님
                        </div>
                        <button className='submitBtn' onClick={logout}> logout </button>                              
                    </div>
                </div>
            </nav>
        </>
    )
}