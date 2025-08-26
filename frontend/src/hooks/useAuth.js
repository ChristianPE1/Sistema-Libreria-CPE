import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import api from '../api/api';

export const useAuth = () => {
   const [isLogged, setIsLogged] = useState(false);
   const [role, setRole] = useState(null);
   const [loading, setLoading] = useState(true);

   // Refrescar el token automáticamente
   const refreshToken = useCallback(async () => {
      try {
         const refreshToken = localStorage.getItem(REFRESH_TOKEN);

         if (!refreshToken) {
            throw new Error('No refresh token available');
         }

         const response = await api.post('/api/token/refresh/', {
            refresh: refreshToken
         });

         localStorage.setItem(ACCESS_TOKEN, response.data.access);
         console.log('Token refreshed successfully');
         return true;
      } catch (error) {
         console.error('Error refreshing token:', error);
         // Limpiar tokens inválidos
         localStorage.removeItem(ACCESS_TOKEN);
         localStorage.removeItem(REFRESH_TOKEN);
         return false;
      }
   }, []);

   const checkLoginStatus = useCallback(async () => {
      try {
         const tokenAccess = localStorage.getItem(ACCESS_TOKEN);

         if (tokenAccess) {
            const decodedToken = jwtDecode(tokenAccess);
            const currentTime = Date.now() / 1000;

            // Si el token está por expirar en menos de 5 minutos
            const timeUntilExpiration = decodedToken.exp - currentTime;
            const fiveMinutes = 5 * 60;

            if (timeUntilExpiration < 0) {
               console.log('Token expired, attempting to refresh...');
               const refreshSuccess = await refreshToken();

               if (refreshSuccess) {
                  const newToken = localStorage.getItem(ACCESS_TOKEN);
                  const newDecodedToken = jwtDecode(newToken);
                  setIsLogged(true);
                  setRole(newDecodedToken.role);
               } else {
                  setIsLogged(false);
                  setRole(null);
               }
            } else if (timeUntilExpiration < fiveMinutes) {
               console.log('Token expiring soon, refreshing preventively...');
               refreshToken();
               setIsLogged(true);
               setRole(decodedToken.role);
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
   }, [refreshToken]);

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
