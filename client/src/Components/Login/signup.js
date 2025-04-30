import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Validate } from './validate';

import './login.css';

export const Signup = (props) => {
    
    // values
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const emailHandler = (e) => {
        e.preventDefault();
        setEmail(e.target.value);
    }

    const nameHandler = (e) => {
        e.preventDefault();
        setName(e.target.value);        
    }

    const passwordHandler = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
    }

    const submitHander = async (e) => {
        setSubmitting(true);
        e.preventDefault();
        await new Promise((r) => setTimeout(r, 1000));
        setErrors(Validate({email, name, password}));
    }

    useEffect(() => {
        if(submitting) {
            if(Object.keys(errors).length === 0) {
                axios({
                    method: 'post',
                    url: '/signup',
                    data: {
                        email: email,
                        name: name,
                        password: password
                    }
                });
                props.setIsSignin();
            }
            setSubmitting(false);
        }
    }, [errors]);


    return(
        <>
            <div className='signholder'>
                <form className='signupbox' onSubmit={submitHander}>
                    <div className='signinTitle'>
                        STEREOHUNTER
                    </div>
                    <input className='signInput' type="email" placeholder={'Email'} value={email}  onChange={emailHandler}></input>
                    <input className='signInput' type="name" placeholder={'Name'} value={name} onChange={nameHandler}></input>
                    <input className='signInput' type="password" placeholder={'Password'} value={password} onChange={passwordHandler} autoComplete="on"></input>
                    <button className='loginBtn' type="submit">Create Account</button>
                </form>
                <div className='createAccountbox'>
                    Already have an account?
                    <button onClick={() => props.setIsSignin()}>
                        Login
                    </button>
                </div>            
            </div>
        </>
    )
}