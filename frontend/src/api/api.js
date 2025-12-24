import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';


const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL
});

const publicEndpoints = [
   /^\/api\/books\/?$/,                    // GET - lista de libros
   /^\/api\/books\/[a-f0-9-]+\/$/,       // GET - detalle de libro con UUID
];

const isPublicEndpoint = (url, method = 'GET') => {
   try {
      const parsedUrl = new URL(url, window.location.origin);
      url = parsedUrl.pathname;
   } catch (error) {
      console.error('Error parsing URL:', error);
   }

   // Solo permitir acceso público a endpoints de libros si es método GET
   if (method && method.toUpperCase() !== 'GET') {
      return false;
   }

   return publicEndpoints.some(endpoint => endpoint.test(url));
}

api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      if (token && !isPublicEndpoint(config.url, config.method)) {
         config.headers.Authorization = `Bearer ${token}`;
         console.log(`Token enviado para ${config.method} ${config.url}:`, token.substring(0, 20) + '...');
      } else {
         console.log(`Sin token para ${config.method} ${config.url}. Token existe:`, !!token, 'Es público:', isPublicEndpoint(config.url, config.method));
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

// Interceptor para manejar errores 401
api.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response?.status === 401) {
         // Token expirado o inválido
         localStorage.removeItem(ACCESS_TOKEN);
         localStorage.removeItem(REFRESH_TOKEN);

         // Disparar evento para actualizar el estado de autenticación
         window.dispatchEvent(new Event('authChanged'));

         if (window.location.pathname !== '/login') {
            window.location.href = '/login';
         }
      }
      return Promise.reject(error);
   }
);

export default api;