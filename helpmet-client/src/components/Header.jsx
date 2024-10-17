import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Header = () => {
  const {currentUser} = useSelector((state) => state.user);
  return (
    <div className='bg-emerald-500'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to='/'>
                <h1>Helpmet</h1>
            </Link>
            
            <ul className='flex gap-4'>
                <Link to='/report'>
                  { currentUser && <li>Report</li> }
                </Link>
                <Link to='/equipmentcheck'>
                  { currentUser && <li>Equipment</li> }
                </Link>
                <Link to='/alert'>
                  <li>Alert</li>
                </Link>
                <Link to='/about'>
                  <li>About</li>
                </Link>
                <Link to='/profile'>
                  {currentUser ? (
                    <img src={currentUser.profilePicture} alt="profile" className='h-7 w-7 rounded-full object-cover'/>
                  ):(
                    <li>Login</li>
                  )}
                </Link>
            </ul>
        </div>
    </div>
  )
}

export default Header