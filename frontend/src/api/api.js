import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';


const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL
});

const publicEndpoints = [
   /^\/api\/books\/?$/,                    // lista de libros
   /^\/api\/books\/[a-f0-9-]+\/$/,       // detalle de libro con UUID
];

const isPublicEndpoint = (url) => {
   try {
      const parsedUrl = new URL(url, window.location.origin);
      url = parsedUrl.pathname;
   } catch (error) {
      console.error('Error parsing URL:', error);
   }
   return publicEndpoints.some(endpoint => endpoint.test(url));
}

api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      if (token && !isPublicEndpoint(config.url)) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

export default api;