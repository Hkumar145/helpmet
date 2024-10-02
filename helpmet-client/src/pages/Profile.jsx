import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import axios from '../api/axios'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/user/userSlice'

const Profile = () => {
  const dispatch = useDispatch();
  const {currentUser} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    console.log(image);
  };

  const handleLogout = async () => {
    try {
      await fetch('api/auth/logout')
      dispatch(logout());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-2xl font-semibold text-center'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input
          type="file" ref={fileRef} hidden accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={currentUser.profilePicture}
          alt="profile"
          className='h-24 w-24 self-center cursor-pointer rounded-full object-cover'
          onClick={() => fileRef.current.click()}
        />
        <input
          defaultValue={currentUser.username}
          type="text"
          id='username'
          placeholder='Username'
          className='bg-slate-200 rounded-lg p-3'
        />
        <input
          defaultValue={currentUser.email}
          type="email"
          id='email'
          placeholder='Email'
          className='bg-slate-200 rounded-lg p-3'
        />
        <input
          type="password"
          id='password'
          placeholder='Password'
          className='bg-slate-200 rounded-lg p-3'
        />
        <button className='bg-slate-600 text-white rounded-lg hover:opacity-90 disabled:opacity-60'>
          Update
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        {/* <span className='cursor-pointer'>Delete Account</span> */}
        <span className='cursor-pointer mx-auto' onClick={handleLogout}>
            Logout
        </span>
      </div>
    </div>
  )
}

export default Profile