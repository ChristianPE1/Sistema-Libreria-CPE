import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import api from '../api/api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { useEffect, useState,useCallback } from 'react';
import PropTypes from 'prop-types';


export default function ProtectedRoute({ children,allowedRoles }) {
   const [isAuth, setIsAuth] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [userRole, setUserRole] = useState(null);


   const refreshToken = async () => {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      
      try {
         const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
         localStorage.setItem(ACCESS_TOKEN, response.data.access);
         setIsAuth(true);
         

      } catch (error) {
         console.error(error);
         setIsAuth(false);
         localStorage.removeItem(ACCESS_TOKEN);
         localStorage.removeItem(REFRESH_TOKEN);
      }

   }

   const auth = useCallback(async () => {
      try{
         const token = localStorage.getItem(ACCESS_TOKEN);
         
         if (!token) {
            console.log('No token found');
            setIsAuth(false);
            setIsLoading(false);
            return;
         }

         let decoded;
         try{
            decoded = jwtDecode(token);
         }catch (error) {
            console.error('Token is invalid or expired', error);
            setIsAuth(false);
            setIsLoading(false);
            return;
         }

         const tokenExpired = decoded.exp
         const now = Date.now() / 1000;

         if (tokenExpired < now) {
            console.log('Token expired, refreshing...');
            await refreshToken();
            const newToken = localStorage.getItem(ACCESS_TOKEN);


            if(!token){
               console.log('No token found after refresh');
               setIsAuth(false);
               setIsLoading(false);
               return;
            }
            try{
               decoded = jwtDecode(newToken);
               console.log('Decoded token after refresh:', decoded);
            }catch (error) {
               console.error('Error decod', error);
               setIsAuth(false);
               setIsLoading(false);
               return;
            }
         }
         
         const role = decoded.role;
         console.log('Role from token:', role);
         setUserRole(role);
   
   
         console.log('Permiso de acceso:', allowedRoles.includes(role));
         setIsAuth(allowedRoles.includes(role));
         setIsLoading(false);
      }catch (error) {
         console.error('Error in auth', error);
         setIsAuth(false);
         setIsLoading(false);
      }
   },[allowedRoles])


   useEffect(() => {
      auth();
   }, [auth]);

   if (isLoading) {
      console.log('User role:', userRole);
      return <div>Loading...</div>
   }
   return isAuth ? children : <Navigate to="/login" />;
}

ProtectedRoute.propTypes = {
   children: PropTypes.node.isRequired,
   allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};