import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import '../../src/index.css';

const signup = () => {
  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const SIGNUP_URL = '/signup';

  useEffect(() => {
    emailRef.current.focus();
  }, [])

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    console.log(result);
    console.log(email);
    setValidEmail(result);
  }, [email])

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log(result);
    console.log(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('');
  }, [email, pwd, matchPwd])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(SIGNUP_URL, JSON.stringify({ email, password: pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      console.log(JSON.stringify(response));
      setSuccess(true);
    } catch (err) {
      if(!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Email Taken');
      } else {
        setErrMsg('Registration Failed')
      }
      errRef.current.focus();
    }
  }

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="login">Login</a>
          </p>
        </section>
      ) : (
      <section>
        <p ref={errRef} className={errMsg ? 'errMsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor='email'>
            Email:
          </label>
          <input 
            type='email'
            id='email'
            ref={emailRef}
            autoComplete='off'
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-invalid={validEmail ? 'false' : 'true'}
            aria-describedby='emailNote'
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
          />
          <p id='emailNote' className={emailFocus && email && !validEmail ? 'instructions' : 'offscreen'}>
            Invalid Email Address
          </p>

          <label htmlFor="password">
            Password:
          </label>
          <input 
            type='password'
            id='password'
            onChange={(e) => setPwd(e.target.value)}
            required
            aria-invalid={validPwd ? 'false' : 'true'}
            aria-describedby='pwdNote'
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
          />
          <p id='pwdNote' className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}>
            8 to 24 characters.<br/>
            Must include uppercase and lowercase letters, a number and a special character.<br/>
            Allowed special characters: <span aria-label='exclamation mark'>!</span><span aria-label='at symbol'>@</span><span aria-label='hashtag'>#</span><span aria-label='dollar sign'>$</span><span aria-label='percent'>%</span>
          </p>

          <label htmlFor="confirm_pwd">
            Confirm Password:
          </label>
          <input 
            type='password'
            id='confirm_pwd'
            onChange={(e) => setMatchPwd(e.target.value)}
            required
            aria-invalid={validMatch ? 'false' : 'true'}
            aria-describedby='confirmNote'
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />
          <p id='confirmNote' className={matchFocus && email && !validMatch ? 'instructions' : 'offscreen'}>
            Must match the first password input field.
          </p>

          <button disabled={!validEmail || !validPwd || !validMatch ? true : false}>
            Sign Up
          </button>
        </form>
      </section>
      )}
    </>
  )
}

export default signup;