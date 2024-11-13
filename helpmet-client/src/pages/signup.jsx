import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const signup = () => {
  const usernameRef = useRef();
  const emailRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  // const [validPwd, setValidPwd] = useState(false);
  // const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  const SIGNUP_URL = 'http://localhost:5001/auth/signup';

  useEffect(() => {
    usernameRef.current.focus();
  }, [])

  useEffect(() => {
    const result = USERNAME_REGEX.test(username);
    setValidUsername(result);
  }, [username]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email])

  useEffect(() => {
    // const result = PWD_REGEX.test(pwd);
    // setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('');
  }, [username, email, pwd, matchPwd])

  // Automatically navigate to homepage after showing success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 1250);

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(SIGNUP_URL, JSON.stringify({ username, email, password: pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      // console.log(JSON.stringify(response));
      setSuccess(true);
    } catch (err) {
      if(!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username or Email Taken');
      } else {
        setErrMsg('Registration Failed')
      }
      errRef.current.focus();
    }
  }

  return (
    <>
      {success ? (
        <section className='w-full max-w-sm min-h-[400px] flex flex-col justify-start p-4'>
          <h1 className='text-[#6938EF] text-center'>Your account has been successfully created!</h1>
        </section>
      ) : (
      <section className='w-full max-w-xs min-h-[400px] flex flex-col justify-start p-4 bg-[#F4F3FF]'>
        <p ref={errRef} className={errMsg ? 'errMsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>
        <h1 className='text-2xl text-center font-semibold text-black'>GET STARTED</h1>
        <form onSubmit={handleSubmit} className='flex flex-col justify-evenly flex-grow pb-4'>
          <label htmlFor="username">
            Username:
          </label>
            <input
              type="text"
              id="username"
              className='border'
              ref={usernameRef}
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
              required
              aria-invalid={validUsername ? 'false' : 'true'}
              aria-describedby="usernameNote"
              onFocus={() => setUsernameFocus(true)}
              onBlur={() => setUsernameFocus(false)}
            />
            <p id="usernameNote" className={usernameFocus && username && !validUsername ? 'instructions' : 'offscreen'}>
              4 to 24 characters.<br/>
              Must begin with a letter.<br/>
              Allowed characters: letters, numbers, underscores, hyphens.
            </p>

          <label htmlFor='email'>
            Email:
          </label>
          <input 
            type='email'
            id='email'
            className='border'
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
            className='border'
            onChange={(e) => setPwd(e.target.value)}
            required
            // aria-invalid={validPwd ? 'false' : 'true'}
            // aria-describedby='pwdNote'
            // onFocus={() => setPwdFocus(true)}
            // onBlur={() => setPwdFocus(false)}
          />
          {/* <p id='pwdNote' className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}>
            8 to 24 characters.<br/>
            Must include uppercase and lowercase letters, a number and a special character.<br/>
            Allowed special characters: <span aria-label='exclamation mark'>!</span><span aria-label='at symbol'>@</span><span aria-label='hashtag'>#</span><span aria-label='dollar sign'>$</span><span aria-label='percent'>%</span>
          </p> */}

          <label htmlFor="confirm_pwd">
            Confirm Password:
          </label>
          <input 
            type='password'
            id='confirm_pwd'
            className='border'
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

          <button disabled={!validUsername || !validEmail || !pwd || !matchPwd || !validMatch ? true : false}
          className='bg-[#6938EF] text-white font-bold disabled:opacity-40 disabled:bg-[#D9D6FE] disabled:text-[#6938EF] disabled:cursor-not-allowed hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mt-4'>
            Sign Up
          </button>
          {/* <OAuth /> */}
        </form>
        <div className='flex gap-2 text-black text-xs self-center'>
          Already have an account? <br/>
            <Link to='/login' className='hover:underline'>
              <span className='text-[#6938EF] hover:underline'>Login</span>
            </Link>
        </div>
      </section>
      )}
    </>
  )
}

export default signup;