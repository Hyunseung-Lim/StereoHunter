import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './login.css';

export const Signin = (props) => {

    //values
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const emailHandler = (e) => {
        e.preventDefault();
        setEmail(e.target.value);
    }

    const passwordHandler = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
    }

    const submitHander = async (e) => {
        e.preventDefault();
        axios({
            method: 'post',
            url: '/token',
            data: {
                email: email,
                password: password
            }
        })
        .then((response) => {
            props.setToken(response.data.access_token)
        }).catch((error) => {
            if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
            }
        })
        setEmail("");
        setPassword("");
    }

    return(
        <>
            <div className='signholder'>
                <form className='signinbox' onSubmit={submitHander}>
                    <div className='signinTitle'>
                        STEREOHUNTER
                    </div>
                    <input className='signInput' type="email" value={email} onChange={emailHandler} placeholder={'Email'}></input>
                    <input className='signInput' type="password" value={password} onChange={passwordHandler} placeholder={'Password'} autoComplete="on"></input>
                    <button className='loginBtn' type="submit">
                        Login
                    </button>
                </form>
                <div className='createAccountbox'>
                    No Account?
                    <button onClick={() => props.setIsSignup()}>
                        Create Account
                    </button>
                </div>
            </div>
        </>
    )
}