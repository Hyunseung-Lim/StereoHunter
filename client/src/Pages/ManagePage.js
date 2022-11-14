import React, { useState } from 'react'
import axios from "axios"

import './pages.css'

export const ManagePage = () => {

    // function getData() {
    //     axios({
    //       method: "GET",
    //       url:"/profile",
    //       headers: {
    //         Authorization: 'Bearer ' + props.token
    //       }
    //     })
    //     .then((response) => {
    //       const res =response.data
    //       res.access_token && props.setToken(res.access_token)
    //       setProfileData(({
    //         name: res.name
    //       }))
    //       setBooksData(res.books)
    //     }).catch((error) => {
    //       if (error.response) {
    //         console.log(error.response)
    //         console.log(error.response.status)
    //         console.log(error.response.headers)
    //         }
    //     })
    //   }
    
    //   useEffect(() => {
    //     getData()
    //   }, []);

    return(
        <>
            <div className='managepage'>
                <button> reset </button>
            </div>
        </>
    )
}