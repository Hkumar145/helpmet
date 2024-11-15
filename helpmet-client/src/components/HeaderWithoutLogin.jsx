import React from 'react'
import { Link } from 'react-router-dom';

const HeaderWithoutLogin = () => {
  return (
    <div className='bg-white py-4 flex justify-center border-b-2'>
      <Link to="/">
        <img src="/images/Group 7.svg" className="w-[140px] h-auto" />
      </Link>
    </div>
  )
}

export default HeaderWithoutLogin