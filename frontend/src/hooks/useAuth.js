import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from '../constants';

export const useAuth = () => {
   const [isLogged, setIsLogged] = useState(false);
   const [role, setRole] = useState(null);
   const [loading, setLoading] = useState(true);

   const checkLoginStatus = useCallback(() => {
      try {
         const tokenAccess = localStorage.getItem(ACCESS_TOKEN);
         if (tokenAccess) {
            const decodedToken = jwtDecode(tokenAccess);

            // Verificar si el token no ha expirado
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
               // Token expirado
               localStorage.removeItem(ACCESS_TOKEN);
               setIsLogged(false);
               setRole(null);
            } else {
               setIsLogged(true);
               setRole(decodedToken.role);
            }
         } else {
            setIsLogged(false);
            setRole(null);
         }
      } catch (error) {
         console.error('Error decoding token:', error);
         setIsLogged(false);
         setRole(null);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      checkLoginStatus();

      // Escuchar cambios de autenticación
      window.addEventListener('authChanged', checkLoginStatus);
      return () => {
         window.removeEventListener('authChanged', checkLoginStatus);
      };
   }, [checkLoginStatus]);

   const hasRole = (requiredRole) => {
      return role === requiredRole;
   };

   const hasAnyRole = (roles) => {
      return roles.includes(role);
   };

   return {
      isLogged,
      role,
      loading,
      hasRole,
      hasAnyRole,
      checkLoginStatus
   };
};
