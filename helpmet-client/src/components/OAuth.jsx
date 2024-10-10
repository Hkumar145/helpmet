import React from 'react'

const OAuth = () => {
  const handleGoogle = async () => {
    try {
      
    } catch (err) {
      console.log('Could not login with Google', err);
    }
  }

  return (
    <button type='button' onClick={handleGoogle} className='bg-teal-700 hover:opacity-90'>Continue with Google</button>
  )
}

export default OAuth