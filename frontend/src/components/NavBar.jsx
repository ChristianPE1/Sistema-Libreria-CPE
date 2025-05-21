import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserIcon from './svg/userIcon';
import LoginIcon from './svg/loginIcon';
//import { ACCESS_TOKEN } from '../constants';
//import { useEffect, useCallback } from 'react';
//import { useState } from 'react';


export default function NavBar({ isLogged, role }) {


   let isLoggedLabel = isLogged ? 'Logout' : 'Login';

   return (
      <nav className='bg-gray-800 p-4 text-white flex flex-row justify-between items-center w-full z-40'>

         <Link to='/' className='font-bold text-3xl cursor-pointer'>Biblioteca Virtual</Link>
         {isLogged && <span className='text-sm ml-4'>Welcome, {role}</span>}
         <div>
            {role === 'usuario' && <Link to='/my-requests' className='text-sm ml-4'>My Requests</Link>}
            {role === 'bibliotecario' && <Link to='/requests' className='text-sm ml-4'>Requests</Link>}
            {role === 'admin' && <Link to='/requests-copies' className='text-sm ml-4'>Requests Copies</Link>}
         </div>
         <div className='items-end'>
            <Link to={isLogged ? '/logout' : '/login'} className='text-sm ml-4 flex flex-row items-center gap-1'>
               {isLogged ? <UserIcon /> : <LoginIcon />}
               {isLoggedLabel}
            </Link>
         </div>

      </nav>
   );
}

NavBar.propTypes = {
   isLogged: PropTypes.bool.isRequired, // isLogged must be a boolean and is required
   role: PropTypes.string // role must be a string (optional)
};