import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import axios from '../api/axios'
import { useDispatch } from 'react-redux'
import { updateProfile, logout } from '../redux/user/userSlice'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Profile = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [image, setImage] = useState(null)
  const [username, setUsername] = useState(currentUser.username)
  const [email, setEmail] = useState(currentUser.email)
  const [password, setPassword] = useState('')
  const [profilePictureURL, setProfilePictureURL] = useState(currentUser.profilePicture)
  const companyID = currentUser.companyID

  useEffect(() => {
    if (image) {
      setProfilePictureURL(URL.createObjectURL(image))
    }
  }, [image])

  const handleFileUpload = async () => {
    if (!image) return
    const formData = new FormData()
    formData.append("profilePicture", image)

    try {
      const response = await axios.post('/auth/uploadProfilePicture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      })
      setProfilePictureURL(response.data.url)
      return response.data.url
    } catch (error) {
      console.error("Error uploading profile picture:", error)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      let uploadedImageUrl = profilePictureURL
      if (image) {
        uploadedImageUrl = await handleFileUpload()
      }
      const response = await axios.put('/auth/updateProfile', 
        { username, email, password, companyID, profilePicture: uploadedImageUrl },
        { withCredentials: true }
      )
      toast.success('Profile updated successfully!', {
        className: "custom-toast",
        bodyClassName: "custom-toast-body",
      })
      dispatch(updateProfile(response.data))
    } catch (error) {
      toast.error(`Error updating profile: ${error}`, {
        className: "custom-toast-error",
        bodyClassName: "custom-toast-body",
      })
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout')
      dispatch(logout())
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F5FF] p-6 w-full">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="w-full mx-auto bg-white rounded-xl p-4 max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-8">Profile</h1>
        
        <div className="flex justify-center mb-8">
          <div className="relative">
            <input
              type="file"
              ref={fileRef}
              hidden
              accept='image/*'
              onChange={(e) => setImage(e.target.files[0])}
            />
            <div 
              onClick={() => fileRef.current.click()}
              className="w-24 h-24 rounded-full border-2 border-[#6938EF] flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {profilePictureURL ? (
                <img
                  src={profilePictureURL}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-16 h-16 text-[#6938EF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div>
            <label className="block text-sm  text-gray-600 mb-1">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#6938EF]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#6938EF]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Update Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#6938EF]"
            />
          </div>

          <button 
            onClick={handleUpdate}
            disabled={!username || !email || !password}
            className="w-full bg-[#6938EF] text-white py-2 mt-[2.5rem] text-sm rounded-lg hover:bg-[#5925D9] transition-colors disabled:cursor-not-allowed"
          >
            Update Profile
          </button>

          {/* <div className="my-2 h-px bg-gray-200"></div> */}

          <button
            onClick={handleLogout}
            className="w-full text-red-700 mt-4 bg-red-100 text-sm py-2 mb-4"
          >
            Logout
          </button>
          
        </div>
      </div>
    </div>
  )
}

export default Profile