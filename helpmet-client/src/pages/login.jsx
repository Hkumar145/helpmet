import React, { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthProvider'
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { loginStart, loginSuccess, loginFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const LOGIN_URL = 'http://localhost:5001/auth/login';

const login = () => {
  const { setAuth } = useContext(AuthContext);
  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  // const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    emailRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [email, pwd])

  // useEffect(() => {
  //   if (success) {
  //     const timer = setTimeout(() => {
  //       navigate('/dashboard');
  //     }, 1500);

  //     return () => clearTimeout(timer);
  //   }
  // }, [success, navigate]);

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
      navigate('/dashboard');
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
    // <>
    //   {success ? (
    //     <section className='w-full max-w-xs min-h-[400px] flex flex-col justify-start p-4 bg-[#6938EF]'>
    //       <h1 className='text-white'>You are logged in!</h1>
    //     </section>
    //   ) : (
      <section className='w-full max-w-xs min-h-[400px] flex flex-col justify-start p-4 bg-[#F4F3FF]'>
        <p ref={errRef} className={errMsg ? 'errMsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>
        <h1 className='text-2xl text-center font-semibold text-black'>WELCOME</h1>
        <form onSubmit={handleSubmit} className='flex flex-col justify-evenly flex-grow pb-4'>
          <label htmlFor="email">Email:</label>
          <input 
            type="email"
            id="email"
            className='border'
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
            className='border'
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />
          <Link to='/forgot-password' className='text-right text-xs my-2 hover:underline'>Forgot Password</Link>
          <button 
            disabled={!email || !pwd ? true : false}
            className="bg-[#6938EF] text-white font-bold disabled:opacity-40 disabled:bg-[#D9D6FE] disabled:text-[#6938EF] disabled:cursor-not-allowed hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mt-4">
              Login
          </button>
          {/* <OAuth /> */}
        </form>
        <div className='flex gap-2 text-black text-xs self-center'>
          Don't have an account? <br/>
            <Link to='/signup' className='hover:underline'>
              <span className='text-[#6938EF] hover:underline'>Sign up</span>
            </Link>
        </div>
      </section>
    //   )}
    // </>
  )
}

export default login