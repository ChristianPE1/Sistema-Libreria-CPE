import NavBar from '../components/NavBar';
import { Outlet } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { ACCESS_TOKEN } from '../constants';
import { jwtDecode } from 'jwt-decode';

export default function Layout() {

   const [isLogged, setIsLogged] = useState(false);
   const [role, setRole] = useState(null);

   const checkLoginStatus = useCallback(() => {
      const tokenAccess = localStorage.getItem(ACCESS_TOKEN);
      if (tokenAccess) {
         setIsLogged(true);
         const decodedToken = jwtDecode(tokenAccess);
         setRole(decodedToken.role);
      } else {
         setIsLogged(false);
         setRole(null);
      }
   }, []);

   useEffect(() => {
      checkLoginStatus();

      window.addEventListener('authChanged', checkLoginStatus);
      return () => {
         window.removeEventListener('authChanged', checkLoginStatus);
      };
   }, [checkLoginStatus]);

   return (
      <div className="min-h-screen bg-neutral-950">
         {/* background */}
         <div className="fixed inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
         </div>
         
         <div className='relative z-10'>
            <NavBar isLogged={isLogged} role={role} />
            <main className="container mx-auto px-4 py-8 max-w-7xl">
               <Outlet context={{ isLogged, role }} />
            </main>
         </div>
      </div>
   );
}