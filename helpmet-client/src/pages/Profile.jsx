import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import axios from '../api/axios'
import { useDispatch } from 'react-redux'
import { updateProfile, logout } from '../redux/user/userSlice'

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('');
  const [profilePictureURL, setProfilePictureURL] = useState(currentUser.profilePicture);
  const companyID = currentUser.companyID;

  useEffect(() => {
    if (image) {
      setProfilePictureURL(URL.createObjectURL(image));
    }
  }, [image]);

  const handleFileUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("profilePicture", image);

    try {
      const response = await axios.post('/auth/uploadProfilePicture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setProfilePictureURL(response.data.url);
      return response.data.url;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let uploadedImageUrl = profilePictureURL;
      if (image) {
        uploadedImageUrl = await handleFileUpload();
      }
      const response = await axios.put('/auth/updateProfile', { username, email, password, companyID, profilePicture: uploadedImageUrl },
      {
        withCredentials: true,
      });
      alert("Profile updated successfully!");
      dispatch(updateProfile(response.data));
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout')
      dispatch(logout());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-2xl font-semibold text-center text-black'>Profile</h1>
      <form onSubmit={handleUpdate} className='flex flex-col gap-4'>
        <input
          type="file" ref={fileRef} hidden accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={profilePictureURL || currentUser.profilePicture}
          alt="profile"
          className='h-24 w-24 self-center cursor-pointer rounded-full object-cover'
          onClick={() => fileRef.current.click()}
        />
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder='Username'
          className='bg-slate-200 rounded-lg p-3'
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder='Email'
          className='bg-slate-200 rounded-lg p-3'
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder='Password'
          className='bg-slate-200 rounded-lg p-3'
        />
        <button className='bg-slate-600 text-black rounded-lg hover:opacity-90'>
          Update
        </button>
      </form>
      <div className='flex justify-between mt-5 text-black'>
        <span className='cursor-pointer mx-auto' onClick={handleLogout}>
          Logout
        </span>
      </div>
    </div>
  )
}

export default Profile