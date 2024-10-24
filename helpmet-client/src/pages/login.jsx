import React, { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthProvider'
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { loginStart, loginSuccess, loginFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import '../../src/index.css';


const LOGIN_URL = 'http://localhost:5001/auth/login';

const login = () => {
  const { setAuth } = useContext(AuthContext);
  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    emailRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [email, pwd])

  // Automatically navigate to homepage after showing success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(loginStart());
      const response = await axios.post(LOGIN_URL, JSON.stringify({ email, password: pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      const accessToken = response?.data?.accessToken;

      const companyResponse = await axios.get(`/auth/companies?contactEmail=${email}`, {
        withCredentials: true
      });
      const companyID = companyResponse?.data?.companyID;

      setAuth({ email, accessToken });

      dispatch(loginSuccess({ ...response.data, companyID }));

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
      } else if (err.response?.status === 404) {
        setErrMsg('User not found');
      } else {
        dispatch(loginFailure(err?.response?.data || 'Login Failed'));
        setErrMsg('An unexpected error occurred. Please try again.');
      }
      errRef.current.focus();
    }
  }

  return (
    <>
      {success ? (
        <section className='w-full max-w-xs min-h-[400px] flex flex-col justify-start p-4 bg-black/40'>
          <h1 className='text-white'>You are logged in!</h1>
        </section>
      ) : (
      <section className='w-full max-w-xs min-h-[400px] flex flex-col justify-start p-4 bg-black/40'>
        <p ref={errRef} className={errMsg ? 'errMsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>
        <h1 className='text-2xl text-center font-semibold text-white'>Login</h1>
        <form onSubmit={handleSubmit} className='flex flex-col justify-evenly flex-grow pb-4'>
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
          <button 
            disabled={!email || !pwd ? true : false}
            className='bg-slate-600 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed'>
              Login
          </button>
          {/* <OAuth /> */}
        </form>
        <div className='flex gap-2 text-white'>
          Need an Account? <br/>
            <Link to='/signup' className='hover:underline'>
              <span>Sign Up</span>
            </Link>
        </div>
      </section>
      )}
    </>
  )
}

export default login