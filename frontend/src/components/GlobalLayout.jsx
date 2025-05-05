import NavBar from '../components/NavBar';
import { Outlet } from 'react-router-dom';
import { useState,useEffect,useCallback } from 'react';
import { ACCESS_TOKEN } from '../constants';
import {jwtDecode} from 'jwt-decode';

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
      <div className="flex flex-col min-h-screen bg-red-300">
         <NavBar isLogged={isLogged} role={role} />
         <main className="flex-1 p-6 bg-slate-500">
            <Outlet context={{isLogged,role}}/>
         </main>
      </div>
   );
}