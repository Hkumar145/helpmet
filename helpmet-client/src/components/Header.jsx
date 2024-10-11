import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Header = () => {
  const {currentUser} = useSelector((state) => state.user);
  return (
    <div className='bg-white'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to='/'>
                <img src='./images/Group 7.svg'/>
            </Link>
            
            <ul className='flex gap-4'>
                <Link to='/'>
                  <li style={{color: 'black'}}>Dashboard</li>
                </Link>
                <Link to='/about'>
                  <li style={{color: 'black'}}>Incident Report</li>
                </Link>
                <Link to='/equipmentcheck'>
                  <li style={{color: 'black'}}>Analytics</li>
                </Link>
                <Link>
                  <li style={{color: 'black'}}>Alert</li> 
                </Link>
                <Link>
                  <li style={{color: 'black'}}>Equipment Check</li>
                </Link>
                <Link to='/profile'>
                  {currentUser ? (
                    <img src={currentUser.profilePicture} alt="profile" className='h-7 w-7 rounded-full object-cover'/>
                  ):(
                    <li style={{color: 'black'}}>Login</li>
                  )}
                </Link>
            </ul>
        </div>
    </div>
  )
}

export default Header