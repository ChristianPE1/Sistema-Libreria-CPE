import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
//import { ACCESS_TOKEN } from '../constants';
//import { useEffect, useCallback } from 'react';
//import { useState } from 'react';


export default function NavBar({ isLogged, role }) {

   //const tokenAccess = localStorage.getItem(ACCESS_TOKEN);
   //const [isLogged, setIsLogged] = useState(false);
   //const [role, setRole] = useState(null);

   /*const checkLoginStatus = useCallback(() => {
      if (tokenAccess) {
         setIsLogged(true);
         const decodedToken = JSON.parse(atob(tokenAccess.split('.')[1]));
         setRole(decodedToken.role);
      } else {
         setIsLogged(false);
         setRole(null);
      }
   },[tokenAccess]);

   useEffect(() => {
      checkLoginStatus();
   }, [checkLoginStatus]);*/

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
            {isLogged && <Link to='/logout' className='text-sm ml-4'>Logout</Link>}
            {!isLogged && <Link to='/login' className='text-sm ml-4'>Login</Link>}
            {!isLogged && <Link to='/register' className='text-sm ml-4'>Register</Link>}
         </div>

      </nav>
   );
}

NavBar.propTypes = {
   isLogged: PropTypes.bool.isRequired, // isLogged must be a boolean and is required
   role: PropTypes.string // role must be a string (optional)
};