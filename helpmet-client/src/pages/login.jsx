import React, { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthProvider'
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import '../../src/index.css';

const LOGIN_URL = '/auth';

const login = () => {
  const { setAuth } = useContext(AuthContext);
  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    emailRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [email, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({ email, password: pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      console.log(JSON.stringify(response?.data));
      // const accessToken = response?.data?.accessToken;
      // const roles = response?.data?.roles;
      // setAuth({ email, pwd, roles, accessToken });
      setAuth({ email, pwd });
      setEmail('');
      setPwd('');
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Email or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }

    
  }

  return (
    <>
      {success ? (
        <section>
          <h1>You are logged in!</h1>
          <br/>
          <p>
            <a href="#">Go to Home</a>
          </p>
        </section>
      ) : (
      <section>
        <p ref={errRef} className={errMsg ? 'errMsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input 
            type="email"
            id="email"
            ref={emailRef}
            autoComplete='off'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />

          <label htmlFor="password">Password:</label>
          <input 
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />
          <button>Login</button>
        </form>
        <p>
          Need an Account? <br/>
          <span className='line'>
            <a href="signup">Sign Up</a>
          </span>
        </p>
      </section>
      )}
    </>
  )
}

export default login