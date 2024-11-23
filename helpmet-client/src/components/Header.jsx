import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false); // State for hamburger menu
  const location = useLocation(); // Hook to get the current path
  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle menu open/close state
  };
  // Check if the current path matches the link path
  const isActive = (path) => location.pathname === path;
  return (
    <div className={`bg-white border-b border-gray-200 ${isOpen ? "expanded-header" : ""}`}>
      <div className="flex justify-between items-center max-w-[2700px] mx-auto py-7 px-4 lg:px-7">
        <Link to="/">
          <img src="/images/Group 7.svg" className="w-[140px] h-auto" />
        </Link>
        {/* Hamburger icon for mobile */}
        <div className="hamburger-menu md:hidden" onClick={toggleMenu}>
          <div className={`bar ${isOpen ? "open" : ""}`}></div>
          <div className={`bar ${isOpen ? "open" : ""}`}></div>
          <div className={`bar ${isOpen ? "open" : ""}`}></div>
        </div>
        {/* Navigation Links */}
        <ul
          className={`nav-links text-sm ${
            isOpen ? "block" : "hidden"
          } md:flex gap-4 ml-4`}
        >
          <Link to="/dashboard" className="flex items-center">
            {currentUser && (
              <li
                className={`${
                  isActive("/dashboard")
                    ? "active-link"
                    : "text-black hover:text-[#6938EF]"
                } transition-colors`}
              >
                Dashboard
              </li>
            )}
          </Link>
          <Link to="/report" className="flex items-center">
            {currentUser && (
              <li
                className={`${
                  isActive("/report")
                    ? "active-link"
                    : "text-black hover:text-[#6938EF]"
                } transition-colors`}
              >
                Report
              </li>
            )}
          </Link>
          <Link to="/equipmentcheck" className="flex items-center">
            {currentUser && (
              <li
                className={`${
                  isActive("/equipmentcheck")
                    ? "active-link"
                    : "text-black hover:text-[#6938EF]"
                } transition-colors`}
              >
                Equipment
              </li>
            )}
          </Link>
          <Link to="/alert" className="flex items-center">
            {currentUser && (
              <li
                className={`${
                  isActive("/alert")
                    ? "active-link"
                    : "text-black hover:text-[#6938EF]"
                } transition-colors`}
              >
                Alert
              </li>
            )}
          </Link>
          {/* <Link to='/setting'>
          { currentUser && <li className={`${
                isActive('/setting') ? 'underline text-[#6938EF]' : 'text-black hover:text-[#6938EF]'
              } transition-colors`}>Setting</li> }
          </Link> */}
          <Link to="/setting" className="self-center">
            {currentUser && (
              <li className="border-l-2 border-gray-300 pl-4">
                <img
                  src="/images/gear.svg"
                  alt="setting icon"
                  className="w-5 h-5"
                />
              </li>
            )}
          </Link>
          {/* <Link to="/pending-report" className="self-center">
            {currentUser && (
              <li className=" border-gray-300 bellzy">
                <img src="/images/bell.svg" alt="notification icon" />
              </li>
            )}
          </Link> */}
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.profilePicture}
                alt="profile"
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <li className="text-black hover:text-[#6938EF] transition-colors">
                Login
              </li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
};
export default Header;
