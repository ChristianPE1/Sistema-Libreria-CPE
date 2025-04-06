import { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';

const route = '/api/users/login/';

export default function Login() {

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const clearExistingTokens = () => {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      clearExistingTokens(); // Clear existing tokens before login

      try {
         const response = await api.post(route, {
            email,
            password
         });
         console.log('Success:', response.data);
         const { access, refresh } = response.data.tokens;

         localStorage.setItem(ACCESS_TOKEN, access);
         localStorage.setItem(REFRESH_TOKEN, refresh);

         navigate('/');
      }
      catch (error) {
         console.error('Error details:', error.response?.data || error.message);
         setLoading(false);
         alert('Error: ' + error.message);
      }
   }
   const demoCredentials = () => {
      setEmail('user@example.com');
      setPassword('123');
   };

   return (
      <section className='flex flex-col gap-6'>
         <h2 className='text-6xl font-bold'>Login</h2>
         <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input
               type="text"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="Email"
               required
               className='border-2 border-gray-300 rounded-md p-2'
            />
            <input
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Password"
               required
               className='border-2 border-gray-300 rounded-md p-2'
            />
            <div className="flex gap-4">
               <button type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
               </button>
               <button type="button" onClick={demoCredentials} className="bg-gray-200 p-2 rounded-md">
                  Fill Demo Credentials
               </button>
            </div>
         </form>
      </section>
   );
}