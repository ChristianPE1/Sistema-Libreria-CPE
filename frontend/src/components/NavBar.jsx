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
      <nav className='bg-neutral-950/90 backdrop-blur-sm border-b border-neutral-800 p-4 sticky top-0 z-50'>
         <div className='container mx-auto max-w-7xl flex flex-row justify-between items-center'>
            
            {/* Logo */}
            <Link to='/' className='text-2xl font-bold text-white group hover:text-purple-400 transition-colors duration-200'>
               Biblioteca <span className='text-purple-500 group-hover:text-purple-300 transition-colors duration-200'>Virtual</span>
            </Link>
            
            {/* Role indicator - hidden on mobile */}
            {isLogged && (
               <div className='hidden md:flex items-center gap-2'>
                  <span className='text-sm text-neutral-400'>Bienvenido,</span>
                  <span className='text-sm font-medium text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20'>
                     {role}
                  </span>
               </div>
            )}
            
            {/* Navigation links */}
            <div className='flex items-center gap-6'>
               {role === 'usuario' && (
                  <Link 
                     to='/my-requests' 
                     className='text-sm text-neutral-300 hover:text-purple-400 transition-colors duration-200 font-medium hidden sm:block'
                  >
                     Mis Solicitudes
                  </Link>
               )}
               {role === 'bibliotecario' && (
                  <Link 
                     to='/requests' 
                     className='text-sm text-neutral-300 hover:text-purple-400 transition-colors duration-200 font-medium hidden sm:block'
                  >
                     Solicitudes
                  </Link>
               )}
               {role === 'admin' && (
                  <Link 
                     to='/requests-copies' 
                     className='text-sm text-neutral-300 hover:text-purple-400 transition-colors duration-200 font-medium hidden sm:block'
                  >
                     Solicitudes Copias
                  </Link>
               )}
               
               <Link 
                  to={isLogged ? '/logout' : '/login'} 
                  className='flex items-center gap-2 text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium'
               >
                  {isLogged ? <UserIcon /> : <LoginIcon />}
                  {isLoggedLabel}
               </Link>
            </div>
         </div>
      </nav>
   );
}

NavBar.propTypes = {
   isLogged: PropTypes.bool.isRequired,
   role: PropTypes.string
};