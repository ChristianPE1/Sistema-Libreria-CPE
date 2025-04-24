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
   const demoCredentials = (typeUser) => {
      if(typeUser === "user"){
         setEmail('user@example.com');
         setPassword('123');
      } else if(typeUser === "bibliotecario"){
         setEmail('bib@example.com')
         setPassword('123');
      } else if(typeUser === "admin"){
         setEmail('admin@example.com')
         setPassword('123');
      }
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
            <div className="flex gap-4 flex-col">
               <button
               type="submit"
               disabled={loading}
               className='bg-slate-600 cursor-pointer p-2 rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed'
               >
                  {loading ? 'Logging in...' : 'Login'}
               </button>
               <button
               type="button"
               onClick={() => demoCredentials("user")}
               className="bg-slate-600 cursor-pointer p-2 rounded-md hover:bg-slate-800">
                  Fill Demo User
               </button>
               <button
               type="button"
               onClick={() => demoCredentials("bibliotecario")}
               className="bg-slate-600 cursor-pointer p-2 rounded-md hover:bg-slate-800">
                  Fill Demo Bibliotecario
               </button>
               <button
               type="button"
               onClick={() => demoCredentials("admin")}
               className="bg-slate-600 cursor-pointer p-2 rounded-md hover:bg-slate-800">
                  Fill Demo Admin
               </button>
            </div>
         </form>
      </section>
   );
}