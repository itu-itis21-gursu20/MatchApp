import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from "../redux/apiCalls";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {currentUser} = useSelector(state => state.user);

  const handleLogout = (e) => {
    e.preventDefault();
    navigate("/login");
    logOut(dispatch);
  };


  return (
<>
    <nav className="bg-red-200 border-gray-200 dark:bg-gray-900 sticky top-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="https://flowbite.com/" className="flex items-center">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 mr-3" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">HOT OR NOT</span>
      </a>
      <div className="flex items-center md:order-2">
          <button type="button" className="flex text-white mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
            <span className="sr-only">Open user menu</span>
            <Link to={`/users/${currentUser._id}`}>
              <div className='userInfo flex items-center justify-center'>
                <img className="w-8 h-8 rounded-full mr-3" src={currentUser.profileImg} alt="user photo" />
                <span>{currentUser.username}</span>
              </div>
            </Link>
          </button>
          <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
              <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span>
            </div>
            <ul className="py-2" aria-labelledby="user-menu-button">
              <li>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Earnings</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
              </li>
            </ul>
          </div>
          <button data-collapse-toggle="navbar-user" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-user" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
        </button>
      </div>
      <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-red-200 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-red-200 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          {/* <li>
            <a href="/duel" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Duel</a>
          </li>
          <li>
          <a href="/leaderboard" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Leaderboard</a>
          </li> */}
          <li>
          <NavLink 
              to="/duel" 
              exact
              className="block py-2 pl-3 pr-4 rounded md:p-0 md:dark:text-blue-500" 
              // activeClassName="text-white bg-blue-700"
              activeStyle={{ backgroundColor: 'red', color: 'white' }} // This will make the link red when active
              >
              Duel
          </NavLink>
        </li>
        <li>
          <NavLink 
              to="/leaderboard" 
              exact
              className="block py-2 pl-3 pr-4 rounded md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" 
              // activeClassName="text-white bg-blue-700"
              activeStyle={{ backgroundColor: 'red', color: 'white' }} // This will make the link red when active
              >
              Leaderboard
          </NavLink>
        </li>

          <li>
            <Link onClick={handleLogout} className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Logout</Link>
          </li>
        </ul>
      </div>
      </div>
      <div>
        
      </div>
    </nav>
  </>
  )
}

export default Navbar