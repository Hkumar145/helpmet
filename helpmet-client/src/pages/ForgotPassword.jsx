import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';

const ForgotPassword = () => {
  const emailRef = useRef();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ message: '', error: false });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/forgot-password', { email });
      setStatus({ message: response.data.message, error: false });
    } catch (err) {
      setStatus({
        message: err.response?.data?.message || 'Something went wrong.',
        error: true,
      });
    }
  };

  return (
    <>
      <section className='w-full max-w-xs min-h-[400px] flex flex-col justify-start p-4 bg-[#F4F3FF]'>
        <h1 className='text-2xl text-center font-semibold text-black'>Forgot Password</h1>
        {status.message && (
          <p className={`text-sm text-center ${status.error ? 'text-red-600' : 'text-green-600'}`}>
            {status.message}
          </p>
        )}
        <form className='flex flex-col justify-evenly flex-grow pb-4' onSubmit={handleSubmit}>
          <label 
            htmlFor="email"
            className='text-xs'
          >
            Enter your registered email address. We will send you a new password.
          </label>
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
          <Link to='/login' className='text-right text-xs my-2 text-blue-600 hover:underline'>Back to login</Link>
          <button
            type="submit"
            className='bg-[#6938EF] hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-white'
            disabled={!email}
          >
              Submit
          </button>
        </form>
      </section>
    </>
  )
}

export default ForgotPassword;